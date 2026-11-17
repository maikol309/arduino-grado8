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
   ext         (opcional) extensión de las fotos del prototipo: "jpeg", "png"... Por defecto "jpg".
   video       (opcional) ruta del video: "videos/<id>.mp4". Si el archivo no existe, no se muestra.
   videoTexto  (opcional) frase que presenta el video.
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
      "La tapa de la caneca se abre sola cuando el sensor ultrasónico detecta una mano u objeto a menos de 20 cm, y se queda abierta 4 segundos; mientras el objeto siga cerca, el tiempo se reinicia. La caja es de cartón forrada con chapas de botella, y un servomotor con una varilla levanta la tapa. El programa mide el tiempo con millis() para no detenerse mientras espera.",
    integrantes: ["Samuel David Medina Orozco", "Ricardo Esteban Gómez Pulido"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor SG90", "Caja de cartón forrada con chapas", "Varilla para levantar la tapa", "Cables jumper y cinta"],
    ext: "jpeg",
    video: "videos/caneca-automatica.mp4",
    videoTexto: "Así funciona el prototipo: cuando una mano se acerca a menos de 20 cm, la tapa se abre y luego se cierra sola.",
    diagramaTexto:
      "El sensor ultrasónico HC-SR04 se conecta así: TRIG al pin 9, ECHO al pin 10, GND al GND y VCC al pin de 3,3 V. El servomotor que mueve la tapa tiene su cable de señal en el pin 6, el rojo en 5 V y el café en GND.",
    evidencias: [
      { titulo: "Materiales sobre la mesa", texto: "Sensor ultrasónico HC-SR04 y sus cables de conexión antes de armar el prototipo." },
      { titulo: "Cables del sensor", texto: "Los cables de colores del sensor, ya organizados y unidos con cinta." },
      { titulo: "La caja de chapas", texto: "La caja de cartón forrada con chapas, con el Arduino UNO pegado a un costado." },
      { titulo: "Arduino fijado a la caja", texto: "El Arduino se asegura a la caja con cinta y se tienden los cables." },
      { titulo: "Conexiones del Arduino", texto: "Los cables naranja y rojo conectados al Arduino y sujetos con cinta." },
      { titulo: "Detalle de las conexiones", texto: "Vista cercana de los cables que salen del Arduino UNO." },
      { titulo: "El servomotor", texto: "El servomotor SG90 dentro de la caja, con una varilla pegada a su eje." },
      { titulo: "Sensor y servo por dentro", texto: "El sensor pegado en la tapa y el servomotor con su varilla, vistos desde adentro." },
      { titulo: "Conectando los cables", texto: "Un estudiante conecta los cables en el costado de la caja." },
      { titulo: "Revisando las conexiones", texto: "Se terminan de conectar los cables por el costado de la caja." },
      { titulo: "Cables asegurados", texto: "La caja con el Arduino afuera y los cables sujetos con cinta." },
      { titulo: "Los ojos del sensor", texto: "La tapa con los dos orificios por donde el sensor ultrasónico mide la distancia." },
      { titulo: "Escribiendo el código", texto: "Un estudiante escribe el programa en el computador." },
      { titulo: "Cargando el programa", texto: "Se carga el programa al Arduino con el cable USB conectado al computador." },
      { titulo: "Ajustes y pruebas", texto: "Un estudiante revisa y ajusta el prototipo mientras lo prueban." },
      { titulo: "Probando la tapa", texto: "Se levanta la tapa para comprobar el sensor y el servomotor." },
      { titulo: "Prototipo presentado", texto: "Un estudiante muestra el prototipo armado a sus compañeros." }
    ],
    codigo: `#include <Servo.h>

// Pines del sensor ultrasónico HC-SR04
const int trigPin = 9;   // Pin que envía el pulso ultrasónico
const int echoPin = 10;  // Pin que recibe el eco reflejado

// Objeto para controlar el servomotor
Servo tapaServo;
const int servoPin = 6;  // Pin de señal del servo

// Parámetros configurables
const int anguloCerrado = 0;      // Posición de tapa cerrada
const int anguloAbierto = 112;    // Posición de tapa abierta
const int umbralDistancia = 20;   // Distancia máxima para detectar un objeto (cm)
const unsigned long tiempoAbierto = 4000; // Tiempo que permanecerá abierta la tapa (ms)

// Intervalo entre mediciones para evitar lecturas continuas
const unsigned long intervaloMedicion = 100;

// Tiempo máximo de espera del eco (30 ms ≈ 5 m)
const unsigned long timeoutEcho = 30000;

// Variables de control
unsigned long tiempoInicioApertura = 0; // Guarda el momento en que se abrió la tapa
unsigned long ultimaMedicion = 0;       // Guarda la última medición realizada
bool tapaAbierta = false;               // Estado actual de la tapa

void setup() {
  // Configuración de los pines del sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Inicialización del servomotor en posición cerrada
  tapaServo.attach(servoPin);
  tapaServo.write(anguloCerrado);

  // Inicialización del monitor serie
  Serial.begin(9600);
  Serial.println("Sistema iniciado. Tapa cerrada.");
}

// Función para medir la distancia usando el sensor ultrasónico
int medirDistancia() {

  // Genera el pulso ultrasónico
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  // Mide el tiempo que tarda en volver el eco
  long duration = pulseIn(echoPin, HIGH, timeoutEcho);

  // Si no hay eco devuelve -1
  if (duration == 0) return -1;

  // Convierte el tiempo a distancia en centímetros
  return duration * 0.034 / 2;
}

void loop() {
  unsigned long ahora = millis();

  // Realiza mediciones cada cierto tiempo sin bloquear el programa
  if (ahora - ultimaMedicion >= intervaloMedicion) {

    ultimaMedicion = ahora;

    // Obtiene la distancia medida
    int distance = medirDistancia();

    // Muestra la distancia en el monitor serie
    Serial.print("Distancia medida: ");

    if (distance < 0) {
      Serial.println("sin eco");
    } else {
      Serial.print(distance);
      Serial.println(" cm");
    }

    // Verifica si existe un objeto dentro del rango establecido
    bool objetoCerca = (distance > 0 && distance < umbralDistancia);

    // Abre la tapa si detecta un objeto y está cerrada
    if (objetoCerca && !tapaAbierta) {

      tapaServo.write(anguloAbierto);
      tapaAbierta = true;
      tiempoInicioApertura = ahora;

      Serial.println("Objeto detectado. Tapa abierta.");
    }

    // Si el objeto sigue presente, reinicia el temporizador
    else if (objetoCerca && tapaAbierta) {
      tiempoInicioApertura = ahora;
    }
  }

  // Cierra la tapa cuando pasa el tiempo establecido sin detectar actividad
  if (tapaAbierta && (ahora - tiempoInicioApertura >= tiempoAbierto)) {

    tapaServo.write(anguloCerrado);
    tapaAbierta = false;

    Serial.println("Tiempo cumplido. Tapa cerrada.");
  }
}`
  },

  {
    id: "puerta-automatica",
    nombre: "Puerta automática pública",
    lema: "La puerta que reconoce a quien llega",
    categoria: "Control de acceso",
    descripcion:
      "Una puerta a escala, de cartón pintado, que se abre sola cuando el sensor ultrasónico detecta un objeto o una persona a menos de 30 cm: el servomotor la gira a 90 grados y, cuando ya no hay nada cerca, la regresa a 0 grados para cerrarla. El programa mide la distancia con el sensor HC-SR04 y la muestra en el Monitor Serie.",
    integrantes: ["María Fernanda González Pedraza", "Karen Mariana Puin Jiménez", "Sara Valentina González Soler"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor", "Protoboard y cables jumper", "Puerta de cartón pintado", "Base de cartón"],
    ext: "jpeg",
    video: "videos/puerta-automatica.mp4",
    videoTexto: "Así funciona el prototipo: cuando el sensor detecta un objeto a menos de 30 cm, el servomotor abre la puerta y luego la cierra.",
    diagramaTexto:
      "El sensor ultrasónico HC-SR04 usa el pin 7 para TRIG y el pin 6 para ECHO. El servomotor de la puerta recibe su señal por el pin 5. El Arduino entrega 5 V y GND a la protoboard, y desde ella se alimentan el sensor (VCC y GND) y el servomotor (cables rojo y café).",
    evidencias: [
      { titulo: "Componentes en la base", texto: "Protoboard, sensor ultrasónico y cables sobre la base de cartón, antes de conectar." },
      { titulo: "El sensor ultrasónico", texto: "El sensor HC-SR04 con sus cables de conexión." },
      { titulo: "Servomotor en la puerta", texto: "El servomotor fijado en el marco de la puerta de cartón pintada." },
      { titulo: "Conectando al Arduino", texto: "Se inserta un cable en los pines del Arduino UNO." },
      { titulo: "Cables al Arduino", texto: "Se conectan los cables entre el Arduino UNO y la protoboard." },
      { titulo: "Protoboard", texto: "Se coloca un cable en la protoboard." },
      { titulo: "Conectando con los apuntes", texto: "Una estudiante conecta un cable en la protoboard con su cuaderno de apuntes al lado." },
      { titulo: "Concentrada en el montaje", texto: "Una estudiante revisa con atención las conexiones sobre la protoboard." },
      { titulo: "Armando el circuito", texto: "Se conectan los cables al Arduino mientras se arma el circuito." },
      { titulo: "Vista de las conexiones", texto: "Vista desde arriba de las conexiones entre el Arduino, la protoboard y el sensor." },
      { titulo: "Sensor y Arduino conectados", texto: "Una estudiante conecta cables al Arduino, con el sensor ultrasónico a su lado, visto desde arriba." },
      { titulo: "Conectando junto al computador", texto: "Una estudiante conecta un cable al Arduino con el diagrama de Tinkercad abierto en la pantalla." },
      { titulo: "Siguiendo el diagrama", texto: "Se arma el circuito siguiendo el diagrama de conexiones que se ve en el computador." },
      { titulo: "Revisando conexiones", texto: "Se revisan las conexiones del sensor, la protoboard y el Arduino." },
      { titulo: "Montaje con el computador", texto: "El montaje junto al computador, donde están el diagrama y el programa." },
      { titulo: "Prototipo armado", texto: "La puerta con el servomotor y el sensor, la protoboard y el Arduino conectado por USB." }
    ],
    codigo: `#include <Servo.h> // Incluye la librería que permite controlar el servomotor

Servo s1; // Crea el objeto s1 para controlar el servomotor

const int trigPin = 7; // Define el pin 7 como salida para enviar la señal del sensor ultrasónico
const int echoPin = 6; // Define el pin 6 como entrada para recibir el eco del sensor

long duration; // Guarda el tiempo que tarda en regresar la señal ultrasónica

int distanceCm, distanceInch; // Declara variables para guardar la distancia en centímetros y pulgadas

void setup()
{
  Serial.begin(9600); // Inicia la comunicación serial a 9600 baudios

  pinMode(trigPin, OUTPUT); // Configura el pin Trig como salida
  pinMode(echoPin, INPUT); // Configura el pin Echo como entrada

  s1.attach(5); // Conecta el servomotor al pin 5 de Arduino
}

void loop()
{
  digitalWrite(trigPin, LOW); // Mantiene apagada la señal del sensor
  delayMicroseconds(2); // Espera 2 microsegundos

  digitalWrite(trigPin, HIGH); // Envía una señal ultrasónica
  delayMicroseconds(10); // Mantiene la señal durante 10 microsegundos

  digitalWrite(trigPin, LOW); // Finaliza el envío de la señal

  duration = pulseIn(echoPin, HIGH); // Mide el tiempo que tarda en regresar el eco

  distanceCm = duration * 0.034 / 2; // Calcula la distancia en centímetros
  distanceInch = duration * 0.0133 / 2; // Calcula la distancia en pulgadas

  Serial.println("Distance: "); // Muestra el texto Distance en el monitor serial
  Serial.println(distanceCm); // Muestra la distancia detectada en centímetros

  delay(50); // Espera 50 milisegundos antes de repetir la medición

  if (distanceCm < 30) // Comprueba si un objeto está a menos de 30 centímetros
  {
    s1.write(90); // Mueve el servomotor a 90 grados para abrir la puerta
    delay(1000); // Espera 1 segundo
  }

  else // Si el objeto está a 30 centímetros o más
  {
    s1.write(0); // Regresa el servomotor a 0 grados para cerrar la puerta
    delay(10); // Espera 10 milisegundos
  }
}`
  },

  {
    id: "caseta-peaje",
    nombre: "Caseta de peaje",
    lema: "La barrera sube solo cuando llega un carro",
    categoria: "Sensor y servomotor",
    descripcion:
      "Una maqueta de caseta de peaje hecha con palos de helado. El sensor ultrasónico mide la distancia al carro: cuando llega a 20 cm o menos, la barrera movida por el servomotor sube, se enciende el LED rojo y suena el buzzer; cuando no hay carro, la barrera baja y queda encendido el LED verde. La distancia se muestra en el Monitor Serie.",
    integrantes: ["Julieth Mariana Suica López", "Deisy Carolina Silva Sanabria", "Yulieth Valeria Plazas Sanabria", "Sara Daniela Caro González"],
    componentes: ["Arduino UNO", "Sensor ultrasónico HC-SR04", "Servomotor (barrera)", "LED rojo y LED verde con resistencias", "Buzzer", "Protoboard y cables jumper", "Caseta de palos de helado"],
    ext: "jpeg",
    video: "videos/caseta-peaje.mp4",
    videoTexto: "Así funciona: cuando el carro se acerca a 20 cm o menos, la barrera sube, se enciende el LED rojo y suena el buzzer.",
    diagramaTexto:
      "El servomotor de la barrera recibe su señal por el pin 10. El sensor HC-SR04 envía una sola señal por el pin 9 (sus terminales TRIG y ECHO aparecen unidos). El LED rojo está en el pin 5 y el verde en el pin 7, cada uno con su resistencia. Sensor, servomotor y LED toman su alimentación de los rieles de la protoboard. En el código final los pines cambiaron: TRIG en el 8, ECHO en el 7, servomotor en el 9, LED verde en el 2, LED rojo en el 3 y buzzer en el 4.",
    evidencias: [
      { titulo: "Trabajo en equipo", texto: "Varias manos arman el circuito: sensor ultrasónico, protoboard, Arduino y servomotor sobre la mesa." },
      { titulo: "Primeras conexiones", texto: "Se conectan los cables en la protoboard; abajo se ven el sensor y el servomotor." },
      { titulo: "Sensor y servomotor", texto: "El sensor ultrasónico y el servomotor ya conectados a la protoboard y al Arduino." },
      { titulo: "Acomodando los componentes", texto: "Se acomodan el sensor ultrasónico y el servomotor junto al circuito." },
      { titulo: "Conectando los LED", texto: "Se conectan cables cerca de los LED rojo y verde de la protoboard." },
      { titulo: "Circuito en marcha", texto: "La protoboard con los LED, el sensor y el Arduino unidos por cables de colores." },
      { titulo: "Colocando los LED", texto: "Se colocan los LED verde y rojo en la protoboard." },
      { titulo: "LED y resistencias", texto: "Los LED verde y rojo con sus resistencias, vistos de cerca." },
      { titulo: "Revisando el Arduino", texto: "Un estudiante revisa las conexiones del Arduino; a la izquierda se ven los LED." },
      { titulo: "Cables al Arduino", texto: "Se conectan cables a los pines del Arduino UNO." },
      { titulo: "Más conexiones", texto: "Se inserta un cable en el Arduino; arriba se ven los LED en la protoboard." },
      { titulo: "Ajustando conexiones", texto: "Una estudiante ajusta los cables del circuito con ayuda de sus compañeros." },
      { titulo: "Revisión del montaje", texto: "Una estudiante revisa el montaje; al lado se ve el servomotor." },
      { titulo: "La caseta y el circuito", texto: "La caseta de palos de helado junto al circuito: protoboard, sensor, LED, Arduino y servomotor." },
      { titulo: "Montaje final", texto: "Dos estudiantes instalan los componentes en la caseta." }
    ],
    codigo: `// Proyecto -> Caseta de peaje
#include <Servo.h>              // librería para controlar el servomotor de la barrera

// -------------------------
// PINES
// -------------------------
const int TRIG = 8;             // pin que envía el pulso del sensor ultrasónico
const int ECHO = 7;             // pin que recibe el eco del sensor
const int SERVO_PIN = 9;        // señal del servomotor (la barrera)
const int LED_VERDE = 2;        // LED verde: no hay carro
const int LED_ROJO = 3;         // LED rojo: hay un carro en la caseta
const int BUZZER = 4;           // buzzer: suena cuando llega un carro

Servo servo;                    // objeto que controla la barrera


// =========================
// MEDIR DISTANCIA
// =========================
long distancia() {
  digitalWrite(TRIG, LOW);      // apaga la señal del sensor
  delayMicroseconds(2);

  digitalWrite(TRIG, HIGH);     // envía el pulso ultrasónico
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long t = pulseIn(ECHO, HIGH, 30000);   // tiempo que tarda en volver el eco (máximo 30 ms)

  if (t == 0) {                 // si no vuelve el eco, no hay nada cerca
    return 999;
  }
  return t * 0.0343 / 2;        // convierte el tiempo en centímetros
}


// =========================
// CONFIGURACIÓN INICIAL
// =========================
void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  servo.attach(SERVO_PIN);      // conecta el servomotor al pin 9
  servo.write(0);               // la barrera empieza abajo

  Serial.begin(9600);           // abre el Monitor Serie
}


// =========================
// PROGRAMA PRINCIPAL
// =========================
void loop() {
  long d = distancia();         // mide la distancia al carro
  Serial.println(d);            // la muestra en el Monitor Serie

  if (d <= 20) {                // hay un carro a 20 cm o menos
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_ROJO, HIGH);   // se enciende el LED rojo
    tone(BUZZER, 1000);             // suena el buzzer
    servo.write(90);                // la barrera sube
  }
  else {                        // no hay carro cerca
    digitalWrite(LED_VERDE, HIGH);  // se enciende el LED verde
    digitalWrite(LED_ROJO, LOW);
    noTone(BUZZER);                 // el buzzer se apaga
    servo.write(0);                 // la barrera baja
  }

  delay(200);                   // espera 200 ms antes de volver a medir
}`
  },

  {
    id: "medidor-humedad",
    nombre: "Medidor de humedad",
    lema: "La matera avisa cuando tiene sed",
    categoria: "Sensor de suelo",
    descripcion:
      "Un sensor capacitivo enterrado en la matera mide la humedad del suelo y la muestra en porcentaje en una pantalla LCD. Un semáforo de LED y un buzzer indican si el suelo está seco, en estado óptimo o húmedo. Con los valores de lectura en seco y en agua, el programa convierte la señal del sensor en un porcentaje.",
    integrantes: ["Laura Fernanda Vargas Arias", "Sara Valentina Barreto Galindo"],
    componentes: ["Arduino Nano y cable USB", "Sensor de humedad de suelo capacitivo v1.2", "Pantalla LCD 16x2 con módulo I2C", "3 LED (verde, amarillo y rojo) con resistencias", "Buzzer", "Protoboard y cables jumper", "Matera de prueba"],
    ext: "jpeg",
    portadaForma: "1 / 1",
    portadaPos: "center bottom",
    diagramaTexto:
      "Tres LED van a los pines digitales 12 (rojo), 10 (amarillo) y 9 (verde) y comparten una resistencia en la protoboard. El sensor de humedad de suelo se conecta con su VCC al pin A0, su señal (SIG) al pin A1 y su GND al GND del Arduino.",
    evidencias: [
      { titulo: "Los materiales", texto: "Pantalla LCD con su módulo I2C, sensor de humedad capacitivo, Arduino Nano, LED, resistencias, buzzer, protoboard, cables y cable USB." },
      { titulo: "Empezando el montaje", texto: "Con la protoboard todavía vacía, la estudiante empieza a ubicar los componentes; arriba ya están la pantalla y el buzzer." },
      { titulo: "El semáforo de LED", texto: "Se colocan en la protoboard los LED verde, amarillo y rojo, que indicarán si el suelo está húmedo, en estado óptimo o seco." },
      { titulo: "LED y resistencias", texto: "Cada LED lleva su resistencia; se conectan los cables que irán hacia el Arduino." },
      { titulo: "Colocando el Arduino Nano", texto: "El Arduino Nano se inserta en la protoboard, junto a los LED y el buzzer." },
      { titulo: "El sensor de humedad", texto: "El sensor capacitivo de humedad de suelo con su conector de tres cables: alimentación, tierra y señal." },
      { titulo: "Conectando el sensor", texto: "Se unen los cables del sensor a los jumpers que llegan al Arduino." },
      { titulo: "Cable USB", texto: "Se conecta el cable USB al Arduino Nano para darle energía y cargar el programa." },
      { titulo: "Conectando la pantalla", texto: "Se conectan los cables del módulo I2C de la pantalla LCD; el circuito queda completo." }
    ],
    codigo: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Dirección I2C típica: 0x27 o 0x3F
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Definición de Pines
const int pinSensor = A0;
const int ledVerde  = 2;
const int ledAmarillo = 3;
const int ledRojo   = 4;
const int buzzer    = 5;

// CALIBRACIÓN DEL SENSOR CAPACITIVO
// Mide el valor en seco (aire) y sumergido en agua para ajustar estas variables:
const int valorSeco = 620;   // Valor de lectura en el aire
const int valorHumedo = 310; // Valor de lectura sumergido en agua

void setup() {
  pinMode(ledVerde, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledRojo, OUTPUT);
  pinMode(buzzer, OUTPUT);

  // Inicializar Pantalla LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Medidor Humedad");
  lcd.setCursor(0, 1);
  lcd.print("Iniciando...");
  delay(2000);
  lcd.clear();
}

void loop() {
  int lecturaRaw = analogRead(pinSensor);

  // Convertir lectura analógica a porcentaje (0% a 100%)
  int porcentajeHumedad = map(lecturaRaw, valorSeco, valorHumedo, 0, 100);
  porcentajeHumedad = constrain(porcentajeHumedad, 0, 100);

  // Actualizar pantalla LCD
  lcd.setCursor(0, 0);
  lcd.print("Humedad: ");
  lcd.print(porcentajeHumedad);
  lcd.print("%   "); // Espacios para borrar dígitos sobrantes

  lcd.setCursor(0, 1);

  // Lógica de Semáforo y Alerta
  if (porcentajeHumedad < 30) {
    // ESTADO SECO
    lcd.print("Estado: SECO   ");
    digitalWrite(ledRojo, HIGH);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledVerde, LOW);

    // Pitido corto de advertencia
    tone(buzzer, 1000, 200);
  }
  else if (porcentajeHumedad >= 30 && porcentajeHumedad <= 65) {
    // ESTADO OPTIMO
    lcd.print("Estado: OPTIMO ");
    digitalWrite(ledRojo, LOW);
    digitalWrite(ledAmarillo, HIGH);
    digitalWrite(ledVerde, LOW);
    noTone(buzzer);
  }
  else {
    // ESTADO HUMEDO
    lcd.print("Estado: HUMEDO ");
    digitalWrite(ledRojo, LOW);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledVerde, HIGH);
    noTone(buzzer);
  }

  delay(1000); // Lee cada 1 segundo
}`
  },

  {
    id: "letrero-led",
    nombre: "Letrero led con Arduino",
    lema: "El nombre del colegio, letra por letra",
    categoria: "Matriz de LED",
    descripcion:
      "Una matriz LED 8x8 con chip MAX7219 que muestra mensajes que se desplazan de derecha a izquierda, seis figuras y los nombres del grupo, del colegio y del profesor. Cada letra se dibuja con columnas de 5x7 puntos y el programa las desplaza con ciclos for, usando la librería LedControl.",
    integrantes: ["Juan José Caro Aguirre", "Andrés Fernando Bohórquez Soler"],
    componentes: ["Arduino UNO", "Matriz LED 8x8 con MAX7219", "Protoboard y jumpers"],
    ext: "jpeg",
    diagramaTexto:
      "En Tinkercad la matriz LED 8x8 se representa con un chip ATtiny. Sus tres cables de señal van a los pines digitales 2 (DIN), 3 (CS) y 4 (CLK); el cable verde lleva los 5 V y el amarillo el GND del Arduino, y todo se arma sobre la protoboard.",
    evidencias: [
      { titulo: "Simulación en Tinkercad", texto: "El circuito armado en Tinkercad, visto en la pantalla del computador." },
      { titulo: "Escribiendo el código", texto: "Un estudiante escribe el programa; en la pantalla se ve el código junto al Arduino de Tinkercad." },
      { titulo: "Componentes", texto: "Protoboard, Arduino UNO, matriz LED 8x8, cable USB y cables jumper sobre la mesa." },
      { titulo: "Montando la matriz", texto: "Se coloca la matriz LED 8x8 sobre la protoboard." },
      { titulo: "Todo montado", texto: "El Arduino UNO y la matriz LED montados en la protoboard, listos para conectar los cables." },
      { titulo: "El primer cable", texto: "Se conecta el primer cable entre el Arduino y la matriz." },
      { titulo: "Más conexiones", texto: "Se agregan más cables entre el Arduino y la matriz." },
      { titulo: "Cableado", texto: "Los cables de colores unen los pines del Arduino con los de la matriz." },
      { titulo: "Letrero conectado", texto: "El letrero armado: Arduino, protoboard, matriz LED y todos los cables conectados." }
    ],
    codigo: `#include <LedControl.h>

