const appContainer = document.getElementById('app-container');
const logoWrapper = document.getElementById('logo-wrapper');
const menuButtons = document.getElementById('menu-buttons');
const escenarioContainer = document.getElementById('escenario-container');
const personajeRandomEl = document.getElementById('personaje-random');
const skipHint = document.getElementById('skip-hint');
const soulHeart = document.getElementById('soul-heart');

const btnPersonajes = document.getElementById('btn-personajes');
const btnInicio = document.getElementById('btn-inicio');
const containerCrear = document.getElementById('container-crear');
const btnCrear = document.getElementById('btn-crear');
const labelBtnCrear = document.getElementById('label-btn-crear');
const btnSubAdmin = document.getElementById('btn-sub-admin');
const btnSubCrear = document.getElementById('btn-sub-crear');

const creatorSection = document.getElementById('character-creator-section');
const listSection = document.getElementById('character-list-section');
const adminSection = document.getElementById('character-admin-section');
const charactersContainer = document.getElementById('characters-container');

const characterForm = document.getElementById('character-form');
const formResponse = document.getElementById('form-response');

const selectEditCharacter = document.getElementById('select-edit-character');

// CORRECCIÓN: Separar el contenedor visual del formulario real
const adminFormContainer = document.getElementById('admin-character-form');
const adminCharacterForm = document.getElementById('admin-form-data');

const adminFormResponse = document.getElementById('admin-form-response');
const btnDeleteCharacter = document.getElementById('btn-delete-character');

let animationFinished = false;
let animationTimer = null;
let currentInteractiveIndex = 0;
let hasCharactersInDB = false;
let loadedCharacters = [];

/* --- CATÁLOGO DE SPRITES EN SVG --- */
const spriteCatalog = {
    head: [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="2" width="8" height="10" fill="white"/><rect x="6" y="5" width="2" height="2" fill="black"/><rect x="10" y="5" width="2" height="2" fill="black"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="8" fill="cyan"/><rect x="5" y="6" width="2" height="2" fill="red"/><rect x="9" y="6" width="2" height="2" fill="red"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><polygon points="8,2 3,12 13,12" fill="yellow"/><circle cx="7" cy="7" r="1" fill="black"/><circle cx="9" cy="7" r="1" fill="black"/></svg>'
    ],
    torso: [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="2" width="8" height="12" fill="gray"/><rect x="7" y="2" width="2" height="12" fill="blue"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="13" fill="purple"/><rect x="6" y="5" width="4" height="4" fill="yellow"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="3" width="8" height="10" fill="green"/></svg>'
    ],
    legs: [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="5" y="1" width="2" height="12" fill="white"/><rect x="9" y="1" width="2" height="12" fill="white"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="2" width="3" height="10" fill="blue"/><rect x="9" y="2" width="3" height="10" fill="blue"/></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="5" y="0" width="6" height="14" fill="red"/></svg>'
    ]
};

// Rutas a las imágenes de los personajes del escenario
const personajesList = [
    "img/toriel.png",
    "img/sans.png",
    "img/annoying_dog.png",
    "img/flowey.png"
];

function actualizarPersonaje(rutaImagen) {
    if (!personajeRandomEl) return;

    if (rutaImagen.includes('toriel')) {
        personajeRandomEl.className = 'personaje-img sprite-toriel';
    } else if (rutaImagen.includes('sans')) {
        personajeRandomEl.className = 'personaje-img sprite-sans';
    } else if (rutaImagen.includes('perro') || rutaImagen.includes('annoying_dog')) {
        personajeRandomEl.className = 'personaje-img sprite-perro';
    } else if (rutaImagen.includes('flowey')) {
        personajeRandomEl.className = 'personaje-img sprite-flowey';
    } else {
        personajeRandomEl.className = 'personaje-img';
    }

    personajeRandomEl.src = rutaImagen;
}

function cargarPersonajeAleatorio() {
    if (personajeRandomEl && personajesList.length > 0) {
        const randomIndex = Math.floor(Math.random() * personajesList.length);
        actualizarPersonaje(personajesList[randomIndex]);
    }
}

function startAnimation() {
    cargarPersonajeAleatorio();

    setTimeout(() => {
        logoWrapper.classList.add('moved-up');
    }, 100);

    animationTimer = setTimeout(() => {
        finishAnimation();
    }, 2600);
}

