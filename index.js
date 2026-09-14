// IP do notebook onde o Mosquitto está rodando
const MQTT_HOST = "10.0.0.138"; 

// Porta do MOsquitto
const MQTT_PORT = 9001;

// Tópicos publicados pelo ESP32
const TOPIC_TEMP = "aulas/professortupi/temperatura";
const TOPIC_HUM  = "aulas/professortupi/umidade";
const TOPIC_AIR  = "aulas/professortupi/qualidade_ar";

// ID de cliente único para o navegador
const clientID = "WebDash_" + Math.random().toString(16).substr(2, 8);

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
    // Encontra o status no HTML
    const statusDiv = document.getElementById("status");
    // Muda o texto do status para conectado
    statusDiv.innerText = "Status: Conectado ao Mosquitto";
    // Muda o CSS do status para conectado
    statusDiv.className = "status connected";

    // Assina os tópicos publicados pelo ESP32 após conectar com sucesso 
    client.subscribe(TOPIC_TEMP);
    client.subscribe(TOPIC_HUM);
    client.subscribe(TOPIC_AIR);
}

function onFailure(responseObject) {
    // Encontra o status no HTML
    const statusDiv = document.getElementById("status");
    // Muda o texto do status para mensagem de erro
    statusDiv.innerText = "Status: Falha na conexão (" + responseObject.errorMessage + ")";
    // Muda o CSS do status para desconectado
    statusDiv.className = "status disconnected";
}

function onConnectionLost(responseObject) {
    // Verifica se houve perda de conexão por um erro
    if (responseObject.errorCode !== 0) {
    // Encontra o status no HTML
    const statusDiv = document.getElementById("status");
    // Muda o texto do status para desconectado
    statusDiv.innerText = "Status: Conexão Perdida";
    // Muda o CSS do status para desconectado
    statusDiv.className = "status disconnected";
    }
}

// Processa as mensagens recebidas nos tópicos assinados
function onMessageArrived(message) {
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
