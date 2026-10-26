/* ============================================================
   DATOS DEL SITIO — edita solo este archivo
   ------------------------------------------------------------
   Cada proyecto tiene estos campos:

   id          Identificador corto, sin espacios ni tildes.
   nombre      Nombre del prototipo.
   lema        Frase de una línea que aparece en la caja cerrada.
   categoria   Etiqueta que se muestra junto al título.
   descripcion Párrafo breve: qué hace y cómo funciona.
   integrantes Lista de estudiantes del grupo.
   componentes Lista de materiales usados.
   diagramaTexto  Frase que presenta el diagrama de conexiones.
   evidencias  Lista de { titulo, texto }: cada una es una foto del acordeón
               con su explicación sobrepuesta.
   Las fotos van en img/proyectos/<id>/ con estos nombres:
     portada.jpg, diagrama.png, evidencia-1.jpg, evidencia-2.jpg ...
     (también se aceptan .jpeg, .png y .webp)
   codigo     Código de Arduino. Se escribe entre comillas invertidas ` `
               para poder usar varias líneas.
   ============================================================ */

const PROYECTOS = [
  {
    id: "caneca-automatica",
    nombre: "Caneca basura automática",
    lema: "Se abre sola cuando te acercas",
    categoria: "Sensor ultrasónico",
    descripcion:
      "La tapa se levanta cuando el sensor detecta una mano a menos de 25 cm y vuelve a cerrarse sola. Discutimos en clase qué umbral usar para que no se abriera cada vez que alguien pasaba caminando.",
    integrantes: ["Samuel David Medina Orozco", "Ricardo Esteban Gómez Pulido"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor", "Caneca plástica y soportes"],
    diagramaTexto:
      "El sensor ultrasónico HC-SR04 se conecta así: TRIG al pin 9, ECHO al pin 10, GND al GND y VCC al pin de 3,3 V. El servomotor que mueve la tapa tiene su cable de señal en el pin 6, el rojo en 5 V y el café en GND.",
    evidencias: [
      { titulo: "Armado del circuito", texto: "Conectamos el sensor y el servomotor en la protoboard y revisamos cada cable contra el diagrama." },
      { titulo: "Prueba del sensor", texto: "Acercamos la mano a distintas distancias para ver a cuántos centímetros debía abrirse la tapa." },
      { titulo: "Caneca terminada", texto: "Montamos el servomotor en la caneca real: la tapa se abre sola y se cierra a los tres segundos." }
    ],
    codigo: `#include <Servo.h>

const int TRIG = 9;
const int ECHO = 8;
const int UMBRAL = 25;     // centimetros para abrir

Servo tapa;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  tapa.attach(6);
  tapa.write(0);           // cerrada
  Serial.begin(9600);
}

// Devuelve la distancia medida en centimetros
int medirDistancia() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duracion = pulseIn(ECHO, HIGH);
  return duracion * 0.034 / 2;    // velocidad del sonido
}

void loop() {
  int distancia = medirDistancia();
  Serial.println(distancia);

  if (distancia > 0 && distancia < UMBRAL) {
    tapa.write(100);       // abre
    delay(3000);           // espera a que boten la basura
    tapa.write(0);         // cierra
  }

  delay(100);
}`
  },

  {
    id: "puerta-automatica",
    nombre: "Puerta automática pública",
    lema: "La puerta que reconoce a quien llega",
    categoria: "Control de acceso",
    descripcion:
      "Una puerta a escala que se abre cuando el sensor infrarrojo detecta presencia y confirma con un tono. Incluye un LED rojo mientras está cerrada y verde mientras permanece abierta.",
    integrantes: ["María Fernanda González Pedraza", "Karen Mariana Puin Jiménez", "Sara Valentina González Soler"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor", "Protoboard y jumpers", "Maqueta de la puerta"],
    diagramaTexto:
      "El sensor ultrasónico HC-SR04 usa el pin 7 para TRIG y el pin 6 para ECHO. El servomotor de la puerta recibe su señal por el pin 5. El Arduino entrega 5 V y GND a la protoboard, y desde ella se alimentan el sensor (VCC y GND) y el servomotor (cables rojo y café).",
    evidencias: [
      { titulo: "Maqueta de la puerta", texto: "Construimos la puerta en cartón paja y le pegamos el servomotor en la bisagra." },
      { titulo: "Luces y sonido", texto: "Probamos que el LED rojo se apague, el verde se encienda y el buzzer suene cuando alguien se acerca." },
      { titulo: "Puerta funcionando", texto: "La puerta se abre al detectar presencia y vuelve a cerrarse cuando la persona se aleja." }
    ],
    codigo: `#include <Servo.h>

const int SENSOR = 2;
const int LED_ROJO = 4;
const int LED_VERDE = 5;
const int BUZZER = 7;

Servo puerta;
bool estaAbierta = false;

void setup() {
  pinMode(SENSOR, INPUT);
  pinMode(LED_ROJO, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  puerta.attach(9);
  puerta.write(0);
}

void loop() {
  bool hayPresencia = (digitalRead(SENSOR) == LOW);

  if (hayPresencia && !estaAbierta) {
    tone(BUZZER, 1200, 150);
    puerta.write(90);
    estaAbierta = true;
    delay(4000);
  }

  if (estaAbierta && !hayPresencia) {
    puerta.write(0);
    estaAbierta = false;
  }

  digitalWrite(LED_VERDE, estaAbierta);
  digitalWrite(LED_ROJO, !estaAbierta);
}`
  },

  {
    id: "medidor-humedad",
    nombre: "Medidor de humedad",
    lema: "La matera avisa cuando tiene sed",
    categoria: "Sensor de suelo",
    descripcion:
      "Un sensor enterrado en la matera mide la humedad del suelo y enciende un aviso cuando baja del umbral. Calibrarlo con tierra seca y tierra mojada fue la mejor clase de variables del proyecto.",
    integrantes: ["Laura Fernanda Vargas Arias", "Sara Valentina Barreto Galindo"],
    componentes: ["Arduino UNO", "Sensor de humedad de suelo", "3 LED (rojo, amarillo y verde)", "Resistencia", "Protoboard", "Matera de prueba"],
    diagramaTexto:
      "Tres LED van a los pines digitales 12 (rojo), 10 (amarillo) y 9 (verde) y comparten una resistencia en la protoboard. El sensor de humedad de suelo se conecta con su VCC al pin A0, su señal (SIG) al pin A1 y su GND al GND del Arduino.",
    evidencias: [
      { titulo: "Calibración", texto: "Medimos el sensor en tierra seca y en tierra mojada para encontrar los valores de referencia." },
      { titulo: "Semáforo de humedad", texto: "Los LED indican si la matera está seca, con buena humedad o demasiado húmeda." },
      { titulo: "Prueba en la matera", texto: "Enterramos el sensor y comprobamos que el buzzer avisa cuando hace falta regar." }
    ],
    codigo: `const int SENSOR = A0;
const int LED_SECO = 4;
const int LED_BIEN = 5;
const int LED_HUMEDO = 6;
const int BUZZER = 8;

// Valores obtenidos calibrando en clase:
const int TIERRA_SECA = 850;
const int TIERRA_MOJADA = 350;

void setup() {
  pinMode(LED_SECO, OUTPUT);
  pinMode(LED_BIEN, OUTPUT);
  pinMode(LED_HUMEDO, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lectura = analogRead(SENSOR);

  // Se invierte el rango: mas humedad, menos resistencia
  int humedad = map(lectura, TIERRA_SECA, TIERRA_MOJADA, 0, 100);
  humedad = constrain(humedad, 0, 100);

  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.println(" %");

  digitalWrite(LED_SECO, humedad < 30);
  digitalWrite(LED_BIEN, humedad >= 30 && humedad <= 70);
  digitalWrite(LED_HUMEDO, humedad > 70);

  if (humedad < 30) {
    tone(BUZZER, 880, 200);   // aviso de riego
  }

  delay(1000);
}`
  },

  {
    id: "letrero-led",
    nombre: "Letrero led con Arduino",
    lema: "El nombre del colegio, letra por letra",
    categoria: "Matriz de LED",
    descripcion:
      "Un letrero desplazable que muestra mensajes escritos por el propio grupo. Fue la ocasión para hablar de arreglos y de cómo un texto es, en realidad, una lista de caracteres.",
    integrantes: ["Juan José Caro Aguirre", "Andrés Fernando Bohórquez Soler"],
    componentes: ["Arduino UNO", "Matriz LED 8x8", "Protoboard y jumpers", "Fuente de 5 V", "Marco en madera"],
    diagramaTexto:
      "En Tinkercad la matriz LED 8x8 se representa con un chip ATtiny. Sus tres cables de señal van a los pines digitales 2, 3 y 4; el cable verde lleva los 5 V y el amarillo el GND del Arduino, y todo se arma sobre la protoboard.",
    evidencias: [
      { titulo: "Conexión en cadena", texto: "Unimos las cuatro matrices una detrás de otra y verificamos que todas encendieran." },
      { titulo: "Probando mensajes", texto: "Escribimos distintos textos en el código y vimos cómo se desplazan por el letrero." },
      { titulo: "Letrero terminado", texto: "Montamos las matrices en un marco de madera con el nombre del colegio." }
    ],
    codigo: `#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

#define MODULOS 4
#define PIN_CS  10

MD_Parola letrero = MD_Parola(MD_MAX72XX::FC16_HW, PIN_CS, MODULOS);

// Cambia este texto por el mensaje que quieras mostrar
char mensaje[] = "JOSE CAYETANO VASQUEZ - GRADO 8";

void setup() {
  letrero.begin();
  letrero.setIntensity(5);
  letrero.displayClear();
  letrero.displayText(mensaje, PA_CENTER, 60, 1000,
                      PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void loop() {
  // displayAnimate devuelve true cuando termina el recorrido
  if (letrero.displayAnimate()) {
    letrero.displayReset();   // vuelve a empezar
  }
}`
  },

  {
    id: "medidor-agua",
    nombre: "Medidor de agua con Arduino",
    lema: "Cuánta agua queda, en tres colores",
    categoria: "Sensor de nivel",
    descripcion:
      "Un sensor de nivel de agua mide qué tan lleno está un recipiente y lo traduce a un porcentaje. Tres LED indican nivel bajo, medio y alto, y un buzzer avisa cuando el recipiente está casi vacío.",
    integrantes: ["Rafael Armando Jiménez Arias", "Manolo Steven Boyacá Jiménez"],
    componentes: ["Arduino UNO", "Sensor de humedad usado como sensor de nivel", "4 LED (azul, verde, amarillo y rojo)", "Protoboard", "Vaso con agua"],
    diagramaTexto:
      "Un sensor de humedad funciona aquí como sensor de nivel dentro de un vaso con agua: su señal entra por el pin analógico A0 y su alimentación (VCC y GND) viene de la protoboard, que recibe los 5 V y el GND del Arduino. Cuatro LED indican el nivel: azul en el pin 5, verde en el 4, amarillo en el 3 y rojo en el 2.",
    evidencias: [
      { titulo: "Montaje del sensor", texto: "Fijamos el sensor dentro del recipiente y conectamos los LED de nivel." },
      { titulo: "Llenando el recipiente", texto: "Fuimos agregando agua poco a poco para ver cómo cambia la lectura y qué LED se enciende." },
      { titulo: "Alarma de nivel bajo", texto: "Cuando el agua baja del 10 % el buzzer suena para avisar que casi no queda." }
    ],
    codigo: `const int SENSOR = A0;
const int LED_BAJO = 4;
const int LED_MEDIO = 5;
const int LED_ALTO = 6;
const int BUZZER = 8;

const int LECTURA_VACIO = 0;      // sensor seco
const int LECTURA_LLENO = 520;    // sensor sumergido (calibrar)

void setup() {
  pinMode(LED_BAJO, OUTPUT);
  pinMode(LED_MEDIO, OUTPUT);
  pinMode(LED_ALTO, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lectura = analogRead(SENSOR);

  // Convierte la lectura en un porcentaje de 0 a 100
  int nivel = map(lectura, LECTURA_VACIO, LECTURA_LLENO, 0, 100);
  nivel = constrain(nivel, 0, 100);

  Serial.print("Nivel: ");
  Serial.print(nivel);
  Serial.println(" %");

  digitalWrite(LED_BAJO, nivel < 30);
  digitalWrite(LED_MEDIO, nivel >= 30 && nivel < 70);
  digitalWrite(LED_ALTO, nivel >= 70);

  if (nivel < 10) {
    tone(BUZZER, 1000, 300);   // casi vacio
  }

  delay(500);
}`
  },

  {
    id: "alarma-movimiento",
    nombre: "Alarma con detector de movimiento",
    lema: "Nadie pasa sin que ella se entere",
    categoria: "Sensor de movimiento",
    descripcion:
      "Un sensor PIR detecta cuando alguien se mueve frente a él y activa una sirena con luz intermitente. Después de la alarma el sistema espera unos segundos y vuelve a vigilar.",
    integrantes: ["Miguel Ángel Guzmán Arias", "Danilson Daniel Cáceres Caro"],
    componentes: ["Arduino UNO", "Sensor PIR HC-SR501", "Buzzer", "LED rojo y resistencia de 220 Ω", "Protoboard y jumpers"],
    diagramaTexto:
      "Diagrama pendiente: todavía no se ha cargado la imagen del diagrama de este prototipo.",
    evidencias: [
      { titulo: "Conectando el PIR", texto: "Conectamos el sensor de movimiento, el LED y el buzzer según el diagrama." },
      { titulo: "Ajuste de sensibilidad", texto: "Movimos la mano frente al sensor y ajustamos el tiempo y la distancia de detección." },
      { titulo: "Alarma activada", texto: "Al detectar movimiento, la sirena suena con luz intermitente y luego vuelve a vigilar." }
    ],
    codigo: `const int PIR = 2;
const int LED = 13;
const int BUZZER = 8;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
  delay(10000);            // el PIR necesita unos segundos para calibrarse
}

void sonarAlarma() {
  for (int i = 0; i < 6; i++) {
    tone(BUZZER, 1500);
    digitalWrite(LED, HIGH);
    delay(150);
    tone(BUZZER, 900);
    digitalWrite(LED, LOW);
    delay(150);
  }
  noTone(BUZZER);
}

void loop() {
  if (digitalRead(PIR) == HIGH) {
    Serial.println("Movimiento detectado");
    sonarAlarma();
    delay(3000);           // pausa antes de volver a vigilar
  }
}`
  },

  {
    id: "matriz-joystick",
    nombre: "Matriz joystick",
    lema: "Un punto de luz que obedece a la mano",
    categoria: "Entrada analógica",
    descripcion:
      "Una matriz de LED 8x8 donde un punto luminoso se desplaza según el movimiento del joystick. El reto fue entender que el joystick no entrega una posición, sino dos valores de 0 a 1023 que hay que traducir a coordenadas.",
    integrantes: ["Alisson Sarith Cuervo Pulido", "Neymis Taliana Cañas Chaverra"],
    componentes: ["Arduino UNO", "Matriz LED 8x8 con MAX7219", "Módulo joystick", "Protoboard y jumpers"],
    diagramaTexto:
      "El módulo joystick recibe +5 V y GND y entrega sus ejes (VRx y VRy) y el pulsador SW; en el diagrama la salida VRy se rotula A1. La matriz LED 8x8 con MAX7219 usa cinco cables: VCC, GND, DIN, CS y CLK, que llegan a la hilera de pines digitales del Arduino. La protoboard distribuye la alimentación.",
    evidencias: [
      { titulo: "Leyendo el joystick", texto: "Imprimimos en el monitor serie los valores de 0 a 1023 que entrega cada eje." },
      { titulo: "De valores a coordenadas", texto: "Usamos map() para convertir esos valores en una fila y una columna de la matriz." },
      { titulo: "Punto de luz en movimiento", texto: "El punto recorre la matriz al mover el joystick con la mano." }
    ],
    codigo: `#include <LedControl.h>

// DIN = 11, CLK = 13, CS = 10, una sola matriz
LedControl matriz = LedControl(11, 13, 10, 1);

const int PIN_X = A0;   // eje horizontal del joystick
const int PIN_Y = A1;   // eje vertical del joystick

int columna = 3;        // posicion inicial del punto
int fila = 3;

void setup() {
  matriz.shutdown(0, false);   // despierta la matriz
  matriz.setIntensity(0, 8);   // brillo medio (0 a 15)
  matriz.clearDisplay(0);
}

void loop() {
  int valorX = analogRead(PIN_X);   // 0 a 1023
  int valorY = analogRead(PIN_Y);

  // map convierte el rango del joystick al rango de la matriz
  columna = map(valorX, 0, 1023, 0, 7);
  fila    = map(valorY, 0, 1023, 0, 7);

  matriz.clearDisplay(0);
  matriz.setLed(0, fila, columna, true);

  delay(80);   // sin esta pausa el punto viaja demasiado rapido
}`
  },

  {
    id: "caseta-peaje",
    nombre: "Caseta de peaje",
    lema: "La barrera sube solo cuando llega un carro",
    categoria: "Sensor y servomotor",
    descripcion:
      "Una maqueta de caseta de peaje con una barrera accionada por servomotor. Un sensor ultrasónico detecta el vehículo, la barrera se levanta unos segundos y vuelve a bajar; un semáforo de dos LED indica si se puede pasar.",
    integrantes: ["Julieth Mariana Suica López", "Deisy Carolina Silva Sanabria", "Yulieth Valeria Plazas Sanabria", "Sara Daniela Caro González"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor", "LED rojo y verde con resistencias", "Protoboard", "Maqueta de la caseta"],
    diagramaTexto:
      "El servomotor de la barrera recibe su señal por el pin 10. El sensor HC-SR04 envía una sola señal por el pin 9 (sus terminales TRIG y ECHO aparecen unidos). El LED rojo está en el pin 5 y el verde en el pin 7, cada uno con su resistencia. Sensor, servomotor y LED toman su alimentación de los rieles de la protoboard.",
    evidencias: [
      { titulo: "Maqueta de la caseta", texto: "Armamos la carretera, la caseta y la barrera con el servomotor." },
      { titulo: "Detección del vehículo", texto: "Probamos a qué distancia el sensor reconoce el carro de juguete." },
      { titulo: "Barrera y semáforo", texto: "La barrera sube, el LED verde se enciende y todo vuelve a su lugar cuando pasa el carro." }
    ],
    codigo: `#include <Servo.h>

const int TRIG = 9;
const int ECHO = 8;
const int LED_ROJO = 4;
const int LED_VERDE = 5;
const int DISTANCIA_CARRO = 10;   // centimetros

Servo barrera;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(LED_ROJO, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  barrera.attach(6);
  barrera.write(0);                 // barrera abajo
  digitalWrite(LED_ROJO, HIGH);
}

int medirDistancia() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH) * 0.034 / 2;
}

void loop() {
  int distancia = medirDistancia();

  if (distancia > 0 && distancia < DISTANCIA_CARRO) {
    digitalWrite(LED_ROJO, LOW);
    digitalWrite(LED_VERDE, HIGH);
    barrera.write(90);              // sube la barrera
    delay(4000);                    // tiempo para que pase el carro
    barrera.write(0);               // baja la barrera
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_ROJO, HIGH);
  }

  delay(100);
}`
  },

  {
    id: "sonar",
    nombre: "Sonar con Arduino",
    lema: "Ver con sonido lo que el ojo no alcanza",
    categoria: "Sensor ultrasónico",
    descripcion:
      "Un sensor ultrasónico montado sobre un servomotor barre un arco de 180° y mide la distancia en cada ángulo. Los datos se envían al computador por el puerto serie para dibujar un radar sencillo.",
    integrantes: ["Ángela Lizeth Soler Fonseca", "Diana Alejandra Galindo Caro"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor", "LED con resistencia", "Zumbador (buzzer)", "Protoboard"],
    diagramaTexto:
      "El sensor HC-SR04 usa el pin 4 para TRIG y el pin 2 para ECHO, y se alimenta con 5 V y GND. El servomotor recibe su señal por el pin 12. El LED va al pin 7 y el zumbador (buzzer) al pin 8; ambos regresan a GND por la protoboard.",
    evidencias: [
      { titulo: "Sensor sobre el servo", texto: "Pegamos el sensor ultrasónico sobre el servomotor para que pueda girar." },
      { titulo: "Barrido de 180 grados", texto: "El servo gira de a un grado y el sensor mide la distancia en cada posición." },
      { titulo: "Datos en el computador", texto: "Los valores de ángulo y distancia aparecen en el monitor serie, listos para dibujar el radar." }
    ],
    codigo: `#include <Servo.h>

const int TRIG = 9;
const int ECHO = 8;

Servo base;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  base.attach(6);
  Serial.begin(9600);
}

int medirDistancia() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH) * 0.034 / 2;
}

// Mide en un angulo y envia "angulo,distancia" al computador
void escanear(int angulo) {
  base.write(angulo);
  delay(30);                       // da tiempo a que el servo llegue
  Serial.print(angulo);
  Serial.print(",");
  Serial.println(medirDistancia());
}

void loop() {
  for (int angulo = 15; angulo <= 165; angulo++) {
    escanear(angulo);              // barrido de ida
  }
  for (int angulo = 165; angulo >= 15; angulo--) {
    escanear(angulo);              // barrido de vuelta
  }
}`
  },

  {
    id: "ruleta",
    nombre: "Ruleta",
    lema: "El azar también se programa",
    categoria: "Aleatoriedad",
    descripcion:
      "Doce LED en círculo que giran cada vez más lento hasta detenerse en uno. El grupo descubrió que random() siempre daba el mismo resultado hasta que aprendieron a sembrar la semilla con randomSeed().",
    integrantes: ["Carlos Adrián Silva Plazas", "David Fernando Plazas Fuentes"],
    componentes: ["Arduino UNO", "Motor paso a paso 28BYJ-48", "Driver ULN2003", "Jumpers", "Base de la ruleta"],
    diagramaTexto:
      "Este montaje mueve un motor paso a paso 28BYJ-48 con un driver ULN2003. Los cuatro pines de control del driver (IN1 a IN4) se conectan a los pines digitales 11, 10, 9 y 8 del Arduino, y el driver toma 5 V y GND directamente de la placa.",
    evidencias: [
      { titulo: "Círculo de LED", texto: "Pegamos los 12 LED en la base circular y soldamos cada resistencia." },
      { titulo: "El problema del azar", texto: "Descubrimos que random() repetía el resultado hasta que usamos randomSeed()." },
      { titulo: "Ruleta girando", texto: "Al presionar el botón los LED giran, van más lento y se detienen en uno que parpadea." }
    ],
    codigo: `const int LEDS[] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13};
const int TOTAL = 12;
const int BOTON = A1;

void setup() {
  for (int i = 0; i < TOTAL; i++) {
    pinMode(LEDS[i], OUTPUT);
  }
  pinMode(BOTON, INPUT_PULLUP);

  // A0 esta al aire: su ruido sirve como semilla del azar
  randomSeed(analogRead(A0));
}

void girar() {
  int ganador = random(0, TOTAL);
  int vueltas = 3 * TOTAL + ganador;
  int pausa = 25;

  for (int paso = 0; paso <= vueltas; paso++) {
    int actual = paso % TOTAL;

    digitalWrite(LEDS[(actual + TOTAL - 1) % TOTAL], LOW);
    digitalWrite(LEDS[actual], HIGH);

    delay(pausa);
    pausa = pausa + 4;   // cada vuelta va mas lenta
  }

  // parpadeo del ganador
  for (int i = 0; i < 6; i++) {
    digitalWrite(LEDS[ganador], !digitalRead(LEDS[ganador]));
    delay(180);
  }
  digitalWrite(LEDS[ganador], HIGH);
}

void loop() {
  if (digitalRead(BOTON) == LOW) {
    girar();
    delay(500);
  }
}`
  },

  {
    id: "brazo-robotico",
    nombre: "Brazo robótico",
    lema: "Una mano mecánica que sigue tus giros",
    categoria: "Servomotores",
    descripcion:
      "Un brazo de tres articulaciones, cada una movida por un servomotor. Tres potenciómetros funcionan como mando: al girar uno, la articulación correspondiente se mueve al ángulo equivalente.",
    integrantes: ["Sara Eliana Plazas Sanabria", "Laura Fernanda Sanabria Arias"],
    componentes: ["Arduino UNO", "3 servomotores", "Motor paso a paso con driver ULN2003", "Módulo de alimentación para protoboard", "Protoboard y jumpers"],
    diagramaTexto:
      "Tres servomotores (inferior, superior y pinza) reciben su señal por los pines 9, 10 y 11, y se alimentan desde los rieles de la protoboard. Un motor paso a paso con driver ULN2003 se controla con los pines 7, 6, 5 y 4. La protoboard recibe 5 V y GND del Arduino y lleva además un módulo de alimentación.",
    evidencias: [
      { titulo: "Estructura del brazo", texto: "Cortamos y unimos las piezas del brazo y ubicamos un servomotor en cada articulación." },
      { titulo: "Mando con potenciómetros", texto: "Cada potenciómetro controla una articulación: base, hombro y codo." },
      { titulo: "Brazo en movimiento", texto: "Al girar los potenciómetros el brazo se mueve y puede alcanzar objetos pequeños." }
    ],
    codigo: `#include <Servo.h>

Servo base;
Servo hombro;
Servo codo;

const int POT_BASE = A0;
const int POT_HOMBRO = A1;
const int POT_CODO = A2;

void setup() {
  base.attach(3);
  hombro.attach(5);
  codo.attach(6);
}

// Convierte una lectura de potenciometro en un angulo de servo
int leerAngulo(int pin) {
  int lectura = analogRead(pin);       // 0 a 1023
  return map(lectura, 0, 1023, 0, 180);
}

void loop() {
  base.write(leerAngulo(POT_BASE));
  hombro.write(leerAngulo(POT_HOMBRO));
  codo.write(leerAngulo(POT_CODO));

  delay(15);   // deja respirar a los servos
}`
  }
];

/* ============================================================
   GALERÍA
   ------------------------------------------------------------
   categoria: diagnostico | tinkercad | arduino | prototipos
   Reemplaza "src" por la ruta de tus fotos, por ejemplo:
   { src: "img/galeria/foto01.jpg", alt: "...", categoria: "arduino" }
   ============================================================ */

const GALERIA = [
  { src: "img/placeholder.svg", alt: "Aplicación de la prueba diagnóstica en el aula", categoria: "diagnostico", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Estudiantes resolviendo el cuestionario inicial", categoria: "diagnostico", alto: "alta" },
  { src: "img/placeholder.svg", alt: "Primer circuito simulado en Tinkercad", categoria: "tinkercad", alto: "alta" },
  { src: "img/placeholder.svg", alt: "Simulación de un semáforo con condicionales", categoria: "tinkercad", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Explicación de variables en el tablero", categoria: "tinkercad", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Montaje de un LED sobre protoboard", categoria: "arduino", alto: "alta" },
  { src: "img/placeholder.svg", alt: "Carga del primer programa a la placa Arduino UNO", categoria: "arduino", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Revisión del cableado de un sensor ultrasónico", categoria: "arduino", alto: "alta" },
  { src: "img/placeholder.svg", alt: "Prototipo de la caneca automática terminado", categoria: "prototipos", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Sustentación del letrero LED ante el curso", categoria: "prototipos", alto: "alta" },
  { src: "img/placeholder.svg", alt: "Prueba del medidor de humedad en la matera", categoria: "prototipos", alto: "corta" },
  { src: "img/placeholder.svg", alt: "Grupo completo con los once prototipos", categoria: "prototipos", alto: "alta" }
];
