#include <Arduino.h>
#include <PZEM004Tv30.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define RXD2 16
#define TXD2 17

PZEM004Tv30 pzem(Serial2, RXD2, TXD2);
LiquidCrystal_I2C lcd(0x27, 16, 2);

unsigned long lastSwitch = 0;
int page = 0;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("SMART ENERGY");
  lcd.setCursor(0, 1);
  lcd.print("PBL IF-4PC-13");
  delay(3000);

  lcd.clear();
}

void loop() {
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();

  if (isnan(voltage)) voltage = 0;
  if (isnan(current)) current = 0;
  if (isnan(power)) power = 0;
  if (isnan(energy)) energy = 0;

  Serial.print("V: "); Serial.print(voltage);
  Serial.print(" | I: "); Serial.print(current);
  Serial.print(" | P: "); Serial.print(power);
  Serial.print(" | E: "); Serial.println(energy);

  if (millis() - lastSwitch > 3000) {
    page++;
    if (page > 1) page = 0;
    lcd.clear();
    lastSwitch = millis();
  }

  if (page == 0) {
    lcd.setCursor(0, 0);
    lcd.print("I:");
    lcd.print(current, 2);
    lcd.print("A");

    lcd.setCursor(0, 1);
    lcd.print("V:");
    lcd.print(voltage, 0);
    lcd.print(" P:");
    lcd.print(power, 0);
  }

  else if (page == 1) {
    lcd.setCursor(0, 0);
    lcd.print("Energy:");
    lcd.setCursor(0, 1);
    lcd.print(energy, 3);
    lcd.print(" kWh");
  }

  delay(500);
}