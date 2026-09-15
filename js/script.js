const appContainer = document.getElementById('app-container');
const logoWrapper = document.getElementById('logo-wrapper');
const menuButtons = document.getElementById('menu-buttons');
const escenarioContainer = document.getElementById('escenario-container');
const personajeRandomEl = document.getElementById('personaje-random');
const skipHint = document.getElementById('skip-hint');
const soulHeart = document.getElementById('soul-heart');

const btnPersonajes = document.getElementById('btn-personajes');
const btnInicio = document.getElementById('btn-inicio');
const btnBusqueda = document.getElementById('btn-busqueda');
const searchInput = document.getElementById('search-personajes');
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

// Contenedor visual del formulario real de administración
const adminFormContainer = document.getElementById('admin-character-form');
const adminCharacterForm = document.getElementById('admin-form-data');

const adminFormResponse = document.getElementById('admin-form-response');
const btnDeleteCharacter = document.getElementById('btn-delete-character');

let animationFinished = false;
let animationTimer = null;
let currentInteractiveIndex = 0;
let hasCharactersInDB = false;
let loadedCharacters = [];
let currentFilter = 'todos';
let searchTerm = '';

/* --- CATÁLOGO DE SPRITES EN SVG --- */
    const spriteCatalog = {
        head: [
            'img/cabezas/plantilla_cabeza01.png',
            'img/cabezas/plantilla_cabeza02.png',
            'img/cabezas/plantilla_cabeza03.png',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="2" width="8" height="10" fill="white"/><rect x="6" y="5" width="2" height="2" fill="black"/><rect x="10" y="5" width="2" height="2" fill="black"/></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="8" fill="cyan"/><rect x="5" y="6" width="2" height="2" fill="red"/><rect x="9" y="6" width="2" height="2" fill="red"/></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><polygon points="8,2 3,12 13,12" fill="yellow"/><circle cx="7" cy="7" r="1" fill="black"/><circle cx="9" cy="7" r="1" fill="black"/></svg>'
        ],

        torso: [
            'img/torsos/torso_plantilla01.png',
            'img/torsos/torso_plantilla02.png',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="2" width="8" height="12" fill="gray"/><rect x="7" y="2" width="2" height="12" fill="blue"/></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="13" fill="purple"/><rect x="6" y="5" width="4" height="4" fill="yellow"/></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16 16"><rect x="4" y="3" width="8" height="10" fill="green"/></svg>'
        ],
        legs: [
            'img/piernas/plantilla_piernas01.png',
            'img/piernas/plantilla_piernas02.png',
            
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
        if (logoWrapper) logoWrapper.classList.add('moved-up');
    }, 100);

    animationTimer = setTimeout(() => {
        finishAnimation();
    }, 2600);
}

function finishAnimation() {
    if (animationFinished) return;
    animationFinished = true;

    clearTimeout(animationTimer);

    if (logoWrapper) {
        logoWrapper.style.transition = 'top 0.3s ease-out';
        logoWrapper.classList.add('moved-up');
    }
    
    if (menuButtons) menuButtons.classList.add('visible');
    if (escenarioContainer) escenarioContainer.classList.add('visible');
    if (skipHint) skipHint.classList.add('hidden');

    checkCharactersStatus();
}

function checkCharactersStatus() {
    fetch('php/obtener_personajes.php')
        .then(res => res.json())
        .then(data => {
            loadedCharacters = (data.success && data.personajes) ? data.personajes : [];

            const comunidadCount = loadedCharacters.filter(c => Number(c.es_comunidad) === 1).length;

            if (labelBtnCrear && containerCrear) {
                if (comunidadCount > 0) {
                    hasCharactersInDB = true;
                    labelBtnCrear.innerHTML = "crea tu personaje &#9661;";
                    containerCrear.classList.add('dropdown');
                } else {
                    hasCharactersInDB = false;
                    labelBtnCrear.innerHTML = "crea tu personaje";
                    containerCrear.classList.remove('dropdown');
                }
            }
            renderCharacterList();
            populateEditSelect();
        })
        .catch(() => {
            hasCharactersInDB = false;
            loadedCharacters = [];
            if (labelBtnCrear && containerCrear) {
                labelBtnCrear.innerHTML = "crea tu personaje";
                containerCrear.classList.remove('dropdown');
            }
        });
}

