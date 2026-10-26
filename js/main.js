/* ============================================================
   main.js — interactividad del sitio
   ------------------------------------------------------------
   01. Utilidades
   02. Loader, cursor y barra de progreso
   03. Navegación
   04. Efecto de escritura y circuitos del hero
   05. Placa Arduino: partículas al pasar el cursor
   06. Biblioteca de prototipos (cajas 3D)
   07. Resaltado de sintaxis y copiar código
   08. Carrusel, modal y aviso emergente
   09. Galería y filtros
   10. Contadores y animaciones de entrada
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 02. LOADER, CURSOR Y BARRA DE PROGRESO ===== */

  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('is-done'), 550);
  });

  const cursor = $('#cursor');
  if (window.matchMedia('(pointer: fine)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('is-on');
    });
    (function seguir() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(seguir);
    })();
    document.addEventListener('mouseover', (e) => {
      const interactivo = e.target.closest('a, button, .crate__lid, .gallery__item');
      cursor.classList.toggle('is-active', !!interactivo);
    });
  }

  const progress = $('#progress');
  const toTop = $('#toTop');
  const nav = $('#nav');

  function alHacerScroll() {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    progress.style.width = pct + '%';
    nav.classList.toggle('is-stuck', window.scrollY > 40);
    toTop.classList.toggle('is-on', window.scrollY > 700);
    marcarSeccionActual();
  }
  window.addEventListener('scroll', alHacerScroll, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: menosMovimiento ? 'auto' : 'smooth' });
  });

  /* ===== 03. NAVEGACIÓN ===== */

  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  navToggle.addEventListener('click', () => {
    const abierto = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(abierto));
    navToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });

  $$('#navMenu a').forEach((a) => a.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  const secciones = $$('section[id]');
  function marcarSeccionActual() {
    const y = window.scrollY + 140;
    let actual = '';
    secciones.forEach((s) => { if (s.offsetTop <= y) actual = s.id; });
    $$('#navMenu a').forEach((a) => {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + actual);
    });
  }

  // Tema claro / oscuro (se recuerda durante la sesión)
  const themeBtn = $('#themeBtn');
  themeBtn.addEventListener('click', () => {
    const claro = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', claro ? 'dark' : 'light');
    themeBtn.setAttribute('aria-label', claro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  });

  /* ===== 04. HERO: ESCRITURA Y CIRCUITOS ===== */

  const destino = $('#typeTarget');
  const texto = destino.dataset.type;
  if (menosMovimiento) {
    destino.textContent = texto;
  } else {
    let i = 0;
    (function escribir() {
      destino.textContent = texto.slice(0, i++);
      if (i <= texto.length) setTimeout(escribir, 42);
    })();
  }

  // Circuitos que se encienden en el fondo
  const canvas = $('#circuit');
  if (canvas && !menosMovimiento) {
    const ctx = canvas.getContext('2d');
    let ancho, alto, trazos = [];

    function nuevoTrazo() {
      const puntos = [];
      let px = Math.random() * ancho;
      let py = Math.random() * alto;
      puntos.push({ x: px, y: py });
      const pasos = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < pasos; i++) {
        const largo = 40 + Math.random() * 130;
        if (Math.random() > 0.5) px += Math.random() > 0.5 ? largo : -largo;
        else py += Math.random() > 0.5 ? largo : -largo;
        puntos.push({ x: px, y: py });
      }
      return { puntos, avance: 0, vel: 0.004 + Math.random() * 0.008, vida: 1 };
    }

    function medir() {
      ancho = canvas.width = canvas.offsetWidth;
      alto = canvas.height = canvas.offsetHeight;
      trazos = Array.from({ length: 16 }, nuevoTrazo);
    }
    medir();
    window.addEventListener('resize', medir);

    (function dibujar() {
      ctx.clearRect(0, 0, ancho, alto);
      trazos.forEach((t, idx) => {
        t.avance += t.vel;
        if (t.avance > 1.6) trazos[idx] = nuevoTrazo();

        const visible = Math.min(t.avance, 1);
        const total = t.puntos.length - 1;
        const hasta = visible * total;

        ctx.beginPath();
        ctx.moveTo(t.puntos[0].x, t.puntos[0].y);
        for (let i = 1; i <= total; i++) {
          if (i <= hasta) {
            ctx.lineTo(t.puntos[i].x, t.puntos[i].y);
          } else {
            const p = hasta - (i - 1);
            if (p > 0) {
              const a = t.puntos[i - 1], b = t.puntos[i];
              ctx.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
            }
            break;
          }
        }
        const desvanece = t.avance > 1 ? 1 - (t.avance - 1) / 0.6 : 1;
        ctx.strokeStyle = `rgba(0, 217, 255, ${0.26 * desvanece})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // nodo luminoso en la punta
        const ultimo = Math.min(Math.floor(hasta), total);
        const nodo = t.puntos[ultimo];
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${0.7 * desvanece})`;
        ctx.fill();
      });
      requestAnimationFrame(dibujar);
    })();
  }

  /* ===== 05. PLACA: PARTÍCULAS AL PASAR EL CURSOR ===== */

  const board = $('#board');

  // Da volumen a los componentes: capas finas apiladas hacia la placa forman los costados
  $$('.blk', board).forEach((b) => {
    const alto = Number(b.dataset.h) || 4;
    b.style.setProperty('--h', alto);
    for (let z = 2; z <= alto; z += 2) {
      const capa = document.createElement('i');
      capa.className = 'blk__l';
      capa.style.transform = `translateZ(-${z}px)`;
      b.appendChild(capa);
    }
  });

  // Modelo 3D: gira solo; al pasar el cursor la placa mira hacia él
  const modelo = $('#board3d');
  const escenario = $('#boardStage');
  if (modelo) {
    modelo.addEventListener('load', () => {
      escenario.classList.add('has-3d');   // el modelo ya cargó: reemplaza a la placa en CSS
      modelo.setAttribute('camera-controls', '');
      if (!menosMovimiento) {
        modelo.setAttribute('auto-rotate', '');
        modelo.setAttribute('auto-rotate-delay', '0');
        modelo.setAttribute('rotation-per-second', '14deg');
      }
    });
    // Mientras carga (o si no carga, por ejemplo al abrir index.html con doble clic)
    // se queda a la vista la placa hecha en CSS.
    modelo.addEventListener('error', () => { escenario.classList.remove('has-3d'); });

    if (!menosMovimiento) {
      let arrastrando = false;
      modelo.addEventListener('pointerdown', () => { arrastrando = true; });
      window.addEventListener('pointerup', () => { arrastrando = false; });

      modelo.addEventListener('pointermove', (e) => {
        if (arrastrando || e.pointerType !== 'mouse') return;
        const r = modelo.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;    // -0.5 a 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        modelo.removeAttribute('auto-rotate');
        modelo.cameraOrbit = `${nx * 160}deg ${60 + ny * 40}deg 105%`;
      });
      modelo.addEventListener('pointerleave', () => {
        if (arrastrando) return;
        modelo.setAttribute('auto-rotate', '');
      });
    }
  }

  if (board && !menosMovimiento) {
    let ultima = 0;
    board.addEventListener('mousemove', (e) => {
      const ahora = Date.now();
      if (ahora - ultima < 70) return;
      ultima = ahora;

      const chispa = document.createElement('span');
      chispa.className = 'spark';
      chispa.style.left = e.clientX + 'px';
      chispa.style.top = e.clientY + 'px';
      chispa.style.setProperty('--dx', (Math.random() * 90 - 45) + 'px');
      chispa.style.setProperty('--dy', (-40 - Math.random() * 70) + 'px');
      document.body.appendChild(chispa);
      setTimeout(() => chispa.remove(), 950);
    });
  }

  /* ===== 07. RESALTADO DE SINTAXIS (estilo One Dark Pro) ===== */

  const PALABRAS_CLAVE = ['void','int','float','double','char','bool','boolean','byte','long','const','unsigned','if','else','for','while','do','switch','case','break','continue','return','true','false','HIGH','LOW','INPUT','OUTPUT','INPUT_PULLUP','struct','define','sizeof','static'];
  const FUNCIONES_ARDUINO = ['setup','loop','pinMode','digitalWrite','digitalRead','analogRead','analogWrite','delay','delayMicroseconds','map','constrain','random','randomSeed','tone','noTone','pulseIn','millis','Serial','attach','write','print','println','begin'];

  function escapar(txt) {
    return txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function resaltar(codigo) {
    let html = escapar(codigo);

    const patron = /(\/\*[\s\S]*?\*\/)|(\/\/[^\n]*)|(#\w+(?:\s+(?:&lt;[^&\n]*&gt;|"[^"\n]*"))?)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)/g;

    html = html.replace(patron, (m, bloque, linea, pre, cadena, caracter, numero, palabra, pos, todo) => {
      if (bloque || linea)  return `<span class="tok-com">${m}</span>`;
      if (pre)              return `<span class="tok-pre">${m}</span>`;
      if (cadena || caracter) return `<span class="tok-str">${m}</span>`;
      if (numero)           return `<span class="tok-num">${m}</span>`;
      if (palabra) {
        if (PALABRAS_CLAVE.includes(m))    return `<span class="tok-key">${m}</span>`;
        if (FUNCIONES_ARDUINO.includes(m)) return `<span class="tok-ard">${m}</span>`;
        if (/^[A-Z][A-Z0-9_]*$/.test(m))   return `<span class="tok-typ">${m}</span>`;
        if (/^[A-Z]/.test(m))              return `<span class="tok-typ">${m}</span>`;
        // cualquier otro nombre seguido de "(" es una llamada a función
        if (/^\s*\(/.test(todo.slice(pos + m.length))) return `<span class="tok-fun">${m}</span>`;
        return m;
      }
      return m;
    });

    // Cada línea va en su propio span para numerarla con CSS
    return html.split('\n').map((l) => `<span class="ln">${l || ' '}</span>`).join('');
  }

  function bloqueDeCodigo(proyecto) {
    return `
      <div class="codebox">
        <div class="codebox__bar">
          <span class="codebox__name">${proyecto.id}.ino</span>
          <button class="codebox__copy" data-copy="${proyecto.id}">Copiar código</button>
        </div>
        <pre><code>${resaltar(proyecto.codigo)}</code></pre>
      </div>`;
  }

  // Fragmentos de código de la ruta de aprendizaje: mismo resaltado, en una sola línea
  $$('.step__code').forEach((el) => { el.innerHTML = resaltar(el.textContent); });

  /* ===== 06. BIBLIOTECA DE PROTOTIPOS ===== */

  const shelf = $('#shelf');

  // Fotos: img/proyectos/<id>/portada, diagrama y evidencia-N. Se prueba cada extensión
  // (jpg, jpeg, png, webp) y, si no hay archivo, se muestra la imagen de relleno.
  const EXTENSIONES = ['jpg', 'jpeg', 'png', 'webp'];
  function foto(id, nombre, alt, clase = '') {
    const base = `img/proyectos/${id}/${nombre}`;
    return `<img class="${clase}" src="${base}.jpg" data-base="${base}" data-try="0" alt="${alt}" loading="lazy">`;
  }
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.base) return;
    const siguiente = Number(img.dataset.try) + 1;
    if (siguiente < EXTENSIONES.length) {
      img.dataset.try = siguiente;
      img.src = `${img.dataset.base}.${EXTENSIONES[siguiente]}`;
    } else {
      delete img.dataset.base;
      img.classList.add('is-empty');
      img.src = 'img/placeholder.svg';
    }
  }, true);

  // Fotos de las sesiones: img/sesiones/<nombre>.jpg (con el mismo respaldo de extensiones)
  $$('[data-foto]').forEach((fig) => {
    const base = fig.dataset.foto;
    fig.innerHTML = `<img src="${base}.jpg" data-base="${base}" data-try="0" alt="${fig.dataset.alt || ''}" loading="lazy">`;
  });

  PROYECTOS.forEach((p, i) => {
    const crate = document.createElement('article');
    crate.className = 'crate reveal';
    crate.dataset.id = p.id;

    const num = String(i + 1).padStart(2, '0');
    const integrantes = p.integrantes.map((n) => `<li>${n}</li>`).join('');
    const componentes = p.componentes.map((c) => `<li>${c}</li>`).join('');

    // Acordeón de evidencias: la foto activa se expande y muestra su explicación encima
    const evidencias = p.evidencias.map((ev, k) => `
      <div class="evid__item${k === 0 ? ' is-active' : ''}" tabindex="0" role="button"
           aria-pressed="${k === 0}" aria-label="Evidencia ${k + 1}: ${ev.titulo}">
        ${foto(p.id, `evidencia-${k + 1}`, `${ev.titulo}: ${ev.texto}`)}
        <span class="evid__n" aria-hidden="true">${String(k + 1).padStart(2, '0')}</span>
        <span class="evid__tag" aria-hidden="true">${ev.titulo}</span>
        <span class="evid__cap"><b>${ev.titulo}</b><em>${ev.texto}</em></span>
      </div>`).join('');

    crate.innerHTML = `
      <button class="crate__lid" aria-expanded="false" aria-controls="detalle-${p.id}">
        <span class="crate__n">Prototipo ${num} · ${p.categoria}</span>
        <h3 class="crate__name">${p.nombre}</h3>
        <p class="crate__lema">${p.lema}</p>
        <span class="crate__more">Abrir la caja <i>▾</i></span>
      </button>

      <div class="crate__detail detail" id="detalle-${p.id}">
        <button class="detail__close" aria-label="Cerrar ${p.nombre}" title="Cerrar (Esc)">×</button>

        <header class="detail__head">
          <p class="detail__eyebrow">Prototipo ${num} · ${p.categoria}</p>
          <h3 class="detail__title">${p.nombre}</h3>
          <p class="detail__lema">${p.lema}</p>
        </header>

        <div class="detail__intro">
          <figure class="detail__cover">${foto(p.id, 'portada', `Prototipo terminado: ${p.nombre}`)}</figure>
          <div>
            <p class="detail__desc">${p.descripcion}</p>
            <h4>Materiales</h4>
            <ul class="detail__list">${componentes}</ul>
          </div>
        </div>

        <section class="detail__block">
          <h4>Integrantes del grupo</h4>
          <ul class="team">${integrantes}</ul>
        </section>

        <section class="detail__block">
          <h4>Diagrama de conexiones</h4>
          <p class="detail__text">${p.diagramaTexto}</p>
          <figure class="diagram">${foto(p.id, 'diagrama', `Diagrama de conexiones del prototipo ${p.nombre}`)}</figure>
        </section>

        <section class="detail__block">
          <h4>Evidencias del proceso</h4>
          <p class="detail__text">Pasa el cursor o toca una foto para ampliarla y leer qué se hizo en cada paso.</p>
          <div class="evid" data-evid>${evidencias}</div>
        </section>

        <section class="detail__block">
          <h4>Código del prototipo</h4>
          <p class="detail__text">A continuación se presenta el código con sus respectivos comentarios, realizados por los estudiantes del grupo para explicar qué hace cada parte del programa.</p>
          ${bloqueDeCodigo(p)}
          <div class="detail__actions">
            <button class="btn btn--glow btn--sm" data-codigo="${p.id}">
              <span class="btn__chip" aria-hidden="true"></span>Ver el código en pantalla grande
            </button>
          </div>
        </section>
      </div>`;

    shelf.appendChild(crate);
  });

  // Acordeón de evidencias: una foto activa a la vez
  function activarEvidencia(item) {
    const acordeon = item.closest('[data-evid]');
    $$('.evid__item', acordeon).forEach((it) => {
      it.classList.toggle('is-active', it === item);
      it.setAttribute('aria-pressed', String(it === item));
    });
  }
  shelf.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.evid__item');
    if (item && window.matchMedia('(hover: hover)').matches) activarEvidencia(item);
  });
  shelf.addEventListener('click', (e) => {
    const item = e.target.closest('.evid__item');
    if (item) activarEvidencia(item);
  });
  shelf.addEventListener('keydown', (e) => {
    const item = e.target.closest('.evid__item');
    if (item && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activarEvidencia(item); }
  });


  // Abrir y cerrar las cajas
  function cerrarCajas() {
    $$('.crate.is-open', shelf).forEach((c) => {
      c.classList.remove('is-open');
      $('.crate__lid', c).setAttribute('aria-expanded', 'false');
    });
  }

  shelf.addEventListener('click', (e) => {
    // Botón X: cierra la caja y devuelve el foco a su tapa
    const cerrar = e.target.closest('.detail__close');
    if (cerrar) {
      const tapaCerrada = $('.crate__lid', cerrar.closest('.crate'));
      cerrarCajas();
      tapaCerrada.focus();
      return;
    }

    const tapa = e.target.closest('.crate__lid');
    if (!tapa) return;
    const crate = tapa.closest('.crate');
    const abierta = crate.classList.contains('is-open');

    // Solo una caja abierta a la vez
    cerrarCajas();

    if (!abierta) {
      crate.classList.add('is-open');
      tapa.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        const y = crate.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: menosMovimiento ? 'auto' : 'smooth' });
      }, 120);
    }
  });

  /* ===== 08. CARRUSEL, COPIAR, MODAL Y AVISO ===== */

  // Copiar código
  const toast = $('#toast');
  let tiempoToast;
  function avisar(mensaje) {
    toast.textContent = mensaje;
    toast.classList.add('is-on');
    clearTimeout(tiempoToast);
    tiempoToast = setTimeout(() => toast.classList.remove('is-on'), 2400);
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const p = PROYECTOS.find((x) => x.id === btn.dataset.copy);
    try {
      await navigator.clipboard.writeText(p.codigo);
      avisar('Código copiado');
    } catch (err) {
      // Respaldo para navegadores sin permiso de portapapeles
      const area = document.createElement('textarea');
      area.value = p.codigo;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      avisar('Código copiado');
    }
  });

  // Modal
  const modal = $('#modal');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  let ultimoFoco = null;

  function abrirModal(titulo, html) {
    ultimoFoco = document.activeElement;
    modalTitle.textContent = titulo;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }
  function cerrarModal() {
    modal.hidden = true;
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }

  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) cerrarModal(); });
  // Esc cierra primero el modal (si hay uno) y, si no, la caja abierta
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) { cerrarModal(); return; }
    const abierta = $('.crate.is-open', shelf);
    if (abierta) {
      cerrarCajas();
      $('.crate__lid', abierta).focus();
    }
  });

  document.addEventListener('click', (e) => {
    const verCodigo = e.target.closest('[data-codigo]');
    if (verCodigo) {
      const p = PROYECTOS.find((x) => x.id === verCodigo.dataset.codigo);
      abrirModal(p.nombre, bloqueDeCodigo(p));
    }
  });

  /* ===== 09. GALERÍA Y FILTROS ===== */

  const gallery = $('#gallery');
  GALERIA.forEach((foto) => {
    const item = document.createElement('figure');
    item.className = `gallery__item ${foto.alto || 'corta'}`;
    item.dataset.cat = foto.categoria;
    item.tabIndex = 0;
    item.innerHTML = `<img src="${foto.src}" alt="${foto.alt}" loading="lazy">`;
    item.addEventListener('click', () => abrirModal(foto.alt, `<img src="${foto.src}" alt="${foto.alt}">`));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') item.click(); });
    gallery.appendChild(item);
  });

  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    $$('.filter').forEach((f) => {
      f.classList.toggle('is-active', f === btn);
      f.setAttribute('aria-selected', String(f === btn));
    });
    const cat = btn.dataset.filter;
    $$('.gallery__item').forEach((it) => {
      it.classList.toggle('is-hidden', cat !== 'todas' && it.dataset.cat !== cat);
    });
  });

  /* ===== 10. CONTADORES Y ENTRADA AL SCROLL ===== */

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-in');

      const num = entrada.target.querySelector?.('.stat__num');
      if (num && !num.dataset.listo) {
        num.dataset.listo = '1';
        contar(num);
      }
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.18 });

  $$('.reveal, .stat').forEach((el) => observador.observe(el));

  function contar(el) {
    const fin = Number(el.dataset.count);
    const sufijo = el.dataset.suffix || '';
    if (menosMovimiento) { el.textContent = fin + sufijo; return; }
    const duracion = 1500;
    const inicio = performance.now();
    (function paso(ahora) {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(fin * suave) + sufijo;
      if (t < 1) requestAnimationFrame(paso);
    })(inicio);
  }

  // Anillo de porcentaje
  const ring = $('.ring');
  if (ring) {
    const obsRing = new IntersectionObserver((ent) => {
      if (!ent[0].isIntersecting) return;
      const meta = Number(ring.dataset.ring);
      let v = 0;
      (function subir() {
        v = Math.min(v + 1.6, meta);
        ring.style.setProperty('--p', v);
        if (v < meta) requestAnimationFrame(subir);
      })();
      obsRing.disconnect();
    }, { threshold: 0.4 });
    obsRing.observe(ring);
  }

  alHacerScroll();
})();