function finishAnimation() {
    if (animationFinished) return;
    animationFinished = true;

    clearTimeout(animationTimer);

    logoWrapper.style.transition = 'top 0.3s ease-out';
    logoWrapper.classList.add('moved-up');
    
    menuButtons.classList.add('visible');
    escenarioContainer.classList.add('visible');
    skipHint.classList.add('hidden');

    checkCharactersStatus();
}

function checkCharactersStatus() {
    fetch('php/obtener_personajes.php')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.personajes && data.personajes.length > 0) {
                hasCharactersInDB = true;
                loadedCharacters = data.personajes;
                labelBtnCrear.innerHTML = "crea tu personaje &#9661;";
                containerCrear.classList.add('dropdown');
            } else {
                hasCharactersInDB = false;
                loadedCharacters = [];
                labelBtnCrear.innerHTML = "crea tu personaje";
                containerCrear.classList.remove('dropdown');
            }
            renderCharacterList();
            populateEditSelect();
        })
        .catch(() => {
            hasCharactersInDB = false;
            labelBtnCrear.innerHTML = "crea tu personaje";
            containerCrear.classList.remove('dropdown');
        });
}

let currentHeartTarget = null;

function positionHeartOnElement(element) {
    if (!element) return;

    currentHeartTarget = element;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const left = rect.left + scrollLeft + 12; 
    const top = rect.top + scrollTop + (rect.height / 2) - 8;

    soulHeart.style.left = `${left}px`;
    soulHeart.style.top = `${top}px`;
    soulHeart.classList.add('active');
}

/* Si cambia el zoom, el tamaño de ventana o se hace scroll, el corazón
   recalcula su posición sobre el mismo botón en vez de quedar flotando
   en coordenadas viejas (y posiblemente fuera de la pantalla). */
function repositionHeartIfNeeded() {
    if (!currentHeartTarget) return;

    const stillVisible = document.body.contains(currentHeartTarget) &&
        currentHeartTarget.offsetWidth > 0 &&
        currentHeartTarget.offsetHeight > 0;

    if (!stillVisible) {
        soulHeart.classList.remove('active');
        currentHeartTarget = null;
        return;
    }

    positionHeartOnElement(currentHeartTarget);
}

window.addEventListener('resize', repositionHeartIfNeeded);
window.addEventListener('scroll', repositionHeartIfNeeded, { passive: true });
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', repositionHeartIfNeeded);
    window.visualViewport.addEventListener('scroll', repositionHeartIfNeeded);
}

function getVisibleButtons() {
    return Array.from(document.querySelectorAll('.btn:not(.hidden)'))
        .filter(b => b.offsetWidth > 0 && b.offsetHeight > 0);
}

document.addEventListener('mousemove', (e) => {
    if (!animationFinished) return;
    const targetBtn = e.target.closest('.btn');
    if (targetBtn) {
        positionHeartOnElement(targetBtn);
    }
});

function toggleDropdown(button) {
    const dropdown = button.closest('.dropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));

    if (!isOpen) {
        dropdown.classList.add('open');
    }
}

btnPersonajes.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!animationFinished) finishAnimation();
    toggleDropdown(btnPersonajes);
});

btnCrear.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!animationFinished) finishAnimation();

    if (hasCharactersInDB) {
        toggleDropdown(btnCrear);
    } else {
        resetCreatorStep();
        showPanel(creatorSection);
    }
});

btnPersonajes.parentElement.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        showPanel(listSection);
    });
});

btnSubCrear.addEventListener('click', () => {
    resetCreatorStep();
    showPanel(creatorSection);
});

btnSubAdmin.addEventListener('click', () => {
    showPanel(adminSection);
    populateEditSelect();
});

function showPanel(panel) {
    listSection.classList.add('hidden');
    creatorSection.classList.add('hidden');
    adminSection.classList.add('hidden');

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth' });
}