LedControl lc = LedControl(2, 4, 3, 1);

// Orientación que te funcionó: texto derecho y moviéndose de derecha a izquierda
const int ORIENTACION = 5;

// Enciende el punto (x, y): x va de izquierda a derecha y y de arriba hacia abajo
void punto(int x, int y, bool encendido) {
  switch (ORIENTACION) {
    case 0: lc.setLed(0, y, x, encendido); break;
    case 1: lc.setLed(0, y, 7 - x, encendido); break;
    case 2: lc.setLed(0, 7 - y, x, encendido); break;
    case 3: lc.setLed(0, 7 - y, 7 - x, encendido); break;
    case 4: lc.setLed(0, x, y, encendido); break;
    case 5: lc.setLed(0, x, 7 - y, encendido); break;
    case 6: lc.setLed(0, 7 - x, y, encendido); break;
    case 7: lc.setLed(0, 7 - x, 7 - y, encendido); break;
  }
}

// ---------- Letras 5x7 (cada número es una columna, bit 0 = fila de arriba) ----------
void obtenerLetra(char c, byte col[5]) {
  static const byte vacio[5] = {0x00, 0x00, 0x00, 0x00, 0x00};
  const byte *p = vacio;

  static const byte A[5] = {0x7E, 0x09, 0x09, 0x09, 0x7E};
  static const byte B[5] = {0x7F, 0x49, 0x49, 0x49, 0x36};
  static const byte C[5] = {0x3E, 0x41, 0x41, 0x41, 0x22};
  static const byte D[5] = {0x7F, 0x41, 0x41, 0x22, 0x1C};
  static const byte E[5] = {0x7F, 0x49, 0x49, 0x49, 0x41};
  static const byte F[5] = {0x7F, 0x09, 0x09, 0x09, 0x01};
  static const byte G[5] = {0x3E, 0x41, 0x49, 0x49, 0x7A};
  static const byte H[5] = {0x7F, 0x08, 0x08, 0x08, 0x7F};
  static const byte I[5] = {0x00, 0x41, 0x7F, 0x41, 0x00};
  static const byte J[5] = {0x20, 0x40, 0x41, 0x3F, 0x01};
  static const byte L[5] = {0x7F, 0x40, 0x40, 0x40, 0x40};
  static const byte M[5] = {0x7F, 0x02, 0x0C, 0x02, 0x7F};
  static const byte N[5] = {0x7F, 0x04, 0x08, 0x10, 0x7F};
  static const byte O[5] = {0x3E, 0x41, 0x41, 0x41, 0x3E};
  static const byte P[5] = {0x7F, 0x09, 0x09, 0x09, 0x06};
  static const byte Q[5] = {0x3E, 0x41, 0x51, 0x21, 0x5E};
  static const byte R[5] = {0x7F, 0x09, 0x19, 0x29, 0x46};
  static const byte S[5] = {0x46, 0x49, 0x49, 0x49, 0x31};
  static const byte T[5] = {0x01, 0x01, 0x7F, 0x01, 0x01};
  static const byte U[5] = {0x3F, 0x40, 0x40, 0x40, 0x3F};
  static const byte V[5] = {0x1F, 0x20, 0x40, 0x20, 0x1F};
  static const byte X[5] = {0x63, 0x14, 0x08, 0x14, 0x63};
  static const byte Y[5] = {0x07, 0x08, 0x70, 0x08, 0x07};
  static const byte Z[5] = {0x61, 0x51, 0x49, 0x45, 0x43};
  static const byte PUNTO[5] = {0x00, 0x60, 0x60, 0x00, 0x00};
  static const byte DOSPUNTOS[5] = {0x00, 0x36, 0x36, 0x00, 0x00};

  switch (c) {
    case 'A': p = A; break;
    case 'B': p = B; break;
    case 'C': p = C; break;
    case 'D': p = D; break;
    case 'E': p = E; break;
    case 'F': p = F; break;
    case 'G': p = G; break;
    case 'H': p = H; break;
    case 'I': p = I; break;
    case 'J': p = J; break;
    case 'L': p = L; break;
    case 'M': p = M; break;
    case 'N': p = N; break;
    case 'O': p = O; break;
    case 'P': p = P; break;
    case 'Q': p = Q; break;
    case 'R': p = R; break;
    case 'S': p = S; break;
    case 'T': p = T; break;
    case 'U': p = U; break;
    case 'V': p = V; break;
    case 'X': p = X; break;
    case 'Y': p = Y; break;
    case 'Z': p = Z; break;
    case '.': p = PUNTO; break;
    case ':': p = DOSPUNTOS; break;
  }
  for (int i = 0; i < 5; i++) col[i] = p[i];
}

