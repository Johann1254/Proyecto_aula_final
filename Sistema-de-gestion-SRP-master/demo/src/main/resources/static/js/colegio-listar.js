const apiColegios = "/api/colegios"; // No uses localhost si la app sirve el API
const tablaBody = document.querySelector("#tablaColegios tbody");

// ⏳ Cargar colegios al iniciar vista
document.addEventListener("DOMContentLoaded", async () => {
    await cargarColegios();
    activarDataTable();
});

// ======================================================
// 🔹 Cargar lista de colegios
// ======================================================
async function cargarColegios() {
    try {
        const res = await fetch(apiColegios);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay colegios registrados.</td>
                </tr>`;
            return;
        }

        tablaBody.innerHTML = data
            .map(
                (c) => `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.direccion || "-"}</td>
                
                <td class="text-center">
                    <button class="btn btn-info btn-sm" title="Editar" onclick="editarColegio('${c.id}')">
                        <i class="fas fa-edit"></i>
                    </button>

                    <button class="btn btn-danger btn-sm ms-1" title="Eliminar" onclick="eliminarColegio('${c.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
            )
            .join("");
    } catch (err) {
        console.error("Error al cargar colegios:", err);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">Error cargando datos.</td>
            </tr>`;
    }
}

// ======================================================
// 🗑️ Eliminar colegio con confirmación estilo SB Admin
// ======================================================
async function eliminarColegio(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar colegio?",
        text: "Esta acción también eliminará el o los uniformes asociados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6"
    });

    if (!confirmacion.isConfirmed) return;

    try {
        const res = await fetch(`${apiColegios}/${id}`, { method: "DELETE" });

        if (res.ok) {
            Swal.fire({
                title: "Eliminado",
                text: "El colegio ha sido eliminado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            cargarColegios();

        } else {
            const err = await res.text();

            Swal.fire({
                title: "Error",
                text: "Error al eliminar: " + err,
                icon: "error"
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar al servidor.",
            icon: "error"
        });
    }
}


// ======================================================
// ✏️ Editar colegio
// ======================================================
function editarColegio(id) {
    window.location.href = `/colegio/editar/${id}`;
}

// ======================================================
// 📊 Activar DataTable igual que en la vista "Salidas"
// ======================================================
function activarDataTable() {
    if ($.fn.DataTable.isDataTable("#tablaColegios")) {
        $("#tablaColegios").DataTable().destroy();
    }

    $("#tablaColegios").DataTable({
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json",
        },
    });
}