/* --- VOLVER AL INICIO (deja la página limpia, sin paneles abiertos) --- */
function goHome() {
    listSection.classList.add('hidden');
    creatorSection.classList.add('hidden');
    adminSection.classList.add('hidden');

    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnInicio.addEventListener('click', () => {
    if (!animationFinished) finishAnimation();
    goHome();
});

function renderCharacterList() {
    charactersContainer.innerHTML = "";

    loadedCharacters.forEach(c => {
        const atkPercent = Math.max(0, Math.min(100, (parseInt(c.ataque) || 0) / 99 * 100));
        const defPercent = Math.max(0, Math.min(100, (parseInt(c.defensa) || 0) / 99 * 100));
        const hpPercent = Math.max(0, Math.min(100, (parseInt(c.vida) || 0) / 99 * 100));

        const headVal = c.sprite_head ?? c.sprite_cabeza ?? c.cabeza ?? c.head;
        const torsoVal = c.sprite_torso ?? c.torso;
        const legsVal = c.sprite_legs ?? c.sprite_piernas ?? c.piernas ?? c.legs;

        const headSrc = resolveSpriteSource(headVal, 'head', spriteCatalog.head[0]);
        const torsoSrc = resolveSpriteSource(torsoVal, 'torso', spriteCatalog.torso[0]);
        const legsSrc = resolveSpriteSource(legsVal, 'legs', spriteCatalog.legs[0]);

        const charHTML = `
            <div class="character-card">
                <div class="char-header">
                    <h3>${c.nombre.toUpperCase()} ${c.apellido.toUpperCase()}</h3>
                    <span class="badge">${c.raza}</span>
                </div>
                <div class="char-stats">
                    <p><strong>ATK:</strong> ${c.ataque}</p>
                    <p><strong>DEF:</strong> ${c.defensa}</p>
                    <p><strong>HP:</strong> ${c.vida}</p>
                </div>
                <div class="stat-hp-track"><div class="stat-hp-fill" style="width: ${hpPercent}%;"></div></div>

                <p class="card-toggle-hint">&#9662; Ver estadísticas</p>

                <div class="character-details hidden">
                    <div class="character-mini-sprite">
                        <img class="mini-part mini-head" src='${headSrc}' alt="Cabeza">
                        <img class="mini-part mini-torso" src='${torsoSrc}' alt="Torso">
                        <img class="mini-part mini-legs" src='${legsSrc}' alt="Piernas">
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-row">
                            <span class="stat-bar-label">ATK</span>
                            <div class="stat-bar-track"><div class="stat-bar-fill atk" style="width: ${atkPercent}%;"></div></div>
                            <span class="stat-bar-value">${c.ataque}</span>
                        </div>
                        <div class="stat-bar-row">
                            <span class="stat-bar-label">DEF</span>
                            <div class="stat-bar-track"><div class="stat-bar-fill def" style="width: ${defPercent}%;"></div></div>
                            <span class="stat-bar-value">${c.defensa}</span>
                        </div>
                        <div class="stat-bar-row">
                            <span class="stat-bar-label">HP</span>
                            <div class="stat-bar-track"><div class="stat-bar-fill hp" style="width: ${hpPercent}%;"></div></div>
                            <span class="stat-bar-value">${c.vida}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        charactersContainer.insertAdjacentHTML('beforeend', charHTML);
    });
}

/* --- EXPANDIR / COLAPSAR ESTADÍSTICAS AL CLICKEAR UNA TARJETA --- */
charactersContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.character-card');
    if (!card) return;

    const details = card.querySelector('.character-details');
    const hint = card.querySelector('.card-toggle-hint');
    if (!details) return;

    const nowHidden = details.classList.toggle('hidden');
    card.classList.toggle('expanded', !nowHidden);
    if (hint) {
        hint.innerHTML = nowHidden ? '&#9662; Ver estadísticas' : '&#9652; Ocultar estadísticas';
    }
});

function populateEditSelect() {
    selectEditCharacter.innerHTML = '<option value="">-- Selecciona un personaje --</option>';
    loadedCharacters.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.nombre} ${c.apellido} (${c.raza})`;
        selectEditCharacter.appendChild(option);
    });
}

/* --- OBTENCIÓN Y VALIDACIÓN DE RUTA DE SPRITES --- */
function resolveSpriteSource(val, category, defaultFallback) {
    if (!val) return defaultFallback;
    
    if (typeof val === 'string' && (val.startsWith('data:image/') || val.startsWith('http') || val.startsWith('img/'))) {
        return val;
    }
    
    const numIndex = parseInt(val);
    if (!isNaN(numIndex) && spriteCatalog[category] && spriteCatalog[category][numIndex]) {
        return spriteCatalog[category][numIndex];
    }
    
    return defaultFallback;
}

selectEditCharacter.addEventListener('change', () => {
    const charId = selectEditCharacter.value;
    if (!charId) {
        adminFormContainer.classList.add('hidden'); // Usa el contenedor principal del form
        return;
    }

    const character = loadedCharacters.find(c => String(c.id) === String(charId));
    
    if (character) {
        document.getElementById('edit-id').value = character.id;
        document.getElementById('edit-nombre').value = character.nombre || '';
        document.getElementById('edit-apellido').value = character.apellido || '';
        document.getElementById('edit-raza').value = character.raza || 'Humano';
        document.getElementById('edit-ataque').value = character.ataque || 10;
        document.getElementById('edit-defensa').value = character.defensa || 10;
        document.getElementById('edit-vida').value = character.vida || 20;

    const headVal = character.sprite_head ?? character.sprite_cabeza ?? character.cabeza ?? character.head;
const torsoVal = character.sprite_torso ?? character.torso;
const legsVal = character.sprite_legs ?? character.sprite_piernas ?? character.piernas ?? character.legs;

        const headImg = document.getElementById('admin-preview-head');
        const torsoImg = document.getElementById('admin-preview-torso');
        const legsImg = document.getElementById('admin-preview-legs');

        if (headImg) headImg.src = resolveSpriteSource(headVal, 'head', spriteCatalog.head[0]);
        if (torsoImg) torsoImg.src = resolveSpriteSource(torsoVal, 'torso', spriteCatalog.torso[0]);
        if (legsImg) legsImg.src = resolveSpriteSource(legsVal, 'legs', spriteCatalog.legs[0]);
        
        const previewName = document.getElementById('admin-preview-name');
        if (previewName) {
            previewName.innerText = (character.nombre || '').toUpperCase();
        }

        adminFormContainer.classList.remove('hidden'); // Muestra la caja visual
    }
});

/* --- LÓGICA DEL CREADOR ESTILO GONER MAKER --- */
let currentStep = 0;
const stepKeys = ['head', 'torso', 'legs', 'final'];
const stepTitles = [
    "SELECCIONA LA CABEZA QUE PREFIERAS",
    "SELECCIONA EL TORSO QUE PREFIERAS",
    "SELECCIONA LAS PIERNAS Y ZAPATILLAS QUE PREFIERAS",
    "CREA TU PERSONAJE"
];

let selectedIndexes = { head: 0, torso: 0, legs: 0 };

function updateCarouselView() {
    const key = stepKeys[currentStep];
    if (key === 'final') return;

    const options = spriteCatalog[key];
    const currentIndex = selectedIndexes[key];

    const previewEl = document.getElementById(`preview-${key}`);
    if (previewEl && options[currentIndex]) {
        previewEl.src = options[currentIndex];
    }

    const counterEl = document.getElementById('part-counter');
    if (counterEl) {
        counterEl.innerText = `${currentIndex + 1} / ${options.length}`;
    }
}

function resetCreatorStep() {
    currentStep = 0;
    selectedIndexes = { head: 0, torso: 0, legs: 0 };
    
    document.getElementById('creator-step-title').innerText = stepTitles[0];
    document.getElementById('carousel-controls').classList.remove('hidden');
    document.getElementById('final-stats-fields').classList.add('hidden');
    
    const btnAction = document.getElementById('btn-step-action');
    if (btnAction) {
        btnAction.querySelector('.btn-text').innerText = "SIGUIENTE";
    }

    ['head', 'torso', 'legs'].forEach(part => {
        const el = document.getElementById(`preview-${part}`);
        if (el) el.src = spriteCatalog[part][0];
    });

    updateCarouselView();
    formResponse.innerText = "";
}

function navigatePart(direction) {
    const key = stepKeys[currentStep];
    const options = spriteCatalog[key];
    if (!options) return;

    selectedIndexes[key] = (selectedIndexes[key] + direction + options.length) % options.length;
    updateCarouselView();
}

document.getElementById('btn-prev-part').addEventListener('click', () => navigatePart(-1));
document.getElementById('btn-next-part').addEventListener('click', () => navigatePart(1));

document.getElementById('btn-step-action').addEventListener('click', function() {
    if (currentStep < 2) {
        currentStep++;
        document.getElementById('creator-step-title').innerText = stepTitles[currentStep];
        updateCarouselView();
    } else if (currentStep === 2) {
        currentStep = 3;
        document.getElementById('creator-step-title').innerText = stepTitles[3];
        document.getElementById('carousel-controls').classList.add('hidden');
        document.getElementById('final-stats-fields').classList.remove('hidden');
        this.querySelector('.btn-text').innerText = "GUARDAR EN BD";
    } else {
        document.getElementById('sprite-head').value = spriteCatalog.head[selectedIndexes.head];
        document.getElementById('sprite-torso').value = spriteCatalog.torso[selectedIndexes.torso];
        document.getElementById('sprite-legs').value = spriteCatalog.legs[selectedIndexes.legs];

        characterForm.requestSubmit();
    }
});

/* --- GUARDAR PERSONAJE EN PHP --- */
characterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(characterForm);

    fetch('php/guardar_personaje.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            formResponse.textContent = data.message || "¡PERSONAJE GUARDADO EN BD CON ÉXITO!";
            formResponse.className = "msg-success";
            characterForm.reset();
            checkCharactersStatus();
            setTimeout(() => showPanel(listSection), 1200);
        } else {
            formResponse.textContent = data.message || "Error al guardar el personaje.";
            formResponse.className = "msg-error";
        }
    })
    .catch(() => {
        formResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
        formResponse.className = "msg-error";
    });
});