// ---------- Devuelve la columna número "idx" del texto completo ----------
byte columnaTexto(const char *texto, int idx) {
  int largo = strlen(texto);
  if (idx < 0 || idx >= largo * 6) return 0;   // fuera del texto = apagado
  int letra = idx / 6;
  int k = idx % 6;
  if (k == 5) return 0;                        // espacio entre letras
  byte col[5];
  obtenerLetra(texto[letra], col);
  return col[k];
}

// ---------- Desplaza el texto hacia la izquierda ----------
void scrollTexto(const char *texto, int velocidadMs) {
  int total = strlen(texto) * 6;
  for (int offset = -8; offset < total; offset++) {
    for (int x = 0; x < 8; x++) {
      byte b = columnaTexto(texto, offset + x);
      for (int y = 0; y < 8; y++) {
        punto(x, y, (b >> y) & 1);
      }
    }
    delay(velocidadMs);
  }
}

// ---------- Dibujo de figuras ----------
void dibujar(const char *figura) {
  for (int y = 0; y < 8; y++) {
    for (int x = 0; x < 8; x++) {
      punto(x, y, figura[y * 8 + x] == '1');
    }
  }
}

void setup() {
  lc.shutdown(0, false);
  lc.setIntensity(0, 8);
  lc.clearDisplay(0);

  scrollTexto("HOLA MUNDO", 100);      // se ejecuta una sola vez
}

