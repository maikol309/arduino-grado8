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
    id: "medidor-humedad",
    nombre: "Medidor de humedad",
    lema: "La matera avisa cuando tiene sed",
    categoria: "Sensor de suelo",
    descripcion:
      "Un sensor capacitivo enterrado en la matera mide la humedad del suelo y la muestra en porcentaje en una pantalla LCD. Un semáforo de LED y un buzzer indican si el suelo está seco, en estado óptimo o húmedo. Con los valores de lectura en seco y en agua, el programa convierte la señal del sensor en un porcentaje.",
    integrantes: ["Laura Fernanda Vargas Arias", "Sara Valentina Barreto Galindo"],
    componentes: ["Arduino UNO", "Sensor de humedad de suelo capacitivo", "Pantalla LCD 16x2 con módulo I2C", "3 LED (verde, amarillo y rojo)", "Buzzer", "Protoboard", "Matera de prueba"],
    diagramaTexto:
      "Tres LED van a los pines digitales 12 (rojo), 10 (amarillo) y 9 (verde) y comparten una resistencia en la protoboard. El sensor de humedad de suelo se conecta con su VCC al pin A0, su señal (SIG) al pin A1 y su GND al GND del Arduino.",
    evidencias: [
      { titulo: "Calibración", texto: "Medimos el sensor en tierra seca y en tierra mojada para encontrar los valores de referencia." },
      { titulo: "Semáforo de humedad", texto: "Los LED indican si la matera está seca, con buena humedad o demasiado húmeda." },
      { titulo: "Prueba en la matera", texto: "Enterramos el sensor y comprobamos que el buzzer avisa cuando hace falta regar." }
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
      "Un sensor mide el nivel del agua de un vaso y avisa con luces y sonido: el LED verde indica nivel normal (hasta la mitad del sensor), el amarillo se enciende al pasar de la mitad, y cuando el agua está por llenarse se enciende el LED rojo y suena un buzzer. El programa convierte la lectura del sensor en un porcentaje con map().",
    integrantes: ["Rafael Armando Jiménez Arias", "Manolo Steven Boyacá Jiménez"],
    componentes: ["Arduino UNO", "Sensor de humedad usado como sensor de nivel", "LED rojo, amarillo y verde", "Buzzer", "Protoboard", "Vaso con agua"],
    diagramaTexto:
      "Un sensor de humedad funciona aquí como sensor de nivel dentro de un vaso con agua: su señal entra por el pin analógico A0 y su alimentación (VCC y GND) viene de la protoboard, que recibe los 5 V y el GND del Arduino. Los LED están en los pines 2 (rojo), 3 (amarillo) y 4 (verde). En el montaje se agregó un buzzer en el pin 7, que todavía no aparece en el diagrama.",
    evidencias: [
      { titulo: "Montaje del sensor", texto: "Fijamos el sensor dentro del vaso y conectamos los LED y el buzzer a la protoboard." },
      { titulo: "Llenando el recipiente", texto: "Fuimos agregando agua poco a poco para ver cómo cambia la lectura en el Monitor Serie." },
      { titulo: "Luces y buzzer según el nivel", texto: "Con nivel normal se enciende el verde; al pasar de la mitad, el amarillo; y cuando está por llenarse, el rojo y suena el buzzer." }
    ],
    codigo: `// Medidor de agua con Arduino
// El sensor mide el nivel del agua; los LED y el buzzer avisan en qué estado está.

int sensor = A0;        // señal del sensor
int ledRojo = 2;        // LED rojo: el agua está por llenarse
int ledAmarillo = 3;    // LED amarillo: el nivel ya pasó de la mitad
int ledVerde = 4;       // LED verde: nivel normal (hasta la mitad del sensor)
int buzzer = 7;         // buzzer: suena cuando el agua se va a llenar

int lectura;            // valor que entrega el sensor
int nivel;              // nivel de agua en porcentaje

void setup() {
  pinMode(ledRojo, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledVerde, OUTPUT);
  pinMode(buzzer, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  lectura = analogRead(sensor);              // lee el sensor (0 a 1023)

  // map convierte la lectura en un porcentaje de 0 a 100.
  // 0 = sensor seco, 876 = sensor sumergido (ajusta estos valores al calibrar)
  nivel = map(lectura, 0, 876, 0, 100);
  nivel = constrain(nivel, 0, 100);

  Serial.print("Lectura: ");
  Serial.print(lectura);
  Serial.print("  Nivel: ");
  Serial.print(nivel);
  Serial.println(" %");

  // Primero se apagan todos los LED
  digitalWrite(ledRojo, LOW);
  digitalWrite(ledAmarillo, LOW);
  digitalWrite(ledVerde, LOW);

  // Luego se enciende lo que corresponde al nivel del agua
  if (nivel >= 10) {
    digitalWrite(ledVerde, HIGH);       // verde: hay agua y el nivel es normal
  }
  if (nivel > 50) {
    digitalWrite(ledAmarillo, HIGH);    // amarillo: ya pasó de la mitad del sensor
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
int LED = 13;
int BUZZER = 8;

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
    ext: "jpeg",
    diagramaTexto:
      "El módulo joystick recibe +5 V y GND y entrega sus ejes (VRx y VRy) y el pulsador SW; en el diagrama la salida VRy se rotula A1. La matriz LED 8x8 con MAX7219 usa cinco cables: VCC, GND, DIN, CS y CLK, que llegan a la hilera de pines digitales del Arduino. La protoboard distribuye la alimentación.",
    evidencias: [
      { titulo: "Componentes", texto: "Cables, matriz LED 8x8, módulo joystick, Arduino UNO y cable USB sobre la mesa." },
      { titulo: "Preparando la matriz", texto: "Se sostiene la matriz LED 8x8 para empezar a conectarla." },
      { titulo: "Conectando el Arduino", texto: "Se conecta el cable USB al Arduino UNO." },
      { titulo: "Cables en el Arduino", texto: "Cables de colores conectados a los pines del Arduino UNO." },
      { titulo: "Conectando los cables", texto: "Una estudiante organiza y conecta los cables junto al computador." },
      { titulo: "Trabajando en el computador", texto: "Una estudiante trabaja en el computador durante el montaje." },
      { titulo: "Circuito armado", texto: "Una estudiante revisa el circuito armado: Arduino, matriz LED y cables conectados." }
    ],
    codigo: `#include <LedControl.h>

// DIN = 11, CLK = 13, CS = 10, una sola matriz
LedControl matriz = LedControl(11, 13, 10, 1);

int PIN_X = A0;   // eje horizontal del joystick
int PIN_Y = A1;   // eje vertical del joystick

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

int TRIG = 9;
int ECHO = 8;
int LED_ROJO = 4;
int LED_VERDE = 5;
int DISTANCIA_CARRO = 10;   // centimetros

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

int POT_BASE = A0;
int POT_HOMBRO = A1;
int POT_CODO = A2;

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
