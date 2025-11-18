document.getElementById("formProveedor").addEventListener("submit", async (e) => {
  e.preventDefault();

  const proveedor = {
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    nit: document.getElementById("nit").value,
    direccion: document.getElementById("direccion").value,
  };

  try {
    const response = await fetch("http://localhost:8080/api/proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });

    if (!response.ok) throw new Error("Error al registrar");

    document.getElementById("mensajeExito").classList.remove("d-none");
    setTimeout(() => (window.location.href = "/proveedores"), 2000);
  } catch (err) {
    document.getElementById("mensajeError").classList.remove("d-none");
  }
});