void loop() {
  // 1. Nombres de los estudiantes
  scrollTexto("JUAN CARO", 100);
  scrollTexto("ANDRES SOLER", 100);

  // 2. Figuras divertidas
  dibujar("0011110001000010101010011000010110000101101010010100001000111100");  // carita
  delay(1500);
  dibujar("0110011010011001010000100010010000100100010000101001100101100110");  // carita guiño
  delay(1500);
  dibujar("1111111111111111110110001001100010011000110110001111111111111111");  // marco
  delay(1500);
  dibujar("0110011011111111111111111111111101111110001111000001100000000000");  // corazón
  delay(1500);
  dibujar("0001100000111100011111101101101111111111111001110111111001000010");  // extraterrestre
  delay(1500);
  dibujar("0001100000011000111111110111111000111100001111000110011001000010");  // estrella
  delay(1500);

  // 3. Nombre del colegio
  scrollTexto("I.E. TECNICA JOSE CAYETANO VASQUEZ", 100);

  // 4. Profesor
  scrollTexto("PROFESOR: MAICOL ALEXANDER CRUZ CRUZ", 100);
}`
  },

  {
    id: "medidor-agua",
    nombre: "Medidor de agua con Arduino",
    lema: "Cuánta agua queda, en cuatro colores",
    categoria: "Sensor de nivel",
    descripcion:
      "Un sensor de nivel de agua, metido en un vaso, mide cuánta agua hay y el Arduino la muestra con cuatro LED y un buzzer. A medida que el agua sube se van encendiendo en orden: verde (hay agua), azul (el nivel sube), amarillo (pasó de la mitad) y rojo (se va a llenar); con el rojo suena el buzzer para avisar. El programa convierte la lectura del sensor en un porcentaje con map() y lo muestra en el Monitor Serie.",
    integrantes: ["Rafael Armando Jiménez Arias", "Manolo Steven Boyacá Jiménez"],
    componentes: ["Arduino UNO y cable USB", "Sensor de nivel de agua (Water Sensor)", "4 LED (verde, azul, amarillo y rojo)", "Buzzer", "Protoboard", "Cables jumper", "Vaso con agua"],
    ext: "jpeg",
    portadaPos: "center bottom",
    diagramaTexto:
      "Tinkercad no tiene sensor de nivel de agua, así que en el diagrama se usó un sensor de humedad dentro del vaso; funciona igual. Su señal entra por el pin analógico A0 y su alimentación (VCC y GND) viene de la protoboard, que recibe los 5 V y el GND del Arduino. Los cuatro LED van a los pines 2 a 5. En el código final el verde quedó en el pin 5, el azul en el 4, el amarillo en el 3 y el rojo en el 2, y se agregó un buzzer en el pin 7, que no aparece en el diagrama.",
    evidencias: [
      { titulo: "Los materiales", texto: "Arduino UNO, protoboard, sensor de nivel de agua, cuatro LED (verde, azul, amarillo y rojo) y cables jumper." },
      { titulo: "Primeros cables", texto: "Se conectan los primeros cables en la protoboard." },
      { titulo: "Protoboard y Arduino", texto: "Se unen la protoboard y el Arduino UNO con cables de colores." },
      { titulo: "Revisando la protoboard", texto: "Un compañero acomoda un cable en la protoboard." },
      { titulo: "Trabajo en equipo", texto: "Los dos integrantes se turnan para hacer las conexiones." },
      { titulo: "Colocando los LED", texto: "Se ponen en la protoboard los LED verde, azul y amarillo, cerca del Arduino." },
      { titulo: "Conexiones al Arduino", texto: "Se revisan los cables que van de la protoboard a los pines del Arduino." },
      { titulo: "Cables al Arduino UNO", texto: "Se conectan los cables a los pines del Arduino UNO, al lado de la protoboard." },
      { titulo: "Conectando el sensor", texto: "Se conectan los cables al sensor de nivel de agua." },
      { titulo: "Sensor listo", texto: "El sensor de nivel de agua queda conectado a la protoboard con sus cables." }
    ],
    codigo: `// Medidor de agua con Arduino
