/* ============================================================
   ANIMACIONES DE LOS PROTOTIPOS
   Un dibujo animado para la tapa de cada caja. La clave es el id
   del prototipo (el mismo de js/proyectos.js). Los movimientos se
   definen en css/styles.css (sección "Animaciones de las cajas").
   Si un prototipo no tiene dibujo aquí, su caja se ve sin animación.
   ============================================================ */

const ANIMACIONES = (() => {
  const svg = (contenido) =>
    `<svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" focusable="false">${contenido}</svg>`;
  const suelo = '<line class="suelo" x1="14" y1="102" x2="186" y2="102"/>';

  // Rejilla de puntos 8x8 para la matriz de LED
  let puntos = '';
  for (let f = 0; f < 8; f++) {
    for (let c = 0; c < 8; c++) puntos += `<circle class="apagado" cx="${53 + c * 10}" cy="${19 + f * 10}" r="2"/>`;
  }
  // Segmentos de la culebrita (la cabeza va adelante)
  let culebra = '';
  for (let k = 0; k < 4; k++) {
    culebra += `<rect class="lleno-o a-culebra" x="59" y="35" width="8" height="8" rx="2" style="animation-delay:${-0.6 + k * 0.2}s"/>`;
  }

  // Diez LED en círculo para la ruleta
  let ruleta = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * Math.PI / 180;
    const x = (100 + 36 * Math.cos(a)).toFixed(1);
    const y = (58 + 36 * Math.sin(a)).toFixed(1);
    ruleta += `<circle class="led ${i % 2 ? 'led-o' : 'led-c'} a-ruleta" cx="${x}" cy="${y}" r="5" style="animation-delay:${(i * 0.12).toFixed(2)}s"/>`;
  }

  return {
    // La caneca abre la tapa cuando el sensor detecta el papel
    'caneca-automatica': svg(`
      ${suelo}
      <path class="relleno" d="M72 48 H128 L122 100 H78 Z"/>
      <line x1="87" y1="62" x2="88" y2="92"/><line x1="100" y1="62" x2="100" y2="92"/><line x1="113" y1="62" x2="112" y2="92"/>
      <circle cx="93" cy="54" r="3.2"/><circle cx="107" cy="54" r="3.2"/>
      <g class="a-caneca-tapa"><rect x="68" y="41" width="64" height="6" rx="2"/><rect x="94" y="37" width="12" height="4" rx="1"/></g>
      <path class="o a-onda" d="M136 47 q6 7 0 14"/>
      <path class="o a-onda d2" d="M144 43 q9 11 0 22"/>
      <path class="o a-onda d3" d="M152 39 q12 15 0 30"/>
      <rect class="lleno-o a-caneca-papel" x="166" y="44" width="10" height="10" rx="2"/>`),

    // La puerta se abre sola cuando llega una persona
    'puerta-automatica': svg(`
      ${suelo}
      <path d="M78 102 V20 H126 V102"/>
      <rect x="94" y="10" width="16" height="6" rx="1"/>
      <path class="o a-onda" d="M98 22 q4 4 8 0"/>
      <path class="o a-onda d2" d="M94 28 q8 8 16 0"/>
      <g class="a-puerta"><rect class="relleno" x="80" y="22" width="44" height="80"/><circle cx="117" cy="64" r="2"/></g>
      <g class="a-persona">
        <circle cx="165" cy="54" r="6"/><line x1="165" y1="60" x2="165" y2="82"/>
        <line x1="165" y1="82" x2="158" y2="100"/><line x1="165" y1="82" x2="172" y2="100"/>
        <line x1="165" y1="66" x2="157" y2="76"/><line x1="165" y1="66" x2="173" y2="76"/>
      </g>`),

    // La barrera sube cuando llega el carro; cambia el LED
    'caseta-peaje': svg(`
      ${suelo}
      <path d="M24 40 L45 28 L66 40 Z"/><rect class="relleno" x="30" y="40" width="30" height="62"/>
      <rect x="37" y="50" width="16" height="12" rx="1"/>
      <circle class="led led-r a-caseta-rojo" cx="40" cy="76" r="3.5"/>
      <circle class="led led-v a-caseta-verde" cx="50" cy="76" r="3.5"/>
      <line x1="72" y1="102" x2="72" y2="70"/><rect x="68" y="80" width="8" height="6" rx="1"/>
      <g class="a-barrera"><rect class="o" x="72" y="68" width="78" height="5" rx="2"/></g>
      <g class="a-carro">
        <path class="relleno" d="M156 96 h40 v-9 l-7 -8 h-20 l-8 8 h-5 z"/>
        <circle cx="166" cy="98" r="4"/><circle cx="187" cy="98" r="4"/>
      </g>`),

    // Caen gotas en la matera y el semáforo pasa de rojo a verde
    'medidor-humedad': svg(`
      <path class="relleno" d="M68 72 H132 L123 102 H77 Z"/><line x1="71" y1="80" x2="129" y2="80"/>
      <path d="M100 72 V38"/>
      <path class="lleno-c" d="M100 54 q-16 -4 -20 -16 q14 0 20 16 z"/>
      <path class="lleno-c" d="M100 46 q14 -6 20 -18 q-16 2 -20 18 z"/>
      <rect class="o" x="110" y="58" width="7" height="26" rx="1"/>
      <path class="lleno-c a-gota" d="M86 6 q-5 7 0 10 q5 -3 0 -10 z"/>
      <rect x="150" y="28" width="22" height="58" rx="4"/>
      <circle class="led led-r a-hum-r" cx="161" cy="40" r="5"/>
      <circle class="led led-a a-hum-a" cx="161" cy="57" r="5"/>
      <circle class="led led-v a-hum-v" cx="161" cy="74" r="5"/>`),

    // Un letrero de puntos LED con un mensaje que se desplaza
    'letrero-led': svg(`
      <defs>
        <pattern id="anim-puntos" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.6" style="fill:#fff;stroke:none"/></pattern>
        <mask id="anim-mascara" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="110"><rect x="16" y="30" width="168" height="46" style="fill:url(#anim-puntos);stroke:none"/></mask>
      </defs>
      <rect x="12" y="26" width="176" height="54" rx="5"/>
      <rect class="tenue" x="16" y="30" width="168" height="46" style="fill:currentColor;stroke:none" mask="url(#anim-mascara)"/>
      <g mask="url(#anim-mascara)"><text class="a-letrero" x="0" y="68">HOLA 8°</text></g>
      <line x1="40" y1="80" x2="40" y2="100"/><line x1="160" y1="80" x2="160" y2="100"/>`),

    // El vaso se llena y los LED se encienden en orden; al final suena el buzzer
    'medidor-agua': svg(`
      <defs><clipPath id="anim-vaso"><path d="M70 26 L76 102 H124 L130 26 Z"/></clipPath></defs>
      <g clip-path="url(#anim-vaso)"><rect class="lleno-c a-agua" x="66" y="30" width="70" height="72" style="fill-opacity:.35"/></g>
      <path d="M70 26 L76 102 H124 L130 26"/>
      <rect class="o" x="97" y="12" width="7" height="72" rx="1"/>
      <circle class="led led-r a-agua-r" cx="152" cy="30" r="5"/>
      <circle class="led led-a a-agua-a" cx="152" cy="48" r="5"/>
      <circle class="led led-b a-agua-b" cx="152" cy="66" r="5"/>
      <circle class="led led-v a-agua-v" cx="152" cy="84" r="5"/>
      <circle cx="176" cy="30" r="6"/>
      <path class="o a-zumbido" d="M186 24 q4 6 0 12"/><path class="o a-zumbido" d="M191 20 q6 10 0 20"/>`),

    // El sensor PIR ve a la persona y la sirena parpadea
    'alarma-movimiento': svg(`
      ${suelo}
      <rect x="40" y="62" width="30" height="10" rx="2"/><path class="relleno" d="M43 62 a12 12 0 0 1 24 0 z"/>
      <path class="o a-onda" d="M76 54 q6 8 0 16"/><path class="o a-onda d2" d="M84 50 q9 12 0 24"/><path class="o a-onda d3" d="M92 46 q12 16 0 32"/>
      <rect x="22" y="30" width="22" height="7" rx="2"/>
      <path class="led led-r sirena a-sirena" d="M25 30 a8 8 0 0 1 16 0 z"/>
      <line class="o a-rayo" x1="33" y1="12" x2="33" y2="6"/><line class="o a-rayo" x1="20" y1="18" x2="15" y2="14"/><line class="o a-rayo" x1="46" y1="18" x2="51" y2="14"/>
      <g class="a-intruso">
        <circle cx="168" cy="54" r="6"/><line x1="168" y1="60" x2="168" y2="82"/>
        <line x1="168" y1="82" x2="161" y2="100"/><line x1="168" y1="82" x2="175" y2="100"/>
        <line x1="168" y1="66" x2="160" y2="76"/><line x1="168" y1="66" x2="176" y2="76"/>
      </g>`),

    // La culebrita da vueltas en la matriz y el joystick la guía
    'matriz-joystick': svg(`
      <rect x="45" y="11" width="96" height="96" rx="5"/>
      ${puntos}
      ${culebra}
      <circle class="lleno-c a-comida" cx="123" cy="89" r="3"/>
      <circle cx="170" cy="60" r="15"/>
      <g class="a-palanca"><circle class="relleno" cx="170" cy="60" r="7"/></g>`),

    // El radar barre de lado a lado y aparece un objeto
    'sonar': svg(`
      <path class="tenue-l" d="M25 98 A75 75 0 0 1 175 98"/>
      <path class="tenue-l" d="M50 98 A50 50 0 0 1 150 98"/>
      <path class="tenue-l" d="M75 98 A25 25 0 0 1 125 98"/>
      <line x1="18" y1="98" x2="182" y2="98"/>
      <g class="a-barrido"><line class="o" x1="100" y1="98" x2="100" y2="23"/></g>
      <circle class="lleno-o a-eco" cx="140" cy="60" r="4"/>
      <rect x="92" y="94" width="16" height="10" rx="2"/>`),

    // Las luces de la ruleta giran
    'ruleta': svg(`
      <circle class="tenue-l" cx="100" cy="58" r="36"/>
      ${ruleta}
      <circle class="relleno" cx="100" cy="58" r="12"/>
      <path class="lleno-o" d="M100 10 l-5 -8 h10 z"/>`),

    // El brazo robótico sube, baja y abre la pinza
    'brazo-robotico': svg(`
      ${suelo}
      <rect class="relleno" x="70" y="90" width="40" height="12" rx="2"/>
      <g class="a-brazo1">
        <line class="grueso" x1="90" y1="90" x2="90" y2="50"/>
        <g class="a-brazo2">
          <line class="grueso" x1="90" y1="50" x2="124" y2="50"/>
          <g class="a-pinza1"><line class="o" x1="124" y1="47" x2="134" y2="42"/></g>
          <g class="a-pinza2"><line class="o" x1="124" y1="53" x2="134" y2="58"/></g>
          <circle class="lleno-c" cx="124" cy="50" r="3"/>
        </g>
        <circle class="relleno" cx="90" cy="50" r="5"/>
      </g>
      <circle class="relleno" cx="90" cy="90" r="6"/>`)
  };
})();
