document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const alertaConfirmacion = document.getElementById("alertaConfirmacion");
  const btnAceptar = alertaConfirmacion.querySelector(".track");
  const btnCancelar = alertaConfirmacion.querySelector(".dismiss");

  let idSeleccionado = null;

  // Detectar clic en botón eliminar
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".eliminar")) {
      idSeleccionado = e.target.closest(".eliminar").dataset.id;
      mostrarAlerta();
    }
  });

  function mostrarAlerta() {
    overlay.style.display = "block";
    alertaConfirmacion.classList.remove("d-none");
    alertaConfirmacion.style.display = "flex";
  }

  function ocultarAlerta() {
    overlay.style.display = "none";
    alertaConfirmacion.classList.add("d-none");
    alertaConfirmacion.style.display = "none";
  }

  btnCancelar.addEventListener("click", ocultarAlerta);

  btnAceptar.addEventListener("click", async () => {
    if (!idSeleccionado) return;

    try {
      const response = await fetch(`http://localhost:8080/api/proveedores/${idSeleccionado}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      ocultarAlerta();
      alert("✅ Proveedor eliminado correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("❌ No se pudo eliminar el proveedor.");
    }
  });
});