// El sensor mide el nivel del agua; a medida que sube se van encendiendo los LED y, al final, suena el buzzer.

int sensor = A0;        // señal del sensor
int ledVerde = 5;       // LED verde: ya hay agua (nivel bajo)
int ledAzul = 4;        // LED azul: el nivel va subiendo
int ledAmarillo = 3;    // LED amarillo: el nivel ya pasó de la mitad
int ledRojo = 2;        // LED rojo: el agua se va a llenar
int buzzer = 7;         // buzzer: suena cuando el agua se va a llenar

int valorSeco = 0;      // lectura con el sensor seco (calibración)
int valorAgua = 666;     // lectura con el sensor totalmente sumergido (calibración)

int lectura;            // valor que entrega el sensor
int nivel;              // nivel de agua en porcentaje

void setup() {
  pinMode(ledVerde, OUTPUT);
  pinMode(ledAzul, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledRojo, OUTPUT);
  pinMode(buzzer, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  lectura = analogRead(sensor);              // lee el sensor (0 a 1023)

  // map convierte la lectura en un porcentaje de 0 a 100.
  // valorSeco = sensor seco (0 %), valorAgua = sensor sumergido (100 %)
  nivel = map(lectura, valorSeco, valorAgua, 0, 100);
  nivel = constrain(nivel, 0, 100);

  Serial.print("Lectura: ");
  Serial.print(lectura);
  Serial.print("  Nivel: ");
  Serial.print(nivel);
  Serial.println(" %");

  // Primero se apagan todos los LED
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledAzul, LOW);
  digitalWrite(ledAmarillo, LOW);
  digitalWrite(ledRojo, LOW);

  // Luego se van encendiendo a medida que el nivel sube (quedan prendidos los anteriores)
  if (nivel >= 10) {
    digitalWrite(ledVerde, HIGH);       // verde: hay agua
  }
  if (nivel >= 35) {
    digitalWrite(ledAzul, HIGH);        // azul: el nivel va subiendo
  }
  if (nivel >= 60) {
    digitalWrite(ledAmarillo, HIGH);    // amarillo: ya pasó de la mitad
  }
  if (nivel >= 85) {
    digitalWrite(ledRojo, HIGH);        // rojo: el agua se va a llenar
    tone(buzzer, 1000);                 // el buzzer suena mientras siga así
  } else {
    noTone(buzzer);                     // si el nivel baja, el buzzer se apaga
  }

  delay(500);   // espera medio segundo antes de volver a medir
}`
  },

  {
    id: "alarma-movimiento",
    nombre: "Alarma con detector de movimiento",
    lema: "Nadie pasa sin que ella se entere",
    categoria: "Sensor de movimiento",
    descripcion:
      "Un sensor de movimiento PIR vigila el espacio frente a él. Cuando alguien pasa, el Arduino enciende el LED y hace sonar la sirena, y en el Monitor Serie aparece el mensaje \"MOVIMIENTO DETECTADO\". Cuando ya no hay movimiento, la sirena y el LED se apagan.",
    integrantes: ["Miguel Ángel Guzmán Arias", "Danilson Daniel Cáceres Caro"],
    componentes: ["Arduino UNO y cable USB", "Sensor de movimiento PIR HC-SR501", "Sirena (buzzer)", "LED con resistencia", "Protoboard", "Cables jumper"],
    ext: "jpeg",
    video: "videos/alarma-movimiento.mp4",
    videoTexto: "Los estudiantes presentan su alarma: explican el circuito y pasan la mano frente al sensor para activarla.",
    diagramaTexto:
      "El sensor PIR se coloca en la protoboard y su salida va al pin 13 del Arduino (cable verde). La sirena se conecta al pin 12 y el LED, con su resistencia, al pin 11. Los cables rojo y negro llevan 5 V y GND desde el Arduino a las líneas de la protoboard, de donde se alimentan el sensor, el LED y la sirena.",
    evidencias: [
      { titulo: "Los materiales", texto: "Sirena, protoboard con un LED, sensor PIR con sus cables, Arduino UNO, resistencia y cable USB." },
      { titulo: "Probando el sensor", texto: "Un estudiante sostiene el sensor PIR conectado a la protoboard y al Arduino para probarlo." },
      { titulo: "¡Detecta movimiento!", texto: "Al mover la mano frente al sensor, el LED de la protoboard se enciende." },
      { titulo: "Código y Monitor Serie", texto: "El código en el IDE de Arduino y el Monitor Serie mostrando \"MOVIMIENTO DETECTADO\" cada vez que el sensor ve movimiento." }
    ],
    codigo: `// Proyecto -> Alarma con detector de movimiento

// -------------------------
// PINES
// -------------------------
int sensorPIR = 13;       // salida del sensor de movimiento PIR
int buzzer = 12;          // sirena
int led = 11;             // LED de aviso

int movimiento = 0;       // guarda lo que lee el sensor: HIGH = hay movimiento, LOW = no hay


// =========================
// CONFIGURACIÓN INICIAL
// =========================
void setup() {

  pinMode(sensorPIR, INPUT);    // el sensor envía datos al Arduino
  pinMode(buzzer, OUTPUT);      // la sirena recibe órdenes del Arduino
  pinMode(led, OUTPUT);         // el LED también
  Serial.begin(9600);           // abre el Monitor Serie
}


// =========================
// PROGRAMA PRINCIPAL
// =========================
void loop() {

  movimiento = digitalRead(sensorPIR);   // lee el sensor

  if (movimiento == HIGH) {              // alguien se movió frente al sensor
    digitalWrite(led, HIGH);             // se enciende el LED
    digitalWrite(buzzer, HIGH);          // suena la sirena
    Serial.println("MOVIMIENTO DETECTADO");
  }
  else {                                 // no hay movimiento
    digitalWrite(led, LOW);              // se apaga el LED
    digitalWrite(buzzer, LOW);           // se apaga la sirena
  }

  delay(200);                            // pequeña pausa antes de volver a leer
}`
  },

  {
    id: "matriz-joystick",
    nombre: "Matriz joystick",
    lema: "La culebrita en una matriz de LED",
    categoria: "Entrada analógica",
    descripcion:
      "El juego de la culebrita en una matriz de LED 8x8. Con el joystick se cambia la dirección de la culebra; cada vez que se come el punto que parpadea, crece un LED y va más rápido. Si choca con la pared o consigo misma, la pantalla parpadea y muestra el puntaje con un LED por cada comida; para volver a jugar se presiona el joystick. El reto fue traducir los valores analógicos del joystick a cuatro direcciones.",
    integrantes: ["Alisson Sarith Cuervo Pulido", "Neymis Taliana Cañas Chaverra"],
    componentes: ["Arduino UNO", "Matriz LED 8x8 con MAX7219", "Módulo joystick", "Protoboard y jumpers"],
    ext: "jpeg",
    diagramaTexto:
      "El módulo joystick recibe +5 V y GND y entrega sus ejes (VRx y VRy) y el pulsador SW; en el diagrama la salida VRy se rotula A1. La matriz LED 8x8 con MAX7219 usa cinco cables: VCC, GND, DIN, CS y CLK, que llegan a la hilera de pines digitales del Arduino. La protoboard distribuye la alimentación. En el código final la matriz usa DIN en el 12, CLK en el 11 y CS en el 10, y el joystick se alimenta con 3.3 V: VRx en A0, VRy en A1 y SW en el pin 2.",
    evidencias: [
      { titulo: "Componentes", texto: "Cables, matriz LED 8x8, módulo joystick, Arduino UNO y cable USB sobre la mesa." },
      { titulo: "Preparando la matriz", texto: "Se sostiene la matriz LED 8x8 para empezar a conectarla." },
      { titulo: "Conectando el Arduino", texto: "Se conecta el cable USB al Arduino UNO." },
      { titulo: "Cables en el Arduino", texto: "Cables de colores conectados a los pines del Arduino UNO." },
      { titulo: "Conectando los cables", texto: "Una estudiante organiza y conecta los cables junto al computador." },
      { titulo: "Trabajando en el computador", texto: "Una estudiante trabaja en el computador durante el montaje." },
      { titulo: "Circuito armado", texto: "Una estudiante revisa el circuito armado: Arduino, matriz LED y cables conectados." }
    ],
    codigo: `// Proyecto -> Juego de la culebrita (matriz LED 8x8 + joystick)
