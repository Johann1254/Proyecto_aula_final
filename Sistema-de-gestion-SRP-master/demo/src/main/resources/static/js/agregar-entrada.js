document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formEntrada");

  const inputNombre = document.getElementById("nombre");
  const inputInsumoId = document.getElementById("insumoIdSeleccionado");
  const inputCantidad = document.getElementById("cantidad");
  const inputUnidadM = document.getElementById("unidadM");
  const listaSugerencias = document.getElementById("sugerencias");
  const tablaInsumos = document.getElementById("tabla-insumos");

  const insumosAgregados = [];

  const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
  const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

  // Bloquear cantidad al inicio
  inputCantidad.disabled = true;

  // Establecer fecha actual
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    fechaInput.value = new Date().toISOString().split("T")[0];
  }

  // ===============================
  // AUTOCOMPLETADO
  // ===============================
  inputNombre.addEventListener("input", async () => {
    const texto = inputNombre.value.trim();

    inputInsumoId.value = "";
    inputUnidadM.value = "";
    inputCantidad.disabled = true;

    if (texto.length < 2) {
      listaSugerencias.innerHTML = "";
      return;
    }

    try {
      const respuesta = await fetch(`/api/insumos/buscar?nombre=${encodeURIComponent(texto)}`);
      const sugerencias = await respuesta.json();

      listaSugerencias.innerHTML = "";

      if (sugerencias.length > 0) {
        sugerencias.forEach((insumo) => {
          const item = document.createElement("button");
          item.classList.add("list-group-item", "list-group-item-action");
          item.textContent = insumo.nombre;

          item.addEventListener("click", () => {
            inputNombre.value = insumo.nombre;
            inputInsumoId.value = insumo.id || insumo._id;
            inputUnidadM.value = insumo.unidadM;
            inputUnidadM.readOnly = true;
            inputCantidad.disabled = false;
            listaSugerencias.innerHTML = "";
          });

          listaSugerencias.appendChild(item);
        });
      } else {
        const item = document.createElement("div");
        item.classList.add("list-group-item");
        item.textContent = "Sin resultados";
        listaSugerencias.appendChild(item);
      }
    } catch (err) {
      console.error("Error al obtener sugerencias:", err);
    }
  });

  // Cerrar sugerencias al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#nombre") && !e.target.closest("#sugerencias")) {
      listaSugerencias.innerHTML = "";
    }
  });

  // ===============================
  // AGREGAR INSUMO
  // ===============================
  document.getElementById("btnAgregarInsumo").addEventListener("click", () => {
    const id = inputInsumoId.value;
    const nombre = inputNombre.value.trim();
    const cantidad = parseInt(inputCantidad.value, 10);

    if (!id || !nombre || isNaN(cantidad) || cantidad <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Datos inválidos",
        text: "Selecciona un insumo válido y una cantidad positiva.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    // Verificar repetido
    if (insumosAgregados.some((i) => i.insumoId === id)) {
      Swal.fire({
        icon: "info",
        title: "Insumo duplicado",
        text: "Este insumo ya fue agregado.",
      });
      return;
    }

    insumosAgregados.push({ insumoId: id, nombre, cantidad });

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nombre}</td>
      <td>${cantidad}</td>
      <td><button class="btn btn-sm btn-danger btnEliminar">Eliminar</button></td>
    `;
    tablaInsumos.appendChild(fila);

    fila.querySelector(".btnEliminar").addEventListener("click", async () => {
      const confirm = await Swal.fire({
        title: "¿Eliminar insumo?",
        text: "Este insumo se quitará de la lista.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar"
      });

      if (confirm.isConfirmed) {
        tablaInsumos.removeChild(fila);
        const index = insumosAgregados.findIndex((i) => i.insumoId === id);
        if (index !== -1) insumosAgregados.splice(index, 1);
      }
    });

    inputNombre.value = "";
    inputInsumoId.value = "";
    inputUnidadM.value = "";
    inputCantidad.value = "";
    inputCantidad.disabled = true;
  });

  // ===============================
  // GUARDAR ENTRADA
  // ===============================
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    formulario.classList.add("was-validated");

    if (!formulario.checkValidity()) return;

    if (insumosAgregados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Lista vacía",
        text: "Debes agregar al menos un insumo.",
      });
      return;
    }

    const datosEntrada = {
      fecha: fechaInput.value,
      proveedor: document.getElementById("proveedor").value,
      descripcion: document.getElementById("descripcion").value,
      detalles: insumosAgregados,
    };

    try {
      const headers = { "Content-Type": "application/json" };
      if (csrfToken && csrfHeader) headers[csrfHeader] = csrfToken;

      const res = await fetch("http://localhost:8080/api/entradas", {
        method: "POST",
        headers,
        body: JSON.stringify(datosEntrada),
      });

      if (!res.ok) throw new Error(await res.text());

      await Swal.fire({
        icon: "success",
        title: "Entrada registrada",
        text: "La entrada se guardó exitosamente.",
        timer: 2200,
        showConfirmButton: false,
      });

      window.location.href = "/inventario";

    } catch (err) {
      console.error("Error al guardar entrada:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la entrada.",
      });
    }
  });

  // ===============================
  // LIMPIAR FORMULARIO
  // ===============================
  document.getElementById("btnLimpiar").addEventListener("click", () => {
    formulario.reset();
    formulario.classList.remove("was-validated");
    inputInsumoId.value = "";
    inputUnidadM.value = "";
    listaSugerencias.innerHTML = "";
    inputCantidad.disabled = true;
    tablaInsumos.innerHTML = "";
    insumosAgregados.length = 0;

    Swal.fire({
      icon: "info",
      title: "Formulario limpiado",
      timer: 1200,
      showConfirmButton: false
    });
  });
});

// ===============================
// CARGAR PROVEEDORES
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/proveedores")
    .then((response) => response.json())
    .then((data) => {
      const selectProveedor = document.getElementById("proveedor");
      data.forEach((prov) => {
        const option = document.createElement("option");
        option.value = prov.id;
        option.textContent = prov.nombre;
        selectProveedor.appendChild(option);
      });
    })
    .catch(() =>
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de proveedores.",
      })
    );
});
