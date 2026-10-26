# Fortalecimiento de la lógica de programación con Arduino - Grado 8°

Página de evidencias del proyecto de aula desarrollado en la Institución Educativa Técnica José Cayetano Vásquez de Ciénega, Boyacá. Este proyecto busca fortalecer la lógica de programación mediante el diseño de prototipos con Arduino en estudiantes de grado octavo.

Autor: **Maicol Alexander Cruz Cruz** · Licenciatura en Informática, UPTC · 2026

---

## Qué contiene

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página. Aquí se edita el texto de las secciones. |
| `css/styles.css` | Todos los estilos, colores y animaciones. |
| `js/proyectos.js` | **Los datos de los 11 prototipos y la galería. Es el archivo que más vas a editar.** |
| `js/main.js` | La interactividad: cajas 3D, contadores, filtros, copiar código. |
| `img/` | Tus fotos y diagramas. |

---

## Publicar en GitHub Pages, paso a paso

### 1. Crea la cuenta y el repositorio
1. Entra a [github.com](https://github.com) e inicia sesión (o crea una cuenta gratis).
2. Haz clic en el botón **+** de la esquina superior derecha y elige **New repository**.
3. En **Repository name** escribe un nombre sin espacios, por ejemplo `arduino-grado8`.
4. Marca la opción **Public**.
5. No marques "Add a README file" (este proyecto ya trae uno).
6. Haz clic en **Create repository**.

### 2. Sube los archivos
**Opción A — arrastrando (la más sencilla):**
1. En la página del repositorio recién creado, haz clic en **uploading an existing file**.
2. Abre la carpeta del proyecto en tu computador, selecciona **todo el contenido** (`index.html`, las carpetas `css`, `js`, `img` y el `README.md`) y arrástralo a la ventana del navegador.
   > Importante: sube el *contenido* de la carpeta, no la carpeta comprimida ni la carpeta completa. `index.html` debe quedar en la raíz del repositorio.
3. Abajo, en **Commit changes**, escribe `Primera versión del sitio` y haz clic en **Commit changes**.

**Opción B — con Git desde la terminal:**
```bash
cd ruta/de/la/carpeta
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/arduino-grado8.git
git push -u origin main
```

### 3. Activa GitHub Pages
1. En el repositorio, entra a la pestaña **Settings**.
2. En el menú lateral izquierdo, elige **Pages**.
3. En **Source**, selecciona **Deploy from a branch**.
4. En **Branch**, elige `main` y la carpeta `/ (root)`. Haz clic en **Save**.
5. Espera entre uno y tres minutos y recarga la página de Settings → Pages.

### 4. Abre tu sitio
La dirección será:

```
https://TU-USUARIO.github.io/arduino-grado8/
```

Esa es la URL que puedes poner en el documento del proyecto de aula o compartir por WhatsApp con los estudiantes.

### 5. Cuando hagas cambios
Sube el archivo modificado al repositorio (o haz `git push`). GitHub Pages se actualiza solo en un par de minutos. Si no ves el cambio, recarga con **Ctrl + F5**.

---

## Cómo editar el contenido

### Cambiar los datos de un prototipo
Abre `js/proyectos.js` con el Bloc de notas o Visual Studio Code. Cada prototipo se ve así:

```js
{
  id: "caneca-automatica",
  nombre: "Caneca automática",
  lema: "Se abre sola cuando te acercas",
  integrantes: ["Estudiante 1", "Estudiante 2"],
  ...
}
```

Reemplaza `"Estudiante 1"` por los nombres reales. Respeta las comillas y las comas.

### Poner las fotos de cada prototipo
Cada prototipo tiene su carpeta en `img/proyectos/<id>/` (por ejemplo `img/proyectos/caneca-automatica/`). Dentro, guarda las fotos con estos nombres (sirven `.jpg`, `.jpeg`, `.png` o `.webp`):

- `portada.jpg`: el prototipo terminado
- `diagrama.png`: el diagrama de conexiones
- `evidencia-1.jpg`, `evidencia-2.jpg`, `evidencia-3.jpg`: fotos del proceso

El texto que aparece sobre cada evidencia se edita en `js/proyectos.js`, en la lista `evidencias` de cada prototipo. Mientras falte una foto se muestra una imagen de relleno.
### Agregar fotos a la galería
Al final de `js/proyectos.js` está el arreglo `GALERIA`. Copia una línea y cámbiale la ruta, el texto alternativo y la categoría (`diagnostico`, `tinkercad`, `arduino` o `prototipos`).

---

## Prueba local

Haz doble clic en `index.html` y se abre en el navegador. No necesitas servidor ni instalar nada.

---

## Detalles técnicos

- HTML5, CSS3 y JavaScript sin frameworks ni dependencias.
- Diseño mobile first, responsive desde 320 px.
- Animaciones con `transform` y `keyframes`; placa Arduino modelada en CSS 3D.
- Resaltado de sintaxis propio, con la paleta One Dark Pro.
- Contraste conforme a WCAG AA, navegación con teclado, `alt` en todas las imágenes y soporte de `prefers-reduced-motion`.
- Tipografías: Orbitron, Rajdhani, Open Sans y JetBrains Mono (Google Fonts).

## Paleta

| Uso | Color |
|---|---|
| Primario | `#00979C` |
| Secundario | `#005C83` |
| Acento | `#E4712B` |
| Fondo | `#1A1A2E` → `#16213E` |
| Texto | `#EAEAEA` |
| Neón | `#00D9FF` |