#include "LedControl.h"           // librería para manejar la matriz con el MAX7219

LedControl lc = LedControl(12, 11, 10, 1);   // DIN en el 12, CLK en el 11, CS en el 10, una sola matriz

// -------------------------
// PINES DEL JOYSTICK
// -------------------------
const int SW_pin = 2;             // botón del joystick (se presiona hacia abajo)
const int xpin = A0;              // eje horizontal (VRx)
const int ypin = A1;              // eje vertical (VRy)

// El joystick va a 3.3 V, por eso sus valores llegan más o menos hasta 660
const int BAJO = 150;             // menos de esto: palanca a la izquierda o arriba
const int ALTO = 520;             // más de esto: palanca a la derecha o abajo

// -------------------------
// VARIABLES DEL JUEGO
// -------------------------
int cuerpoX[64], cuerpoY[64];     // posición de cada parte de la culebra (máximo 64 LED)
int largo;                        // cuántos LED mide la culebra
int dirX, dirY;                   // dirección en la que va
int sigX, sigY;                   // dirección que pidió el jugador con el joystick
int comidaX, comidaY;             // dónde está la comida
int puntos;                       // comidas que lleva
int velocidad;                    // milisegundos entre pasos (menos = más rápido)

unsigned long ultimoMovimiento = 0;   // momento del último paso de la culebra
unsigned long ultimoParpadeo = 0;     // momento del último parpadeo de la comida
bool comidaVisible = true;            // la comida se prende y se apaga


// =========================
// CONFIGURACIÓN INICIAL
// =========================
void setup() {
  Serial.begin(9600);                 // abre el Monitor Serie para ver los puntos
  pinMode(SW_pin, INPUT_PULLUP);      // botón con resistencia interna: suelto = HIGH, presionado = LOW

  lc.shutdown(0, false);              // despierta la matriz
  lc.setIntensity(0, 8);              // brillo medio (0 a 15)
  lc.clearDisplay(0);                 // apaga todos los LED

  randomSeed(analogRead(A5));         // así la comida no sale siempre en el mismo orden
  nuevoJuego();
}


// =========================
// PROGRAMA PRINCIPAL
// =========================
void loop() {
  leerJoystick();                     // revisa hacia dónde mueve el jugador la palanca
  unsigned long ahora = millis();     // tiempo desde que se prendió el Arduino

  // La comida parpadea cada 200 ms
  if (ahora - ultimoParpadeo > 200) {
    comidaVisible = !comidaVisible;   // si estaba prendida se apaga, y al revés
    ultimoParpadeo = ahora;
    dibujar();
  }

  // La culebra avanza un paso cuando pasa el tiempo de "velocidad"
  if (ahora - ultimoMovimiento > (unsigned long)velocidad) {
    ultimoMovimiento = ahora;
    mover();
  }
}


// =========================
// EMPEZAR UN JUEGO NUEVO
// =========================
void nuevoJuego() {
  largo = 1;                // la culebra empieza siendo un solo punto
  cuerpoX[0] = 3;           // en la columna 3
  cuerpoY[0] = 4;           // y la fila 4
  dirX = 1; dirY = 0;       // arranca hacia la derecha
  sigX = 1; sigY = 0;
  puntos = 0;
  velocidad = 450;          // un paso cada 450 ms al comienzo
  ponerComida();
  dibujar();
  ultimoMovimiento = millis();
  Serial.println("¡Nuevo juego!");
}


// =========================
// LEER EL JOYSTICK
// =========================
void leerJoystick() {
  int lx = analogRead(xpin);          // valor del eje X
  int ly = analogRead(ypin);          // valor del eje Y

  // Si mide 1 puede devolverse; si es más larga, no puede ir en reversa
  bool puedeVolver = (largo == 1);

  if (lx > ALTO && (dirX != -1 || puedeVolver))      { sigX = 1;  sigY = 0; }   // derecha
  else if (lx < BAJO && (dirX != 1 || puedeVolver))  { sigX = -1; sigY = 0; }   // izquierda
  else if (ly > ALTO && (dirY != -1 || puedeVolver)) { sigX = 0;  sigY = 1; }   // abajo
  else if (ly < BAJO && (dirY != 1 || puedeVolver))  { sigX = 0;  sigY = -1; }  // arriba
}


// =========================
// MOVER LA CULEBRA
// =========================
void mover() {
  dirX = sigX;                        // toma la dirección que pidió el jugador
  dirY = sigY;

  int nx = cuerpoX[0] + dirX;         // nueva posición de la cabeza
  int ny = cuerpoY[0] + dirY;

  // Choque con la pared: se sale de la matriz (0 a 7)
  if (nx < 0 || nx > 7 || ny < 0 || ny > 7) {
    finJuego();
    return;
  }

  bool come = (nx == comidaX && ny == comidaY);   // ¿la cabeza llega a la comida?

  // Choque consigo misma: se revisa el cuerpo
  // (si no come, la cola se mueve, así que la última parte no cuenta)
  int revisar = largo - 1;
  if (come) {
    revisar = largo;
  }
  for (int i = 0; i < revisar; i++) {
    if (cuerpoX[i] == nx && cuerpoY[i] == ny) {
      finJuego();
      return;
    }
  }

  if (come) largo++;                  // crece un punto

  // El cuerpo sigue a la cabeza: cada parte toma el lugar de la anterior
  for (int i = largo - 1; i > 0; i--) {
    cuerpoX[i] = cuerpoX[i - 1];
    cuerpoY[i] = cuerpoY[i - 1];
  }
  cuerpoX[0] = nx;                    // la cabeza pasa a la nueva posición
  cuerpoY[0] = ny;

  if (come) {
    puntos++;
    Serial.print("¡Comida! Puntos: ");
    Serial.print(puntos);
    Serial.print("   Largo: ");
    Serial.println(largo);

    if (largo == 64) {                // llenó los 64 LED de la matriz
      Serial.println("¡GANASTE! Llenaste toda la pantalla");
      finJuego();
      return;
    }
    ponerComida();
    if (velocidad > 150) velocidad -= 20;   // cada comida la hace 20 ms más rápida
  }

  dibujar();
}


// =========================
// ¿ESE LUGAR ES PARTE DE LA CULEBRA?
// =========================
bool estaEnCulebra(int x, int y) {
  for (int i = 0; i < largo; i++) {
    if (cuerpoX[i] == x && cuerpoY[i] == y) return true;
  }
  return false;
}


// =========================
// PONER LA COMIDA
// =========================
void ponerComida() {
  do {
    comidaX = random(8);              // columna al azar de 0 a 7
    comidaY = random(8);              // fila al azar de 0 a 7
  } while (estaEnCulebra(comidaX, comidaY));   // repite si cayó encima de la culebra
}


// =========================
// DIBUJAR EN LA MATRIZ
// =========================
void dibujar() {
  byte filasLed[8] = {0, 0, 0, 0, 0, 0, 0, 0};   // cada fila es un byte: 8 bits = 8 LED

  // Prende el bit de cada parte de la culebra en su fila
  for (int i = 0; i < largo; i++) {
    filasLed[cuerpoY[i]] |= (B10000000 >> cuerpoX[i]);
  }
  // Prende la comida solo cuando le toca estar visible
  if (comidaVisible) {
    filasLed[comidaY] |= (B10000000 >> comidaX);
  }
  // Envía las 8 filas a la matriz
  for (int f = 0; f < 8; f++) {
    lc.setRow(0, f, filasLed[f]);
  }
}


