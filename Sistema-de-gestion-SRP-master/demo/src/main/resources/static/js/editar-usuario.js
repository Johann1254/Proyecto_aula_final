document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = new URLSearchParams(window.location.search).get("id");
  if (usuarioId) await cargarDatosUsuario(usuarioId);

  const formulario = document.getElementById("usuarioForm");
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");
      return;
    }

    const datosUsuario = {
      id: document.getElementById("id").value,
      usuario: document.getElementById("usuario").value,
      correo: document.getElementById("correo").value,
      contrasena: document.getElementById("contrasena").value,
      rol: document.getElementById("rol").value,
      activo: document.getElementById("activo").checked,
    };

    const resultado = await actualizarUsuario(datosUsuario.id, datosUsuario);

    if (resultado) {
      mostrarAlerta("✅ Usuario actualizado correctamente.", "success");
      setTimeout(() => (window.location.href = "/usuarios"), 1500);
    } else {
      mostrarAlerta("❌ Error al actualizar el usuario.", "danger");
    }
  });
});

async function cargarDatosUsuario(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/usuarios/${id}`);
    if (!response.ok) throw new Error(`Error al obtener usuario: ${response.status}`);

    const usuario = await response.json();
    document.getElementById("id").value = usuario.id || "";
    document.getElementById("usuario").value = usuario.usuario || "";
    document.getElementById("correo").value = usuario.correo || "";
    document.getElementById("rol").value = usuario.rol || "";
    document.getElementById("activo").checked = usuario.activo || false;
  } catch (error) {
    console.error("Error al cargar usuario:", error);
    mostrarAlerta("❌ No se pudo cargar el usuario.", "danger");
  }
}

async function actualizarUsuario(id, datosUsuario) {
  try {
    const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosUsuario),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar:", error);
    return null;
  }
}

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.getElementById("alerta");
  alerta.textContent = mensaje;
  alerta.className = `alert alert-${tipo} text-center`;
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 4000);
}
