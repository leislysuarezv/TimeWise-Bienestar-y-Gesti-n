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