// =========================
// FIN DEL JUEGO
// =========================
void finJuego() {
  Serial.print("Fin del juego. Puntos: ");
  Serial.println(puntos);

  // Parpadea toda la pantalla 3 veces
  for (int r = 0; r < 3; r++) {
    for (int f = 0; f < 8; f++) lc.setRow(0, f, B11111111);   // todos prendidos
    delay(250);
    lc.clearDisplay(0);                                       // todos apagados
    delay(250);
  }

  // Muestra el puntaje: un LED prendido por cada comida
  for (int i = 0; i < puntos && i < 64; i++) {
    lc.setLed(0, i / 8, i % 8, true);   // fila = i / 8, columna = resto de i / 8
  }

  Serial.println("Presiona el joystick para jugar otra vez");
  while (digitalRead(SW_pin) == HIGH) { }   // espera a que presionen el botón
  delay(300);
  while (digitalRead(SW_pin) == LOW) { }    // espera a que lo suelten

  lc.clearDisplay(0);
  nuevoJuego();
}`
  },

  {
    id: "sonar",
    nombre: "Sonar con Arduino y sensor ultrasónico",
    lema: "Ver con sonido lo que el ojo no alcanza",
    categoria: "Sensor ultrasónico",
    descripcion:
      "Un sensor ultrasónico HC-SR04 montado sobre un servomotor barre un arco de 20° a 160° y mide la distancia en cada posición. Cuando detecta un objeto a menos de 40 cm, parpadea un LED rojo y suena un zumbador. El ángulo y la distancia se muestran en el Monitor Serie del computador.",
    integrantes: ["Ángela Lizeth Soler Fonseca", "Diana Alejandra Galindo Caro"],
    componentes: ["1 Arduino UNO", "1 Sensor ultrasónico HC-SR04", "1 Servomotor SG90", "1 LED rojo", "1 Resistencia de 220 Ω", "1 Zumbador", "Cables jumper macho-macho", "Cables jumper macho-hembra", "Silicona", "1 Base de cartón, madera o similar"],
    diagramaTexto:
      "El sensor HC-SR04 usa el pin 4 para TRIG y el pin 2 para ECHO, y se alimenta con 5 V y GND. El servomotor recibe su señal por el pin 11. El LED rojo va al pin 7 y el zumbador al pin 8; ambos regresan a GND por la protoboard.",
    evidencias: [
      { titulo: "Sensor sobre el servo", texto: "Se pega el sensor ultrasónico sobre el servomotor para que pueda girar." },
      { titulo: "Barrido del sensor", texto: "El servo avanza de 2 en 2 grados entre 20° y 160° y el sensor mide la distancia en cada posición." },
      { titulo: "Alerta por objeto", texto: "Si hay un objeto a menos de 40 cm, parpadea el LED rojo y suena el zumbador; los datos salen en el Monitor Serie." }
    ],
    codigo: `#include <Servo.h>


Servo servoSonar;


// -------------------------
// PINES
// -------------------------
const int TRIG = 4;
const int ECHO = 2;
const int SERVO = 11;
const int LED_ROJO = 7;
const int ZUMBADOR = 8;


// -------------------------
// CONFIGURACIÓN DEL SERVO
// -------------------------
int anguloMinimo = 20;
int anguloCentro = 90;
int anguloMaximo = 160;


// Velocidad del barrido
int pasoServo = 2;
int tiempoServo = 40;


// -------------------------
// CONFIGURACIÓN DEL SONAR
// -------------------------
const int DISTANCIA_ALERTA = 40;


long duracion;
float distancia;




// =========================
// CONFIGURACIÓN INICIAL
// =========================
void setup() {


  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);


  pinMode(LED_ROJO, OUTPUT);
  pinMode(ZUMBADOR, OUTPUT);


  servoSonar.attach(SERVO);


  // Colocar el servo en el centro
  servoSonar.write(anguloCentro);
  delay(2000);


  Serial.begin(9600);
}




// =========================
// PROGRAMA PRINCIPAL
// =========================
void loop() {


  // -------------------------
  // Barrido de izquierda a derecha
  // -------------------------
  for (int angulo = anguloMinimo;
       angulo <= anguloMaximo;
       angulo += pasoServo) {


    servoSonar.write(angulo);


    delay(tiempoServo);


    distancia = medirDistancia();


    mostrarDatos(angulo);


    verificarObjeto();
  }




  // -------------------------
  // Barrido de derecha a izquierda
  // -------------------------
  for (int angulo = anguloMaximo;
       angulo >= anguloMinimo;
       angulo -= pasoServo) {


    servoSonar.write(angulo);


    delay(tiempoServo);


    distancia = medirDistancia();


    mostrarDatos(angulo);


    verificarObjeto();
  }
}




// =========================
// MEDIR DISTANCIA
// =========================
float medirDistancia() {


  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);


  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);


  digitalWrite(TRIG, LOW);


  duracion = pulseIn(ECHO, HIGH, 30000);


  // Si no recibe eco
  if (duracion == 0) {
    return 999;
  }


  float distanciaCalculada;


  distanciaCalculada = duracion * 0.0343 / 2;


  return distanciaCalculada;
}




// =========================
// DETECCIÓN DE OBJETOS
// =========================
void verificarObjeto() {


  if (distancia <= DISTANCIA_ALERTA) {


    digitalWrite(LED_ROJO, HIGH);


    tone(ZUMBADOR, 1000);


    delay(80);


    digitalWrite(LED_ROJO, LOW);


    noTone(ZUMBADOR);


    delay(80);
  }


  else {


    digitalWrite(LED_ROJO, LOW);


    noTone(ZUMBADOR);
  }
}




// =========================
// MONITOR SERIAL
// =========================
void mostrarDatos(int angulo) {


  Serial.print("Angulo: ");
  Serial.print(angulo);


  Serial.print(" grados | Distancia: ");
  Serial.print(distancia);


  Serial.println(" cm");
}`
  },

  {
    id: "ruleta",
    nombre: "Ruleta",
    lema: "El azar también se programa",
    categoria: "Aleatoriedad",
    descripcion:
      "Una ruleta movida por un motor paso a paso 28BYJ-48 con driver ULN2003. El programa usa random() para elegir cuántos pasos gira el motor, entre una y dos vueltas completas (2048 pasos es una vuelta), así que se detiene en un lugar distinto cada vez. Después de cinco segundos vuelve a girar.",
    integrantes: ["Carlos Adrián Silva Plazas", "David Fernando Plazas Fuentes"],
    componentes: ["Arduino UNO", "Motor paso a paso 28BYJ-48", "Driver ULN2003", "Ruleta de colores numerada", "Cables jumper", "Base de la ruleta"],
    ext: "jpeg",
    diagramaTexto:
      "Este montaje mueve un motor paso a paso 28BYJ-48 con un driver ULN2003. Los cuatro pines de control del driver (IN1 a IN4) se conectan a los pines digitales 11, 10, 9 y 8 del Arduino, y el driver toma 5 V y GND directamente de la placa.",
    evidencias: [
      { titulo: "Cables jumper", texto: "Cables de colores sobre la mesa, listos para el montaje." },
      { titulo: "Componentes", texto: "La ruleta de colores, el motor paso a paso, el driver, el Arduino UNO, el cable USB y los cables jumper sobre la mesa." },
      { titulo: "Conectando al Arduino", texto: "Un estudiante conecta los cables al Arduino, con la ruleta y el computador sobre la mesa." },
      { titulo: "Siguiendo las conexiones", texto: "Vista desde arriba: se continúan las conexiones entre el Arduino, el driver y el motor de la ruleta." },
      { titulo: "Conectando el driver", texto: "Un estudiante conecta los cables al driver del motor." },
      { titulo: "Cables y computador", texto: "Un estudiante conecta cables con el computador al lado y la ruleta en una esquina." },
      { titulo: "Armando entre compañeros", texto: "Un estudiante conecta cables mientras sus compañeros trabajan atrás." },
      { titulo: "Ajustando conexiones", texto: "Un estudiante ajusta las conexiones con la ruleta y el driver sobre la mesa." },
      { titulo: "Revisando la ruleta", texto: "Un estudiante revisa las conexiones de la ruleta." }
    ],
    codigo: `#include <Stepper.h>                  // librería para controlar motores paso a paso

Stepper motor1(2048, 8, 10, 9, 11);   // motor de 2048 pasos por vuelta, conectado a los pines 8, 10, 9 y 11

void setup() {
  motor1.setSpeed(15);                // velocidad del motor: 15 vueltas por minuto
}

