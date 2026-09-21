// IP do notebook onde o Mosquitto está rodando
const MQTT_HOST = "192.168.3.73"; 

// Porta do Mosquitto
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

// Broker conectado
function onConnect() {
    // Navegador conectado ao Mosquitto
    brokerConnected = true;
    // Não se sabe se o ESP32 está enviando dados
    deviceConnected = false;
    // Zera o horário da última mensagem
    lastDeviceMessageAt = 0;
    // Para um temporizador anterior, caso exista
    clearInterval(deviceStatusInterval);
    // A cada 1 segundo, verifica se o ESP32 continua enviando dados
    deviceStatusInterval = setInterval(checkDeviceStatus, 1000);
    // O protótipo ainda não foi confirmado como conectado
    updateStatus("Status: Protótipo desconectado", "disconnected");

    // Assina os tópicos publicados pelo ESP32 após conectar
    client.subscribe(TOPIC_TEMP);
    client.subscribe(TOPIC_HUM);
    client.subscribe(TOPIC_AIR);
}

// Falha
function onFailure(responseObject) {
    // Mosquitto não está conectado
    brokerConnected = false;
    // Protótipo também não é considerado conectado
    deviceConnected = false;
    // Mostra o erro na tela
    updateStatus("Status: Mosquitto desconectado (" + responseObject.errorMessage + ")", "disconnected");
}

// Perda de conexão
function onConnectionLost(responseObject) {
    // O navegador perdeu a conexão com o Mosquitto
    brokerConnected = false;
    // O protótipo também deixa de ser considerado conectado
    deviceConnected = false;
    // Para a verificação automática do status
    clearInterval(deviceStatusInterval);
    // Atualiza o status na tela
    updateStatus("Status: Mosquitto desconectado", "disconnected");
}

// Atualiza o status
function updateStatus(text, className) {
    // Procura no HTML o id="status"
    const statusDiv = document.getElementById("status");

    // Verifica se o elemento existe
    if (statusDiv) {
        // Muda o texto da tela
        statusDiv.innerText = text;
        // Muda o CSS
        statusDiv.className = "status " + className;
    }
}

// Protótipo conectado
function markDeviceAsConnected() {
    // Guarda o horário em que a mensagem é recebida
    lastDeviceMessageAt = Date.now();
    // Confirma que o ESP32 está enviando dados
    deviceConnected = true;
    // Mostra que o protótipo está conectado
    updateStatus("Status: Protótipo conectado", "connected");
}

// ESP32 enviando dados
function checkDeviceStatus() {
    // Vê se uma mensagem foi recebida ou se fazem mais de 10 segundos que a última mensagem chegou
    const deviceTimedOut = lastDeviceMessageAt === 0 ||
        Date.now() - lastDeviceMessageAt > DEVICE_TIMEOUT_MS;

    // Se está tudo conectado, mas as mensagen pararam de ser enviadas
    if (brokerConnected && deviceConnected && deviceTimedOut) {
        // Protótipo considerado desconectado
        deviceConnected = false;
        // Atualiza na tela
        updateStatus("Status: Protótipo desconectado", "disconnected");
    }
}

// Verifica se as mensagens foram recebidas dos tópicos
function onMessageArrived(message) {
    if (message.destinationName !== TOPIC_TEMP &&
        message.destinationName !== TOPIC_HUM &&
        message.destinationName !== TOPIC_AIR) {
        return;
    }

    // ESP32 manda, logo conectado
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
