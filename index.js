// IP do notebook onde o Mosquitto está rodando
const MQTT_HOST = "192.168.3.73"; 

// Porta do MOsquitto
const MQTT_PORT = 9001;

// Tópicos publicados pelo ESP32
const TOPIC_TEMP = "aulas/professortupi/temperatura";
const TOPIC_HUM  = "aulas/professortupi/umidade";
const TOPIC_AIR  = "aulas/professortupi/qualidade_ar";
const DEVICE_TIMEOUT_MS = 10000;

// ID de cliente único para o navegador
const clientID = "WebDash_" + Math.random().toString(16).substr(2, 8);
let lastDeviceMessageAt = 0;
let deviceStatusInterval;
let brokerConnected = false;
let deviceConnected = false;

// Inicializa o cliente MQTT Paho
const client = new Paho.MQTT.Client(MQTT_HOST, Number(MQTT_PORT), clientID);

// Callback de quando a conexão é perdida
client.onConnectionLost = onConnectionLost;

// Callback de quando uma mensagem MQTT chega
client.onMessageArrived = onMessageArrived;

// Tenta conectar ao broker (Mosquitto)
client.connect({
    onSuccess: onConnect,
    onFailure: onFailure
});

// Conectado
function onConnect() {
    brokerConnected = true;
    deviceConnected = false;
    lastDeviceMessageAt = 0;
    clearInterval(deviceStatusInterval);
    deviceStatusInterval = setInterval(checkDeviceStatus, 1000);
    updateStatus("Status: Protótipo desconectado", "disconnected");

    // Assina os tópicos publicados pelo ESP32 após conectar com sucesso 
    client.subscribe(TOPIC_TEMP);
    client.subscribe(TOPIC_HUM);
    client.subscribe(TOPIC_AIR);
}

function onFailure(responseObject) {
    brokerConnected = false;
    deviceConnected = false;
    updateStatus("Status: Mosquitto desconectado (" + responseObject.errorMessage + ")", "disconnected");
}

function onConnectionLost(responseObject) {
    brokerConnected = false;
    deviceConnected = false;
    clearInterval(deviceStatusInterval);
    updateStatus("Status: Mosquitto desconectado", "disconnected");
}

function updateStatus(text, className) {
    const statusDiv = document.getElementById("status");

    if (statusDiv) {
        statusDiv.innerText = text;
        statusDiv.className = "status " + className;
    }
}

function markDeviceAsConnected() {
    lastDeviceMessageAt = Date.now();
    deviceConnected = true;
    updateStatus("Status: Protótipo conectado", "connected");
}

function checkDeviceStatus() {
    const deviceTimedOut = lastDeviceMessageAt === 0 ||
        Date.now() - lastDeviceMessageAt > DEVICE_TIMEOUT_MS;

    if (brokerConnected && deviceConnected && deviceTimedOut) {
        deviceConnected = false;
        updateStatus("Status: Protótipo desconectado", "disconnected");
    }
}

// Processa as mensagens recebidas nos tópicos assinados
function onMessageArrived(message) {
    if (message.destinationName !== TOPIC_TEMP &&
        message.destinationName !== TOPIC_HUM &&
        message.destinationName !== TOPIC_AIR) {
        return;
    }

    markDeviceAsConnected();

    // Identifica em qual tópico a mensagem chegou
    const topic = message.destinationName;
    // Capta o valor enviado pelo ESP32
    const payload = message.payloadString;
    // Mensagem de temperatura
    if (topic === TOPIC_TEMP) {
    document.getElementById("temp").innerText = payload;
    // Mensagem de umidade
    } else if (topic === TOPIC_HUM) {
    document.getElementById("hum").innerText = payload;
    // Mensagem de gás
    } else if (topic === TOPIC_AIR) {
    document.getElementById("air").innerText = payload;
    }
}