let currentHeartTarget = null;

function positionHeartOnElement(element, opened = false) {
    if (!element || !soulHeart) return;

    currentHeartTarget = element;

    const rect = element.getBoundingClientRect();

    /*
     * El corazón queda dentro del botón.
     *
     * Los botones tienen padding-left: 34px,
     * así que aprovechamos ese espacio.
     */
    const left = rect.left + 10;
    const top = rect.top + (rect.height / 2) - 8;

    soulHeart.style.left = `${left}px`;
    soulHeart.style.top = `${top}px`;

    soulHeart.classList.add('active');

    if (opened) {
        soulHeart.classList.add('inside');
    } else {
        soulHeart.classList.remove('inside');
    }
}


/* Entrar a un botón */
document.addEventListener('pointerover', (e) => {
    if (!animationFinished) return;

    const button = e.target.closest('.btn');

    if (!button) return;

    /*
     * Evita volver a ejecutar la animación
     * cuando pasamos de un elemento hijo
     * del mismo botón a otro.
     */
    const from = e.relatedTarget;

    if (from && from.closest && from.closest('.btn') === button) {
        return;
    }

    positionHeartOnElement(button, true);
});


/* Salir de un botón */
document.addEventListener('pointerout', (e) => {
    if (!animationFinished) return;

    const button = e.target.closest('.btn');

    if (!button) return;

    const to = e.relatedTarget;

    /*
     * Si seguimos dentro del mismo botón,
     * no hacemos nada.
     */
    if (to && to.closest && to.closest('.btn') === button) {
        return;
    }

    /*
     * Si vamos directamente a otro botón,
     * no ocultamos el corazón.
     * El siguiente pointerover lo mueve.
     */
    if (to && to.closest && to.closest('.btn')) {
        return;
    }

    /*
     * Salimos completamente del botón.
     * Cerramos el corazón.
     */
    currentHeartTarget = null;
    soulHeart.classList.remove('inside');

    setTimeout(() => {
        if (!currentHeartTarget) {
            soulHeart.classList.remove('active');
        }
    }, 80);
});


/* Si cambia el tamaño de la ventana */
window.addEventListener('resize', () => {
    if (currentHeartTarget) {
        const opened = soulHeart.classList.contains('inside');
        positionHeartOnElement(currentHeartTarget, opened);
    }
});


/* Si se hace scroll */
window.addEventListener('scroll', () => {
    if (currentHeartTarget) {
        const opened = soulHeart.classList.contains('inside');
        positionHeartOnElement(currentHeartTarget, opened);
    }
}, { passive: true });

function toggleDropdown(button) {
    const dropdown = button.closest('.dropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));

    if (!isOpen) {
        dropdown.classList.add('open');
    }
}

if (btnPersonajes) {
    btnPersonajes.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!animationFinished) finishAnimation();
        toggleDropdown(btnPersonajes);
    });

    btnPersonajes.parentElement.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            currentFilter = item.dataset.filter || 'todos';
            renderCharacterList();
            showPanel(listSection);
        });
    });
}

if (btnCrear) {
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
}

if (btnBusqueda) {
    btnBusqueda.addEventListener('click', () => {
        if (!animationFinished) finishAnimation();
        currentFilter = 'todos';
        renderCharacterList();
        showPanel(listSection);
        setTimeout(() => searchInput && searchInput.focus(), 350);
    });
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        renderCharacterList();
    });
}

