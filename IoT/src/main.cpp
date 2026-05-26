#include <Arduino.h>
#include <PZEM004Tv30.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define RX_PIN 16
#define TX_PIN 17
#define RELAY_PIN 26
#define MAX_POWER 600

PZEM004Tv30 pzem(Serial2, RX_PIN, TX_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup()
{
    Serial.begin(115200);

    Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

    lcd.init();
    lcd.backlight();

    pinMode(RELAY_PIN, OUTPUT);

    digitalWrite(RELAY_PIN, LOW);


    for(int i = 0; i < 3; i++)
    {
        lcd.clear();
        lcd.setCursor(1,0);
        lcd.print("SMART ENERGY");

        delay(500);

        lcd.clear();

        delay(300);
    }

    lcd.setCursor(2,0);
    lcd.print("PBL PROJECT");

    lcd.setCursor(2,1);
    lcd.print("IF-4PC-13");

    delay(2500);

    lcd.clear();
}

void loop()
{
    float voltage = pzem.voltage();
    float current = pzem.current();
    float power   = pzem.power();
    float energy  = pzem.energy();

    if (isnan(voltage))
    {
        lcd.clear();

        lcd.setCursor(0,0);
        lcd.print("PZEM ERROR");

        delay(1000);

        return;
    }

    if(power > MAX_POWER)
    {
        digitalWrite(RELAY_PIN, HIGH);

        lcd.clear();

        lcd.setCursor(1,0);
        lcd.print("OVER POWER");

        lcd.setCursor(3,1);
        lcd.print(power,0);
        lcd.print(" W");

        delay(2000);

        return;
    }
    else
    {
        digitalWrite(RELAY_PIN, LOW);
    }


    lcd.clear();

    lcd.setCursor(0,0);
    lcd.print("V:");
    lcd.print(voltage,1);

    lcd.print(" I:");
    lcd.print(current,1);

    lcd.setCursor(0,1);
    lcd.print("P:");
    lcd.print(power,0);
    lcd.print("W");

    delay(2000);


    lcd.clear();

    lcd.setCursor(2,0);
    lcd.print("ENERGY");

    lcd.setCursor(1,1);
    lcd.print(energy,2);
    lcd.print(" kWh");

    delay(2000);
}