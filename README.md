[README.md](https://github.com/user-attachments/files/28083246/README.md)
# Data-115---MicroBit-Sensors
All sensors used in La Sierra University's Data 115 
# pxt-data115-full

Custom MakeCode extension for Data 115 / Maker Lab.

## Included

### Displays
- SSD1306 128x64 I2C OLED graphics, no OLED extension required
- Raw parallel LCD1602, no backpack required
- micro:bit LED display helpers
- 4-digit placeholder helper

### OLED Graphics
- Pixel
- Line
- Rectangle
- Filled rectangle
- Circle
- Text
- Big text
- Status screen
- Bar graph
- Gauge
- Explosion animation
- Wave
- Radar sweep

### Sensors
- Light sensor
- Sound sensor
- Soil moisture sensor
- Water sensor
- Flame sensor
- Crash/shock sensor
- PIR motion sensor
- Touch sensor
- Tilt switch
- Hall effect sensor
- Line sensor
- Ultrasonic distance sensor

### Environment
- Analog temperature helpers
- TMP36 temperature C/F helpers
- Analog humidity helpers

### IMU
- Built-in micro:bit accelerometer tilt helpers
- Shake strength
- Impact detection

External MPU6050 extensions can still be added separately. This library includes the dashboard logic and built-in IMU helpers, but not a guaranteed external MPU6050 dependency because those extensions vary by author.

### Inputs
- Rotary encoder helper
- Encoder button helper

### Outputs
- LEDs
- RGB LED pins
- Servo
- Relay
- Buzzer
- Basic motor direction/speed helper

### Logging
- Datalogger helpers for analog, digital, light, sound, soil, and custom values.

## Raw LCD1602 wiring

| LCD | micro:bit |
|---|---|
| RS | P0 |
| E | P1 |
| D4 | P8 |
| D5 | P12 |
| D6 | P13 |
| D7 | P14 |

Power:
- VSS -> GND
- VDD -> 3.3V
- VO -> GND or middle pin of 10k potentiometer
- RW -> GND
- A -> 3.3V
- K -> GND

## OLED wiring

| OLED | micro:bit |
|---|---|
| VCC | 3.3V |
| GND | GND |
| SDA | P20 |
| SCL | P19 |

## Example

```typescript
Data115OLED.init(0x3C)
Data115OLED.status("DATA115", "READY")

rawLCD1602.init(DigitalPin.P0, DigitalPin.P1, DigitalPin.P8, DigitalPin.P12, DigitalPin.P13, DigitalPin.P14)
rawLCD1602.showStatus("LIGHT", "VAL:" + Data115Sensors.light(AnalogPin.P1))

Data115Logging.logLight(AnalogPin.P1)
```

