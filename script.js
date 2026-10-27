// --- FUNCIONES GLOBALES: MENÚ MÓVIL Y TRADUCCIÓN ---

function alternarMenuMovil() {
    const menu = document.getElementById('menu-navegacion');
    if (!menu) return;
    if (menu.style.display === 'flex' || menu.classList.contains('activo')) {
        menu.style.display = 'none';
        menu.classList.remove('activo');
    } else {
        menu.style.display = 'flex';
        menu.classList.add('activo');
    }
}

function cambiarIdioma(idioma) {
    localStorage.setItem('idiomaTimeWise', idioma);
    
    // 1. Traducir elementos estándar (títulos, párrafos, enlaces, etc.)
    const elementos = document.querySelectorAll('[data-es][data-en]');
    elementos.forEach(el => {
        const texto = idioma === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
        if (el.children.length === 0 || el.classList.contains('badge-bienestar')) {
            el.textContent = texto;
        } else {
            el.innerHTML = texto;
        }
    });

    // 2. Traducir de forma especial las opciones del selector de horas (evita problemas de caché del navegador)
    const opcionesSelect = document.querySelectorAll('select option[data-es-text][data-en-text]');
    opcionesSelect.forEach(opt => {
        const numero = opt.value;
        const textoUnidad = idioma === 'en' ? opt.getAttribute('data-en-text') : opt.getAttribute('data-es-text');
        opt.textContent = `${numero} ${textoUnidad}`;
    });

    // 3. Traducir placeholders si los hay
    const inputs = document.querySelectorAll('input[data-es-placeholder][data-en-placeholder]');
    inputs.forEach(input => {
        input.placeholder = idioma === 'en' ? input.getAttribute('data-en-placeholder') : input.getAttribute('data-es-placeholder');
    });
}

// Cargar el idioma guardado al abrir la página de forma automática
window.addEventListener('DOMContentLoaded', () => {
    const idiomaGuardado = localStorage.getItem('idiomaTimeWise') || 'es';
    cambiarIdioma(idiomaGuardado);
});


// --- INTERACTIVIDAD ESPECÍFICA DEL MÓDULO 1 ---

function desplegarDetalle(id) {
    const elemento = document.getElementById(id);
    if (!elemento) return;
    if (elemento.style.display === "none" || elemento.style.display === "") {
        elemento.style.display = "block";
    } else {
        elemento.style.display = "none";
    }
}

function calcularBloques() {
    let selectHoras = document.getElementById('select-horas');
    let contenedor = document.getElementById('resultado-calculadora');
    if (!selectHoras || !contenedor) return;

    let horas = selectHoras.value;
    contenedor.style.display = 'block';
    const idiomaActual = localStorage.getItem('idiomaTimeWise') || 'es';

    if (horas === "2") {
        contenedor.innerHTML = idiomaActual === 'en'
            ? `<strong style="color: #2f855a;">Recommended distribution for 2 hours:</strong><br>` +
              `• <strong>1 hour and 30 minutes:</strong> Deep focus block (Main subject or demanding reading).<br>` +
              `• <strong>30 minutes:</strong> General review and organization for the next day.`
            : `<strong style="color: #2f855a;">Distribución recomendada para 2 horas:</strong><br>` +
              `• <strong>1 hora y 30 minutos:</strong> Bloque de enfoque profundo (Asignatura principal o lectura exigente).<br>` +
              `• <strong>30 minutos:</strong> Repaso general y organización para el día siguiente.`;
    } else if (horas === "4") {
        contenedor.innerHTML = idiomaActual === 'en'
            ? `<strong style="color: #2f855a;">Recommended distribution for 4 hours:</strong><br>` +
              `• <strong>Block 1 (1.5h):</strong> High mental demand task (leveraging your energy peaks).<br>` +
              `• <strong>Active Break (15 min):</strong> Brief disconnection and hydration.<br>` +
              `• <strong>Block 2 (1.5h):</strong> Second subject, practical work, or research.<br>` +
              `• <strong>Block 3 (45 min):</strong> Supplementary readings and pending tasks review.`
            : `<strong style="color: #2f855a;">Distribución recomendada para 4 horas:</strong><br>` +
              `• <strong>Bloque 1 (1.5h):</strong> Tarea de mayor exigencia mental (aprovechando tus picos de energía).<br>` +
              `• <strong>Pausa Activa (15 min):</strong> Desconexión breve e hidratación.<br>` +
              `• <strong>Bloque 2 (1.5h):</strong> Segunda materia, trabajos prácticos o investigación.<br>` +
              `• <strong>Bloque 3 (45 min):</strong> Lecturas complementarias y revisión de pendientes.`;
    } else {
        contenedor.innerHTML = idiomaActual === 'en'
            ? `<strong style="color: #2f855a;">Recommended distribution for 6 hours:</strong><br>` +
              `• <strong>Morning/Main Block (3h):</strong> Divided into two focus sessions with complex tasks.<br>` +
              `• <strong>Lunch/Rest Break (1h):</strong> Mandatory mental recovery.<br>` +
              `• <strong>Afternoon/Secondary Block (2h):</strong> Collaborative work, reviews, and next day planning.`
            : `<strong style="color: #2f855a;">Distribución recomendada para 6 horas:</strong><br>` +
              `• <strong>Mañana/Bloque Principal (3h):</strong> Dividido en dos sesiones de enfoque con tareas complejas.<br>` +
              `• <strong>Pausa de Almuerzo/Descanso (1h):</strong> Recuperación mental obligatoria.<br>` +
              `• <strong>Tarde/Bloque Secundario (2h):</strong> Trabajos colaborativos, repasos y planificación del día siguiente.`;
    }
}
// --- LÓGICA DE PROGRESO Y GAMIFICACIÓN ---

