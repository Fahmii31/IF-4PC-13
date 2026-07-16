#include <WiFi.h>
#include <MQTTClient.h>
#include <IskakINO_LiquidCrystal_I2C.h>
#include <PZEM004Tv30.h>
#include <Wire.h>
#include <time.h>

#define RX_PIN 16
#define TX_PIN 17
#define RELAY_PIN 27

// ======================
// WIFI
// ======================
const char* ssid = "ais";
const char* password = "123456789";

// ======================
// MQTT
// ======================
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

const char* sensor_topic = "smartenergy/pzem";
const char* relay_topic  = "smartenergy/relay";

// ======================
// MQTT CLIENT
// ======================
WiFiClient net;
MQTTClient client;

// ======================
// PZEM
// ======================
PZEM004Tv30 pzem(Serial2, RX_PIN, TX_PIN);

// ======================
// LCD
// ======================
LiquidCrystal_I2C lcd(16, 2);

// ======================
// RELAY STATUS
// ======================
bool relayState = true;

// ======================
// LCD & PUBLISH TIMING
// ======================
unsigned long lastPublish   = 0;
unsigned long lastLCDSwitch = 0;
int lcdPage = 0;

float lastVoltage = 0;
float lastCurrent = 0;
float lastPower   = 0;
float lastEnergy  = 0;

// ======================
// TIMESTAMP REAL TIME (NTP)
// ======================
String getTimestamp()
{
    struct tm timeinfo;

    if (!getLocalTime(&timeinfo))
    {
        return "[--:--:--]";
    }

    char buffer[20];
    sprintf(buffer, "[%02d:%02d:%02d]",
        timeinfo.tm_hour,
        timeinfo.tm_min,
        timeinfo.tm_sec);

    return String(buffer);
}

// ======================
// WIFI CONNECT
// ======================
void setup_wifi()
{
    Serial.println();
    Serial.print("Connecting WiFi");

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();

    configTime(7 * 3600, 0, "pool.ntp.org", "time.nist.gov");

    Serial.print("Syncing NTP time");
    struct tm timeinfo;
    while (!getLocalTime(&timeinfo))
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println(" Synced!");

    Serial.print(getTimestamp());
    Serial.println(" WiFi Connected");

    Serial.print(getTimestamp());
    Serial.print(" IP Address: ");
    Serial.println(WiFi.localIP());
}

// ======================
// MQTT CALLBACK
// ======================
void messageReceived(String &topic, String &payload)
{
    Serial.println();

    Serial.print(getTimestamp());
    Serial.println(" ========== MQTT ==========");

    Serial.print(getTimestamp());
    Serial.print(" Topic   : ");
    Serial.println(topic);

    Serial.print(getTimestamp());
    Serial.print(" Payload : ");
    Serial.println(payload);

    if (topic == relay_topic)
    {
        if (payload == "ON")
        {
            relayState = true;
            digitalWrite(RELAY_PIN, HIGH); // ✅ NO: HIGH = arus masuk = ON

            Serial.print(getTimestamp());
            Serial.println(" Relay ON");
        }
        else if (payload == "OFF")
        {
            relayState = false;
            digitalWrite(RELAY_PIN, LOW);  // ✅ NO: LOW = arus putus = OFF

            Serial.print(getTimestamp());
            Serial.println(" Relay OFF");
        }
    }
}

// ======================
// MQTT CONNECT
// ======================
void connectMQTT()
{
    while (!client.connected())
    {
        Serial.print(getTimestamp());
        Serial.print(" Connecting MQTT...");

        String clientId = "ESP32_PZEM_";
        clientId += String(random(1000));

        if (client.connect(clientId.c_str()))
        {
            Serial.println(" Connected");

            client.subscribe(relay_topic);

            Serial.print(getTimestamp());
            Serial.print(" Subscribed : ");
            Serial.println(relay_topic);
        }
        else
        {
            Serial.println(" Failed");
            delay(3000);
        }
    }
}

void setup()
{
    Serial.begin(115200);

    // LCD
    lcd.begin();
    lcd.backlight();

    lcd.setCursor(0, 0);
    lcd.print("Connecting...");

    // Relay
    pinMode(RELAY_PIN, OUTPUT);

    // ✅ NO: Default ON = HIGH = arus masuk
    digitalWrite(RELAY_PIN, LOW);

    // WiFi + NTP
    setup_wifi();

    // MQTT
    client.begin(mqtt_server, mqtt_port, net);
    client.onMessage(messageReceived);

    connectMQTT();

    // PZEM
    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Smart Energy");

    delay(2000);
    lcd.clear();
}

void loop()
{
    if (!client.connected())
    {
        connectMQTT();
    }

    client.loop();

    unsigned long now = millis();

    // ======================
    // BACA SENSOR & PUBLISH TIAP 4 DETIK
    // ======================
    if (now - lastPublish >= 4000)
    {
        lastPublish = now;

        lastVoltage = pzem.voltage();
        lastCurrent = pzem.current();
        lastPower   = pzem.power();
        lastEnergy  = pzem.energy();

        if (isnan(lastVoltage))
        {
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Sensor Error");

            Serial.print(getTimestamp());
            Serial.println(" Sensor Error");

            // ✅ Tidak pakai return, biar loop tetap jalan
            lastPublish = now - 3000; // coba lagi 1 detik kemudian
        }
        else
        {
            String payload = "{";
            payload += "\"voltage\":" + String(lastVoltage, 1);
            payload += ",";
            payload += "\"current\":" + String(lastCurrent, 2);
            payload += ",";
            payload += "\"power\":" + String(lastPower, 0);
            payload += ",";
            payload += "\"energy\":" + String(lastEnergy, 2);
            payload += ",";
            payload += "\"relay\":" + String(relayState ? "true" : "false");
            payload += "}";

            client.publish(sensor_topic, payload);

            Serial.print(getTimestamp());
            Serial.print(" Sensor Data: ");
            Serial.println(payload);
        }
    }

    // ======================
    // GANTI HALAMAN LCD TIAP 2 DETIK
    // ======================
    if (now - lastLCDSwitch >= 2000)
    {
        lastLCDSwitch = now;
        lcdPage = !lcdPage;

        lcd.clear();

        if (lcdPage == 0)
        {
            lcd.setCursor(0, 0);
            lcd.print("V:");
            lcd.print(lastVoltage, 1);

            lcd.setCursor(9, 0);
            lcd.print("I:");
            lcd.print(lastCurrent, 1);

            lcd.setCursor(0, 1);
            lcd.print("P:");
            lcd.print(lastPower, 0);
            lcd.print("W");
        }
        else
        {
            lcd.setCursor(0, 0);
            lcd.print("Energy");

            lcd.setCursor(0, 1);
            lcd.print(lastEnergy, 2);
            lcd.print(" kWh");
        }
    }
}
