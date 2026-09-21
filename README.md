
<h1 align="center">
<img src="https://i.pinimg.com/736x/fb/d0/0a/fbd00a9c9b74bdb6376eac83c7c6da61.jpg" width="128" />
<br> Estação meteorológica | Projeto de integração IoT
 
 
Descrição

==========
<p>
Projeto desenvolvido para a disciplina de Internet das Coisas (IoT), utilizando um ESP32 para coleta de dados ambientais e um Dashboard Web para visualização das informações em tempo real.
A solução integra sensores físicos, comunicação MQTT, WebSockets e uma interface web responsiva, permitindo acompanhar temperatura, umidade e qualidade do ar enquanto os dados são coletados pelo dispositivo.
 
Grupo MegaMind- Integrantes
</p>

==========
<p>
 
Beatryz Caroline dos Santos Rodrigues <br>
Beatriz Santos de Oliveira <br>
Pietra Del Vecchio Pivatti <br>
Isadora Gregatti Danelon  <br>
Marcela Pereira da Cruz <br>
 
 
Arquitetura

</p>
=======
 
┌──────────────────────┐

│ ESP32 │ │ │ │ ┌──────┐ 

│ │ │DHT11 │ │ │└──────┘

│ │ ┌──────┐ │ │       │

    │MQ135 │           │

│ │ └──────┘ │ │ │     │

│ LEDs de alerta │     │

└──────────┬───────────┘ 

           │ MQTT 

           │ Porta 1883

           ▼ ┌──────────────────────┐

             │ Mosquitto Broker     │ 

             │ MQTT + WebSockets    │

             └──────────┬───────────┘

                        │ 

                        │ WebSockets 

                        │ Porta 9001 

                        ▼ 

                        ┌──────────────────────┐

                        │ Dashboard Web        │ 

                        │                      │ 

                        │ HTML + CSS + JS      │ 

                        │ Paho MQTT            │ 

                        └──────────────────────┘
 
 
Funcionamento

=======
 <p>
  
ESP32 → MQTT → Mosquitto → WebSockets → Dashboard
Os dados são publicados a cada 3 segundos nos tópicos:
aulas/professortupi/temperatura
aulas/professortupi/umidade
aulas/professortupi/qualidade_ar
O ESP32 também possui LEDs de alerta para:
🌡️ Temperatura > 28°C
💧 Umidade > 56%
☁ Qualidade do ar > 400
 
 
Tecnologias
 </p>

=======
<p>
 
* **ESP32** 
* **DHT11**
* **MQ135**
* **MQTT/Mosquitto**
* **WebSockets**
* **Paho MQTT**
* **HTML, CSS, JavaScript**
* **LocalStorage**

</p>
 