/* --- EDITAR PERSONAJE --- */
// CORRECCIÓN: Ahora escucha directamente el formulario HTML real
adminCharacterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(adminCharacterForm);

    fetch('php/editar_personajes.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success || data.status === 'success') {
            adminFormResponse.textContent = data.message || "Personaje actualizado correctamente.";
            adminFormResponse.className = "msg-success";
            checkCharactersStatus();
        } else {
            adminFormResponse.textContent = data.message || "No se pudo actualizar el personaje.";
            adminFormResponse.className = "msg-error";
        }
    })
    .catch(error => {
        console.error('Error al actualizar:', error);
        adminFormResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
        adminFormResponse.className = "msg-error";
    });
});

/* --- ELIMINAR PERSONAJE --- */
function eliminarPersonaje(id, elementoDOM = null) {
    if (!id) return;

    fetch('php/eliminar_personajes.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' || data.success) {
            adminFormResponse.textContent = data.message || "Personaje eliminado correctamente de la base de datos.";
            adminFormResponse.className = "msg-success";
            
            adminFormContainer.classList.add('hidden');

            if (elementoDOM) {
                elementoDOM.remove();
            }

            checkCharactersStatus();
        } else {
            const errorMsg = data.message || "Error al intentar eliminar el personaje.";
            adminFormResponse.textContent = errorMsg;
            adminFormResponse.className = "msg-error";
        }
    })
    .catch(error => {
        console.error('Error al intentar eliminar:', error);
        adminFormResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
        adminFormResponse.className = "msg-error";
    });
}