void loop() {
  int x;                              // variable que guarda cuántos pasos va a girar
  x=random(2048,2048*2);              // número al azar entre 2048 y 4095 (de una a dos vueltas)
  motor1.step(x);                     // gira el motor esa cantidad de pasos
  delay(5000);                        // espera 5 segundos antes de volver a girar
}`
  },

  {
    id: "brazo-robotico",
    nombre: "Brazo robótico",
    lema: "Una mano mecánica que sigue tus giros",
    categoria: "Servomotores",
    descripcion:
      "Un brazo robótico hecho con palos de helado, tres servomotores (base, articulación y pinza) y un motor paso a paso que lo gira. El programa repite una secuencia: agarra un objeto con la pinza, gira 512 pasos (un cuarto de vuelta) con el motor paso a paso, lo deja en otro lugar y vuelve a su posición inicial.",
    integrantes: ["Sara Eliana Plazas Sanabria", "Laura Fernanda Sanabria Arias"],
    componentes: ["Placa de Arduino UNO: Es el cerebro de nuestro proyecto, encargada de controlar todos los procesos del mismo mediante el código que encontrarás más adelante.", "Motor paso a paso: Mediante impulsos eléctricos, es posible controlar el giro del motor, el cual se efectúa de una forma discreta.", "Servomotores: motores de 5v con una reductora, lo que permite un gran manejo de su posición y una gran fuerza para su reducido tamaño.", "Protoboard: Tabla con orificios (pines) la cual está conectada internamente y usaremos para realizar nuestras conexiones para el proyecto.", "Palos de helado: Usaremos estos palos como estructura para dar forma a nuestra grúa."],
    ext: "jpeg",
    diagramaTexto:
      "Tres servomotores (inferior, superior y pinza) reciben su señal por los pines 9, 10 y 11, y se alimentan desde los rieles de la protoboard. Un motor paso a paso con driver ULN2003 se controla con los pines 7, 6, 5 y 4. La protoboard recibe 5 V y GND del Arduino y lleva además un módulo de alimentación.",
    evidencias: [
      { titulo: "Materiales sobre la mesa", texto: "Servomotores, motor paso a paso con su driver, Arduino UNO, protoboard, cables jumper, cable USB y palos de helado." },
      { titulo: "Conectando en la protoboard", texto: "Una estudiante conecta cables en la protoboard junto al Arduino y el driver." },
      { titulo: "Probando un servomotor", texto: "Una estudiante prueba un servomotor con la estructura de palos de helado, con el programa abierto en el computador." },
      { titulo: "Estructura de palos de helado", texto: "La base de palos de helado con el motor paso a paso y el brazo con sus servomotores." },
      { titulo: "Trabajo junto al brazo", texto: "Estudiantes conectan los cables en la protoboard con el brazo y el computador a un lado." },
      { titulo: "Conectando el driver", texto: "Una estudiante conecta los cables del driver del motor paso a paso, con el brazo detrás." },
      { titulo: "Cables del Arduino", texto: "Una estudiante conecta los cables entre el Arduino y el driver del motor." },
      { titulo: "Circuito y brazo", texto: "Una estudiante conecta cables en la protoboard; se ven el Arduino, el driver y el brazo." },
      { titulo: "Revisando las conexiones", texto: "Dos estudiantes revisan los cables entre el brazo, la protoboard y el Arduino." }
    ],
    codigo: `//Proyecto -> Brazo robotico version1
#include <Servo.h>                  // Librería para controlar los servomotores
#include <Stepper.h>                // Librería para controlar el motor paso a paso
Servo servomotor3; //Servomotor pinza
Servo servomotor2; //Servomotor enmedio
Servo servomotor1; //Servomotor abajo
Stepper motor(2048, 4, 6, 5, 7);    // Motor de 2048 pasos por vuelta, conectado a los pines 4, 6, 5 y 7
void setup() {
  servomotor3.attach(11);           // La pinza se conecta al pin 11
  servomotor2.attach(10);           // El servo del medio se conecta al pin 10
  servomotor1.attach(9);            // El servo de abajo se conecta al pin 9
  motor.setSpeed(5);                // Velocidad del motor paso a paso: 5 vueltas por minuto
}
void loop() {
  //Reinicio
  servomotor1.write(0);             // Los tres servos van a la posición 0° (posición inicial)
  servomotor2.write(0);
  servomotor3.write(0);
  //motor.step(512);
  delay(3000);                      // Espera 3 segundos antes de empezar
  //COJE EL OBJETO
  for(int i=0; i<=45; i++){         // La pinza se mueve de 0° a 45° poco a poco (se abre)
    servomotor3.write(i);
    delay(25);                      // Pausa de 25 ms en cada grado para que el movimiento sea suave
  }
  delay(1000);                      // Espera 1 segundo
  for(int i=0; i<=90; i++){         // El servo del medio sube de 0° a 90°
    servomotor2.write(i);
    delay(25);
  }
  delay(1000);
  for (int i=0; i<=90; i++){        // El servo de abajo sube de 0° a 90°: el brazo baja hasta el objeto
    servomotor1.write(i);
    delay(25);
  }
  delay(1000);
  for(int i=45; i>=0; i--){         // La pinza vuelve de 45° a 0°: se cierra y agarra el objeto
    servomotor3.write(i);
    delay(25);
  }
  delay(1000);
   for (int i = 90; i>=0; i--){     // El servo de abajo regresa de 90° a 0°: el brazo se levanta con el objeto
    servomotor1.write(i);
    delay(25);
  }
  delay(1000);
  for (int i = 90; i>=0; i--){      // El servo del medio regresa de 90° a 0°
    servomotor2.write(i);
    delay(25);
  }
  delay(1000);
  //GIRA CON EL OBJETO
  motor.step(512);                  // El motor paso a paso gira 512 pasos (un cuarto de vuelta) con el objeto
  delay(1000);
  //DEJA EL OBJETO
  for(int i=0; i<=90; i++){         // El servo del medio vuelve a subir de 0° a 90°
    servomotor2.write(i);
    delay(25);
  }
  delay(1000);
  for (int i=0; i<=90; i++){        // El servo de abajo baja el brazo de 0° a 90°
    servomotor1.write(i);
    delay(25);
  }
  delay(1000);
  for(int i=0; i<=45; i++){         // La pinza se abre de 0° a 45° y suelta el objeto
    servomotor3.write(i);
    delay(25);
  }
  delay(1000);
  //VUELVE A LA POSICION INICIAL
  servomotor1.write(0);             // Los servos de abajo y del medio regresan a 0°
  servomotor2.write(0);
  motor.step(-512);                 // El motor paso a paso gira 512 pasos hacia atrás y vuelve a su lugar
  delay(3000);                      // Espera 3 segundos y el ciclo vuelve a empezar
}`
  }
];

/* ============================================================
   GALERÍA DEL PROCESO
   ------------------------------------------------------------
   Cuatro fotos por etapa. Guárdalas en img/galeria/ con estos nombres
   (sirve .jpg, .jpeg, .png o .webp):

     diagnostico-1 ... diagnostico-4   prueba diagnóstica
     tinkercad-1   ... tinkercad-4     simulaciones en Tinkercad
     arduino-1     ... arduino-4       montaje con Arduino
     prototipos-1  ... prototipos-4    prototipos terminados

   El texto "alt" es la descripción que aparece al ampliar la foto:
   cámbialo por lo que realmente se ve. "alto" (alta o corta) solo
   cambia la forma del recuadro en el mosaico.
   ============================================================ */

const GALERIA = [
  { foto: "diagnostico-1", alt: "Prueba diagnóstica · foto 1", categoria: "diagnostico", alto: "alta" },
  { foto: "diagnostico-2", alt: "Prueba diagnóstica · foto 2", categoria: "diagnostico", alto: "corta" },
  { foto: "diagnostico-3", alt: "Prueba diagnóstica · foto 3", categoria: "diagnostico", alto: "corta" },
  { foto: "diagnostico-4", alt: "Prueba diagnóstica · foto 4", categoria: "diagnostico", alto: "alta" },
  { foto: "tinkercad-1", alt: "Simulación en Tinkercad · foto 1", categoria: "tinkercad", alto: "alta" },
  { foto: "tinkercad-2", alt: "Simulación en Tinkercad · foto 2", categoria: "tinkercad", alto: "corta" },
  { foto: "tinkercad-3", alt: "Simulación en Tinkercad · foto 3", categoria: "tinkercad", alto: "corta" },
  { foto: "tinkercad-4", alt: "Simulación en Tinkercad · foto 4", categoria: "tinkercad", alto: "alta" },
  { foto: "arduino-1", alt: "Montaje con Arduino · foto 1", categoria: "arduino", alto: "alta" },
  { foto: "arduino-2", alt: "Montaje con Arduino · foto 2", categoria: "arduino", alto: "corta" },
  { foto: "arduino-3", alt: "Montaje con Arduino · foto 3", categoria: "arduino", alto: "corta" },
  { foto: "arduino-4", alt: "Montaje con Arduino · foto 4", categoria: "arduino", alto: "alta" },
  { foto: "prototipos-1", alt: "Prototipos terminados · foto 1", categoria: "prototipos", alto: "alta" },
  { foto: "prototipos-2", alt: "Prototipos terminados · foto 2", categoria: "prototipos", alto: "corta" },
  { foto: "prototipos-3", alt: "Prototipos terminados · foto 3", categoria: "prototipos", alto: "corta" },
  { foto: "prototipos-4", alt: "Prototipos terminados · foto 4", categoria: "prototipos", alto: "alta" }
];
