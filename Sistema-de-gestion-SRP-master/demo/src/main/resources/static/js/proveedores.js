document.addEventListener("DOMContentLoaded", async () => {
  const tabla = $("#dataTable").DataTable();

  try {
    const response = await fetch("http://localhost:8080/api/proveedores");
    const proveedores = await response.json();

    tabla.clear();
    proveedores.forEach((p) => {
      tabla.row.add([
        p.nombre,
        p.telefono,
        p.nit,
        p.direccion,
        `
        <a href="/proveedores/editar?id=${p.id}" class="btn btn-sm btn-warning">
          <i class="fas fa-edit"></i>
        </a>
        <button class="btn btn-sm btn-danger eliminar" data-id="${p.id}">
          <i class="fas fa-trash"></i>
        </button>
        `
      ]);
    });
    tabla.draw();
  } catch (err) {
    console.error("Error al cargar proveedores:", err);
  }
});