btnDeleteCharacter.addEventListener('click', () => {
    const charId = document.getElementById('edit-id').value;
    if (!charId) {
        alert("Selecciona un personaje primero.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este personaje de la base de datos?")) {
        eliminarPersonaje(charId);
    }
});

/* --- NAVEGACIÓN Y TECLADO --- */
document.addEventListener('keydown', (e) => {
    if (!animationFinished) {
        if (e.key === 'Enter' || e.key === ' ') finishAnimation();
        return;
    }

    const visibleButtons = getVisibleButtons();
    if (visibleButtons.length === 0) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            currentInteractiveIndex = (currentInteractiveIndex + 1) % visibleButtons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            currentInteractiveIndex = (currentInteractiveIndex - 1 + visibleButtons.length) % visibleButtons.length;
        }

        const selected = visibleButtons[currentInteractiveIndex];
        visibleButtons.forEach(b => b.classList.remove('keyboard-selected'));
        selected.classList.add('keyboard-selected');
        positionHeartOnElement(selected);
    }

    if (e.key === 'Enter') {
        const selected = visibleButtons[currentInteractiveIndex];
        if (selected) selected.click();
    }
});

appContainer.addEventListener('click', (e) => {
    if (!animationFinished && !e.target.closest('#menu-buttons') && !e.target.closest('.panel-section')) {
        finishAnimation();
    }
});

window.onload = startAnimation;