for PXT/microbit

# Data-115---MicroBit-Sensors

![icon](icon.png)

Maker Lab classroom extension for micro:bit.

This extension combines:
- Sensors
- OLED graphics
- LCD1602 displays
- MPU6050 motion sensing
- Rotary encoders
- LEDs and RGB lighting
- Motors and servos
- Datalogger helpers
- Dashboard displays
- Robotics utilities

Designed for DATA 115 and Maker Lab projects.

## Included Features

### Displays
- OLED text
- OLED shapes
- OLED lines
- OLED rectangles
- OLED circles
- OLED animations
- Raw LCD1602 support

### Sensors
- Light sensor
- Sound sensor
- Soil moisture
- Temperature
- Humidity
- Motion detection
- Shock sensor
- Ultrasonic distance
- MPU6050 accelerometer + gyroscope

### Motion
- Servo control
- Motor helpers
- Encoder support

### Lighting
- RGB LEDs
- Neopixels
- Brightness control
- Effects

### Data
- Built-in datalogger helpers
- Dashboard systems
- Live sensor displays

## Example

```typescript
OLED.init(128, 64)
OLED.writeString("DATA 115")

basic.forever(function () {
    OLED.clear()
    OLED.writeString("Tilt:")
    OLED.writeNum(input.rotation(Rotation.Roll))
    basic.pause(100)
})