if (btnSubCrear) {
    btnSubCrear.addEventListener('click', () => {
        resetCreatorStep();
        showPanel(creatorSection);
    });
}

if (btnSubAdmin) {
    btnSubAdmin.addEventListener('click', () => {
        showPanel(adminSection);
        populateEditSelect();
    });
}

function showPanel(panel) {
    if (!panel) return;
    if (listSection) listSection.classList.add('hidden');
    if (creatorSection) creatorSection.classList.add('hidden');
    if (adminSection) adminSection.classList.add('hidden');

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goHome() {
    if (listSection) listSection.classList.add('hidden');
    if (creatorSection) creatorSection.classList.add('hidden');
    if (adminSection) adminSection.classList.add('hidden');

    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (btnInicio) {
    btnInicio.addEventListener('click', () => {
        if (!animationFinished) finishAnimation();
        goHome();
    });
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function categoriaSlug(nombre) {
    return (nombre || '').toString().trim().toLowerCase();
}

function matchesFilter(c) {
    if (currentFilter === 'todos') return true;
    return categoriaSlug(c.nombre_categoria) === currentFilter;
}

function matchesSearch(c) {
    if (!searchTerm) return true;
    const nombreCompleto = `${c.nombre || ''} ${c.apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(searchTerm);
}

function renderCharacterList() {
    if (!charactersContainer) return;
    charactersContainer.innerHTML = "";

    const filtrados = loadedCharacters.filter(c => matchesFilter(c) && matchesSearch(c));

    if (filtrados.length === 0) {
        charactersContainer.innerHTML = '<p class="characters-empty">No hay personajes para mostrar en esta categoría.</p>';
        return;
    }

    filtrados.forEach(c => {
        const esOficial = Number(c.es_comunidad) === 0;

        const atkPercent = Math.max(0, Math.min(100, (parseInt(c.ataque) || 0) / 99 * 100));
        const defPercent = Math.max(0, Math.min(100, (parseInt(c.defensa) || 0) / 99 * 100));
        const hpPercent = Math.max(0, Math.min(100, (parseInt(c.vida) || 0) / 99 * 100));

        let spriteHTML;
        if (esOficial && c.imagen_url) {
            spriteHTML = `
                <div class="character-mini-sprite official">
                    <img class="official-sprite" src="${escapeHtml(c.imagen_url)}" alt="${escapeHtml(c.nombre)}">
                </div>
            `;
        } else {
            const headVal = c.sprite_head ?? c.sprite_cabeza ?? c.cabeza ?? c.head;
            const torsoVal = c.sprite_torso ?? c.torso;
            const legsVal = c.sprite_legs ?? c.sprite_piernas ?? c.piernas ?? c.legs;

            const headSrc = resolveSpriteSource(headVal, 'head', spriteCatalog.head[0]);
            const torsoSrc = resolveSpriteSource(torsoVal, 'torso', spriteCatalog.torso[0]);
            const legsSrc = resolveSpriteSource(legsVal, 'legs', spriteCatalog.legs[0]);

            spriteHTML = `
                <div class="character-mini-sprite">
                    <img class="mini-part mini-head" src='${headSrc}' alt="Cabeza">
                    <img class="mini-part mini-torso" src='${torsoSrc}' alt="Torso">
                    <img class="mini-part mini-legs" src='${legsSrc}' alt="Piernas">
                </div>
            `;
        }

        let loreHTML = '';
        if (c.historia_completa || c.musica_tema || c.dialogo_clave) {
            loreHTML = `
                <div class="lore-block">
                    ${c.historia_completa ? `<p class="lore-historia">${escapeHtml(c.historia_completa)}</p>` : ''}
                    ${c.musica_tema ? `<p class="lore-musica"><strong>Tema musical:</strong> ${escapeHtml(c.musica_tema)}</p>` : ''}
                    ${c.dialogo_clave ? `<p class="lore-dialogo">"${escapeHtml(c.dialogo_clave)}"</p>` : ''}
                </div>
            `;
        } else if (c.descripcion) {
            loreHTML = `<div class="lore-block"><p class="lore-historia">${escapeHtml(c.descripcion)}</p></div>`;
        }

        const nombreCompleto = `${escapeHtml((c.nombre || '').toUpperCase())} ${escapeHtml((c.apellido || '').toUpperCase())}`.trim();
        const tagOrigen = esOficial
            ? '<span class="tag-origen tag-oficial">OFICIAL</span>'
            : '<span class="tag-origen tag-comunidad">COMUNIDAD</span>';
        const categoriaBadge = c.nombre_categoria
            ? `<span class="badge badge-categoria">${escapeHtml(c.nombre_categoria)}</span>`
            : '';

        const charHTML = `
            <div class="character-card">
                <div class="char-header">
                    <h3>${nombreCompleto}</h3>
                    <span class="badge">${escapeHtml(c.raza)}</span>
                </div>
                <div class="char-tags">
                    ${tagOrigen}
                    ${categoriaBadge}
                </div>
                <div class="char-stats">
                    <p><strong>ATK:</strong> ${c.ataque}</p>
                    <p><strong>DEF:</strong> ${c.defensa}</p>
                    <p><strong>HP:</strong> ${c.vida}</p>
                </div>
                <div class="stat-hp-track"><div class="stat-hp-fill" style="width: ${hpPercent}%;"></div></div>

                <p class="card-toggle-hint">&#9662; Ver estadísticas</p>

                <div class="character-details hidden" data-id="${c.id}">
                    <div class="details-top-row">
                        ${spriteHTML}
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
                    ${loreHTML}
                    <div class="comments-section">
                        <h4 class="comments-title">Comentarios</h4>
                        <input type="text" class="comment-search-input" placeholder="Filtrar comentarios..." data-search-for="${c.id}">
                        <div class="comments-list" data-comments-for="${c.id}"></div>
                        <form class="comment-form" data-comment-form-for="${c.id}">
                            <input type="text" class="comment-author" placeholder="Tu nombre" maxlength="50" required>
                            <textarea class="comment-content" placeholder="Escribe un comentario..." maxlength="500" required></textarea>
                            <button type="submit" class="btn btn-submit"><span class="btn-text">COMENTAR</span></button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        charactersContainer.insertAdjacentHTML('beforeend', charHTML);

        if (esOficial && c.imagen_url) {
            const cardEl = charactersContainer.lastElementChild;
            const officialImg = cardEl ? cardEl.querySelector('.official-sprite') : null;
            if (officialImg) {
                officialImg.addEventListener('error', function onImgError() {
                    officialImg.removeEventListener('error', onImgError);
                    officialImg.src = spriteCatalog.head[0];
                });
            }
        }
    });
}

function cargarComentarios(idPersonaje, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = '<p class="comments-loading">Cargando comentarios...</p>';

    fetch(`php/obtener_comentarios.php?id_personaje=${encodeURIComponent(idPersonaje)}`)
        .then(res => res.json())
        .then(data => {
            contenedor.dataset.loaded = '1';
            contenedor.innerHTML = '';

            if (data.success && data.comentarios && data.comentarios.length > 0) {
                data.comentarios.forEach(com => {
                    const item = document.createElement('div');
                    item.className = 'comment-item';

                    const author = document.createElement('span');
                    author.className = 'comment-author-tag';
                    author.textContent = com.nombre_autor;

                    const text = document.createElement('p');
                    text.className = 'comment-text';
                    text.textContent = com.contenido;

                    item.appendChild(author);
                    item.appendChild(text);
                    contenedor.appendChild(item);
                });
            } else {
                contenedor.innerHTML = '<p class="comments-empty">Sé el primero en comentar.</p>';
            }
        })
        .catch(() => {
            contenedor.dataset.loaded = '';
            contenedor.innerHTML = '<p class="comments-empty">No se pudieron cargar los comentarios.</p>';
        });
}

if (charactersContainer) {
    /* --- BUSCADOR / FILTRO EN VIVO DE COMENTARIOS --- */
    charactersContainer.addEventListener('input', (e) => {
        if (!e.target.classList.contains('comment-search-input')) return;
        const query = e.target.value.trim().toLowerCase();
        const cardDetails = e.target.closest('.character-details');
        if (!cardDetails) return;

        const commentItems = cardDetails.querySelectorAll('.comment-item');
        for (let i = 0; i < commentItems.length; i++) {
            const text = commentItems[i].textContent.toLowerCase();
            commentItems[i].style.display = text.includes(query) ? 'block' : 'none';
        }
    });

    charactersContainer.addEventListener('click', (e) => {
        if (e.target.closest('.comment-form') || e.target.classList.contains('comment-search-input')) return;

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

        if (!nowHidden) {
            const commentsList = details.querySelector('.comments-list');
            if (commentsList && !commentsList.dataset.loaded) {
                cargarComentarios(details.dataset.id, commentsList);
            }
        }
    });

    charactersContainer.addEventListener('submit', function(e) {
        const form = e.target.closest('.comment-form');
        if (!form) return;
        e.preventDefault();

        const idPersonaje = form.dataset.commentFormFor;
        const authorInput = form.querySelector('.comment-author');
        const contentInput = form.querySelector('.comment-content');

        const nombre_autor = authorInput.value.trim();
        const contenido = contentInput.value.trim();
        if (!nombre_autor || !contenido) return;

        const formData = new FormData();
        formData.append('id_personaje', idPersonaje);
        formData.append('nombre_autor', nombre_autor);
        formData.append('contenido', contenido);

        fetch('php/agregar_comentario.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                contentInput.value = '';
                const commentsList = form.closest('.character-details').querySelector('.comments-list');
                if (commentsList) {
                    commentsList.dataset.loaded = '';
                    cargarComentarios(idPersonaje, commentsList);
                }
            } else {
                alert(data.message || 'No se pudo publicar el comentario.');
            }
        })
        .catch(() => {
            alert('Ocurrió un error al conectar con el servidor.');
        });
    });
}

