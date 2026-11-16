import { supabase } from './supabase.js';

const contenedorMenu = document.getElementById("sidebar-container");

if (contenedorMenu) {

    const paginaActual = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    // OPCIONES DEL MENÚ
    const opciones = [
        { nombre: "Inicio", archivo: "inicio.html", icono: "⌂" },
        { nombre: "Explorar objetos", archivo: "explorar-objetos.html", icono: "⌕" },
        { nombre: "Buscar coincidencias", archivo: "buscar-coincidencias.html", icono: "⌕" },
        { nombre: "Reportar objeto perdido", archivo: "reportar-perdido.html", icono: "＋" },
        { nombre: "Reportar objeto encontrado", archivo: "reportar-encontrado.html", icono: "+" },
        { nombre: "Mis reportes", archivo: "mis-reportes.html", icono: "▤" },
        { nombre: "Mensajes", archivo: "mensajes.html", icono: "✉" },
        { nombre: "Ajustes de la aplicación", archivo: "ajustes.html", icono: "⚙" },
        { nombre: "Sobre ¿Quién lo vio?", archivo: "acerca.html", icono: "ⓘ" },
        { nombre: "Notificaciones", archivo: "notificaciones.html", icono: "🔔" }
    ];

    // CONSTRUIR MENÚ
    contenedorMenu.innerHTML = `
        <aside class="sidebar">

            <a href="inicio.html" class="brand-link">
                <img
                    src="../css/logo.png"
                    alt="Logo de ¿Quién lo vio?"
                    class="brand-logo"
                >

                <br>

                <span>
                    <b>¿Quién lo vio?</b>
                    <br>
                    <small>Sistema Inteligente de Objetos Perdidos</small>
                </span>
            </a>

            <nav>
                ${opciones.map(opcion => `
                    <a
                        href="${opcion.archivo}"
                        class="${paginaActual === opcion.archivo ? "active" : ""}"
                    >
                        <span class="nav-icon">${opcion.icono}</span>
                        <span>${opcion.nombre}</span>
                    </a>
                `).join("")}
            </nav>

            <div class="sidebar-footer">
                <a href="#" id="cerrar-sesion" class="logout-link">
                    <span class="nav-icon">↪</span>
                    <span>Cerrar sesión</span>
                </a>
            </div>

        </aside>
    `;

    // CERRAR SESIÓN
    const botonCerrarSesion = document.getElementById("cerrar-sesion");

    botonCerrarSesion.addEventListener("click", async (e) => {

        e.preventDefault();

        const confirmar = confirm("¿Deseas cerrar tu sesión?");

        if (!confirmar) return;

        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("No se pudo cerrar la sesión: " + error.message);
            return;
        }

        window.location.href = "login.html";

    });
}


// CARGAR FOTO DE PERFIL EN TODAS LAS PÁGINAS
async function cargarFotoPerfil() {

    const { data: usuarioData, error: errorUsuario } =
        await supabase.auth.getUser();

    if (errorUsuario || !usuarioData.user) return;

    const usuario = usuarioData.user;

    const { data, error } = await supabase
        .from('usuarios')
        .select('foto_perfil')
        .eq('id', usuario.id)
        .single();

    if (error) {
        console.error('Error al cargar la foto de perfil:', error);
        return;
    }

    if (!data.foto_perfil) return;

    // BUSCAR AVATARES DE LA BARRA SUPERIOR
    const avatares = document.querySelectorAll('.topbar .avatar.small');

    avatares.forEach(avatar => {

        const imagen = document.createElement('img');

        imagen.src = data.foto_perfil;
        imagen.alt = 'Foto de perfil';
        imagen.className = 'foto-avatar-menu';

        avatar.innerHTML = '';
        avatar.appendChild(imagen);

    });
}

cargarFotoPerfil();
