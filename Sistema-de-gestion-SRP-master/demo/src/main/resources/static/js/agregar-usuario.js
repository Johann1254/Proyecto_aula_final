document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("usuarioForm");
  const alertaExito = document.getElementById("alertaExito");
  const overlay = document.getElementById("overlay");
  const btnCerrarAlerta = document.querySelector("#alertaExito .dismiss");
  const btnAceptarAlerta = document.querySelector("#alertaExito .track");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");
      return;
    }

    const nuevoUsuario = {
      usuario: document.getElementById("usuario").value,
      correo: document.getElementById("correo").value,
      contrasena: document.getElementById("contrasena").value,
      rol: document.getElementById("rol").value,
      activo: document.getElementById("activo").checked,
    };

    const resultado = await crearUsuario(nuevoUsuario);

    if (resultado) {
      formulario.reset();
      mostrarAlerta("¡Usuario registrado!", "El usuario se ha creado correctamente.", true);
    } else {
      mostrarAlerta("Error", "Hubo un problema al registrar el usuario.", false);
    }
  });

  async function crearUsuario(usuario) {
    try {
      const token = document.querySelector('meta[name="_csrf"]')?.getAttribute("content");
      const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute("content");

      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && header ? { [header]: token } : {}),
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return null;
    }
  }

  function mostrarAlerta(titulo, mensaje, esExito) {
    const tituloElemento = alertaExito.querySelector(".title");
    const mensajeElemento = alertaExito.querySelector(".message");

    tituloElemento.textContent = titulo;
    mensajeElemento.textContent = mensaje;

    overlay.style.display = "block";
    alertaExito.classList.remove("d-none");
    alertaExito.style.display = "flex";

    setTimeout(() => {
      ocultarAlerta(esExito);
    }, 4000);
  }

  function ocultarAlerta(esExito) {
    overlay.style.display = "none";
    alertaExito.classList.add("d-none");
    alertaExito.style.display = "none";

    if (esExito) window.location.href = "/usuarios";
  }

  btnCerrarAlerta.addEventListener("click", () => ocultarAlerta(false));
  btnAceptarAlerta.addEventListener("click", () => ocultarAlerta(true));
});