function populateEditSelect() {
    if (!selectEditCharacter) return;
    selectEditCharacter.innerHTML = '<option value="">-- Selecciona un personaje --</option>';
    loadedCharacters
        .filter(c => Number(c.es_comunidad) === 1)
        .forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.nombre} ${c.apellido || ''} (${c.raza})`.trim();
            selectEditCharacter.appendChild(option);
        });
}

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

if (selectEditCharacter) {
    selectEditCharacter.addEventListener('change', () => {
        const charId = selectEditCharacter.value;
        if (!charId) {
            if (adminFormContainer) adminFormContainer.classList.add('hidden');
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

            if (adminFormContainer) adminFormContainer.classList.remove('hidden');
        }
    });
}

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
    
    const titleEl = document.getElementById('creator-step-title');
    if (titleEl) titleEl.innerText = stepTitles[0];

    const carouselControls = document.getElementById('carousel-controls');
    if (carouselControls) carouselControls.classList.remove('hidden');

    const finalFields = document.getElementById('final-stats-fields');
    if (finalFields) finalFields.classList.add('hidden');
    
    const btnAction = document.getElementById('btn-step-action');
    if (btnAction) {
        btnAction.querySelector('.btn-text').innerText = "SIGUIENTE";
    }

    ['head', 'torso', 'legs'].forEach(part => {
        const el = document.getElementById(`preview-${part}`);
        if (el) el.src = spriteCatalog[part][0];
    });

    updateCarouselView();
    if (formResponse) formResponse.innerText = "";
}

function navigatePart(direction) {
    const key = stepKeys[currentStep];
    const options = spriteCatalog[key];
    if (!options) return;

    selectedIndexes[key] = (selectedIndexes[key] + direction + options.length) % options.length;
    updateCarouselView();
}

const btnPrevPart = document.getElementById('btn-prev-part');
if (btnPrevPart) btnPrevPart.addEventListener('click', () => navigatePart(-1));

const btnNextPart = document.getElementById('btn-next-part');
if (btnNextPart) btnNextPart.addEventListener('click', () => navigatePart(1));

const btnStepAction = document.getElementById('btn-step-action');
if (btnStepAction) {
    btnStepAction.addEventListener('click', function() {
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

            if (characterForm) characterForm.requestSubmit();
        }
    });
}

/* --- GUARDAR PERSONAJE EN PHP --- */
if (characterForm) {
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
                if (formResponse) {
                    formResponse.textContent = data.message || "¡PERSONAJE GUARDADO EN BD CON ÉXITO!";
                    formResponse.className = "msg-success";
                }
                characterForm.reset();
                checkCharactersStatus();
                setTimeout(() => showPanel(listSection), 1200);
            } else if (formResponse) {
                formResponse.textContent = data.message || "Error al guardar el personaje.";
                formResponse.className = "msg-error";
            }
        })
        .catch(() => {
            if (formResponse) {
                formResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
                formResponse.className = "msg-error";
            }
        });
    });
}

/* --- EDITAR PERSONAJE --- */
if (adminCharacterForm) {
    adminCharacterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(adminCharacterForm);

        fetch('php/editar_personajes.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (adminFormResponse) {
                if (data.success || data.status === 'success') {
                    adminFormResponse.textContent = data.message || "Personaje actualizado correctamente.";
                    adminFormResponse.className = "msg-success";
                    checkCharactersStatus();
                } else {
                    adminFormResponse.textContent = data.message || "No se pudo actualizar el personaje.";
                    adminFormResponse.className = "msg-error";
                }
            }
        })
        .catch(error => {
            console.error('Error al actualizar:', error);
            if (adminFormResponse) {
                adminFormResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
                adminFormResponse.className = "msg-error";
            }
        });
    });
}

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
            if (adminFormResponse) {
                adminFormResponse.textContent = data.message || "Personaje eliminado correctamente de la base de datos.";
                adminFormResponse.className = "msg-success";
            }

            if (adminCharacterForm) adminCharacterForm.reset();
            if (adminFormContainer) adminFormContainer.classList.add('hidden');
            
            checkCharactersStatus();

            if (elementoDOM) {
                elementoDOM.remove();
            }
        } else if (adminFormResponse) {
            adminFormResponse.textContent = data.message || "No se pudo eliminar el personaje.";
            adminFormResponse.className = "msg-error";
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        if (adminFormResponse) {
            adminFormResponse.textContent = 'Ocurrió un error al conectar con el servidor.';
            adminFormResponse.className = "msg-error";
        }
    });
}

/* --- EVENTO ELIMINAR PERSONAJE DESDE ADMIN --- */
if (btnDeleteCharacter) {
    btnDeleteCharacter.addEventListener('click', (e) => {
        e.preventDefault();
        const editIdEl = document.getElementById('edit-id');
        const charId = editIdEl ? editIdEl.value : null;
        
        if (charId) {
            const confirmar = confirm("¿Estás seguro de que deseas eliminar este personaje? Esta acción es irreversible.");
            if (confirmar) {
                eliminarPersonaje(charId);
            }
        }
    });
}

/* --- INICIALIZACIÓN DEL DOM --- */
document.addEventListener('DOMContentLoaded', () => {
    startAnimation();

    const skipHandler = () => {
        finishAnimation();
        document.removeEventListener('click', skipHandler);
        document.removeEventListener('keydown', skipHandler);
    };

    document.addEventListener('click', skipHandler);
    document.addEventListener('keydown', skipHandler);
});