function registrarModuloVisto(numeroModulo) {
    let modulosVistos = JSON.parse(localStorage.getItem('timeWise_modulos')) || [];
    if (!modulosVistos.includes(numeroModulo)) {
        modulosVistos.push(numeroModulo);
        localStorage.setItem('timeWise_modulos', JSON.stringify(modulosVistos));
    }
}

function actualizarBarraProgreso() {
    const barraFill = document.getElementById('progress-bar-fill');
    const textoProgreso = document.getElementById('progress-text');
    const mensajeFelicitaciones = document.getElementById('mensaje-felicitaciones');
    
    if (!barraFill || !textoProgreso) return; 

    let modulosVistos = JSON.parse(localStorage.getItem('timeWise_modulos')) || [];
    let totalModulos = 5;
    let completados = modulosVistos.length;
    if (completados > totalModulos) completados = totalModulos;

    let porcentaje = Math.round((completados / totalModulos) * 100);
    barraFill.style.width = porcentaje + '%';

    // Detectar idioma actual desde localStorage o el atributo lang de la página
    let idioma = localStorage.getItem('timeWise_idioma') || document.documentElement.lang || 'es';

    if (idioma === 'en') {
        textoProgreso.innerText = `Completed modules: ${completados} of ${totalModulos} (${porcentaje}%)`;
        if (completados === totalModulos && mensajeFelicitaciones) {
            mensajeFelicitaciones.innerText = "🎉 Congratulations! You have completed all modules and achieved full time management balance!";
            mensajeFelicitaciones.style.display = "block";
        }
    } else {
        textoProgreso.innerText = `Módulos completados: ${completados} de ${totalModulos} (${porcentaje}%)`;
        if (completados === totalModulos && mensajeFelicitaciones) {
            mensajeFelicitaciones.innerText = "🎉 ¡Felicitaciones! Has completado todos los módulos y alcanzado el balance total en tu gestión del tiempo.";
            mensajeFelicitaciones.style.display = "block";
        }
    }

    // Desbloquear insignias
    const badges = document.querySelectorAll('.badges-wrapper span');
    if (badges.length >= 3) {
        if (completados >= 1) activarBadge(badges[0]);
        if (completados >= 3) activarBadge(badges[1]);
        if (completados >= 5) activarBadge(badges[2]);
    }
}

function activarBadge(elemento) {
    if (elemento) {
        elemento.style.background = '#ecc94b';
        elemento.style.color = '#744210';
    }
}

function reiniciarProgreso() {
    localStorage.removeItem('timeWise_modulos');
    location.reload();
}

// 🌐 Conexión segura con tus funciones de idioma existentes sin bloquear clics
const cambiarIdiomaOriginal = window.cambiarIdioma;
if (typeof cambiarIdiomaOriginal === 'function') {
    window.cambiarIdioma = function(idioma) {
        localStorage.setItem('timeWise_idioma', idioma);
        cambiarIdiomaOriginal(idioma);
        setTimeout(actualizarBarraProgreso, 50);
    };
}

const cambiarIdiomaPersOriginal = window.cambiarIdiomaPersonalizado;
if (typeof cambiarIdiomaPersOriginal === 'function') {
    window.cambiarIdiomaPersonalizado = function(idioma) {
        localStorage.setItem('timeWise_idioma', idioma);
        cambiarIdiomaPersOriginal(idioma);
        setTimeout(actualizarBarraProgreso, 50);
    };
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarBarraProgreso();
});
