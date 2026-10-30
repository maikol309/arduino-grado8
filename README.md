# Fortalecimiento de la lógica de programación mediante el diseño de prototipos con Arduino

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Arduino](https://img.shields.io/badge/Arduino-00979C?logo=arduino&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?logo=github&logoColor=white)

Página de evidencias de la práctica pedagógica desarrollada con estudiantes de grado octavo de la **Institución Educativa Técnica José Cayetano Vásquez** (Ciénega, Boyacá), como parte de la Licenciatura en Informática de la **UPTC**.

**Sitio en línea:** <https://maikol309.github.io/arduino-grado8/>
**Contenido de la estrategia (guías y presentaciones):** <https://maikol309.github.io/proyecto-aula-8/>

---

## Objetivo

Fortalecer la lógica de programación mediante el diseño de prototipos con Arduino en estudiantes de grado octavo de la Institución Educativa José Cayetano Vásquez de Ciénega, Boyacá.

## Contexto

| | |
|---|---|
| Población | 25 estudiantes de grado octavo |
| Organización | 11 grupos, cada uno responsable de un prototipo |
| Intervención | 7 semanas: un diagnóstico y 6 sesiones |
| Herramientas | Tinkercad Circuits, Arduino UNO, protoboard y el IDE de Arduino |

## Sesiones

| Sesión | Fecha | Tema |
|---|---|---|
| Diagnóstico | 31 de agosto de 2026 | Prueba diagnóstica |
| 1 | 21 y 24 de septiembre | Pensamiento lógico y programación: algoritmos, diagramas de flujo y variables |
| 2 | 28 y 29 de septiembre | Entradas y salidas digitales: `pinMode`, `digitalWrite`, `digitalRead` |
| 3 | 13 y 16 de octubre | Condicionales y ciclos: `if / else` y `for` |
| 4 | Semana del 19 al 23 de octubre | Entradas analógicas y la función `map()` |
| 5 | Semana del 27 al 31 de octubre | Del diagrama al prototipo: montaje con servomotor y sensor ultrasónico, y lectura de diagramas de conexiones |
| 6 | Por realizar | — |

## Prototipos

| # | Prototipo | Categoría |
|---|---|---|
| 1 | Caneca basura automática | Sensor ultrasónico |
| 2 | Puerta automática pública | Control de acceso |
| 3 | Medidor de humedad | Sensor de suelo |
| 4 | Letrero led con Arduino | Matriz de LED |
| 5 | Medidor de agua con Arduino | Sensor de nivel |
| 6 | Alarma con detector de movimiento | Sensor de movimiento |
| 7 | Matriz joystick | Entrada analógica |
| 8 | Caseta de peaje | Sensor y servomotor |
| 9 | Sonar con Arduino | Sensor ultrasónico |
| 10 | Ruleta | Aleatoriedad |
| 11 | Brazo robótico | Servomotores |

Cada prototipo muestra su portada, materiales, integrantes, diagrama de conexiones, un acordeón de evidencias del proceso y el código con los comentarios escritos por los estudiantes.

## Características del sitio

- Placa Arduino UNO en 3D que gira y sigue el cursor, con una versión en CSS mientras carga el modelo.
- Prototipos en cajas desplegables, con una sola abierta a la vez (se cierran con la **X** o con **Esc**).
- Línea de tiempo de las sesiones y ruta de aprendizaje con fragmentos de código.
- Código resaltado con la paleta One Dark (modo oscuro) y One Light (modo claro), con botón para copiar.
- Galería filtrable por etapa y modo claro / oscuro.
- Accesibilidad: contraste WCAG AA, navegación con teclado, texto alternativo en las imágenes y soporte de `prefers-reduced-motion`.
- Diseño responsive desde 320 px.

## Tecnologías

HTML5, CSS3 y JavaScript sin frameworks. El visor 3D usa [`<model-viewer>`](https://modelviewer.dev/) de Google. Tipografías de Google Fonts: Orbitron, Rajdhani, Open Sans y JetBrains Mono.

## Estructura del repositorio

```
├── index.html            Estructura de la página
├── css/styles.css        Estilos y animaciones
├── js/
│   ├── proyectos.js      Datos de los prototipos y la galería
│   └── main.js           Interactividad
├── img/
│   ├── proyectos/<id>/   Fotos, diagrama y evidencias de cada prototipo
│   └── sesiones/         Fotos de las sesiones
├── models/               Modelo 3D de la placa Arduino UNO
├── INSTRUCCIONES.txt     Cómo editar, probar y publicar el sitio
└── README.md
```

## Ejecución local

El modelo 3D no carga al abrir `index.html` con doble clic (el navegador lo bloquea); en ese caso se muestra la placa en CSS. Para verlo completo, publica el sitio en GitHub Pages o ábrelo con un servidor local. Los pasos detallados están en [`INSTRUCCIONES.txt`](INSTRUCCIONES.txt).

## Créditos

- **Modelo 3D de Arduino UNO R3:** [Sketchfab](https://sketchfab.com/3d-models/arduino-uno-r3-286e0d188c184d51b7abccd89d774a28). Autoría y licencia según la página del modelo. Optimizado (texturas reducidas) para el sitio.
- **Diagrama de la ruleta:** imagen del canal de YouTube RobotUNO.
- Simulaciones y diagramas de conexión elaborados con [Tinkercad Circuits](https://www.tinkercad.com/circuits).

## Autor

**Maicol Alexander Cruz Cruz**
Licenciatura en Informática · Universidad Pedagógica y Tecnológica de Colombia (UPTC) · 2026
Contacto: maicol.cruz01@uptc.edu.co
