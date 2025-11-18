document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return alert("Proveedor no encontrado");

  try {
    const res = await fetch(`http://localhost:8080/api/proveedores/${id}`);
    const p = await res.json();

    document.getElementById("id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("telefono").value = p.telefono;
    document.getElementById("nit").value = p.nit;
    document.getElementById("direccion").value = p.direccion;
  } catch (err) {
    console.error("Error al cargar proveedor:", err);
  }

  document.getElementById("proveedorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const proveedor = {
      id,
      nombre: document.getElementById("nombre").value,
      telefono: document.getElementById("telefono").value,
      nit: document.getElementById("nit").value,
      direccion: document.getElementById("direccion").value,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/proveedores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });

      if (!res.ok) throw new Error("Error al actualizar");
      alert("Proveedor actualizado correctamente");
      window.location.href = "/proveedores";
    } catch (err) {
      alert("Error al actualizar el proveedor");
    }
  });
});
