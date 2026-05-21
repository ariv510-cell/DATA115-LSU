// Data115 preset dashboards combining sensors with OLED/LCD.

//% color="#16A085" icon="\uf0e4" block="Data115 Dashboards"
namespace Data115Dashboards {
    //% block="OLED show analog dashboard label $label pin $pin max $max"
    //% max.defl=1023
    export function oledAnalog(label: string, pin: AnalogPin, max: number): void {
        Data115OLED.bar(pins.analogReadPin(pin), max, label)
    }

    //% block="OLED show digital status label $label pin $pin"
    export function oledDigital(label: string, pin: DigitalPin): void {
        let v = pins.digitalReadPin(pin)
        Data115OLED.status(label, v == 1 ? "ON" : "OFF")
    }

    //% block="OLED show tilt dashboard"
    export function oledTilt(): void {
        Data115OLED.status("TILT", Data115IMU.tiltDirection(300))
    }

    //% block="LCD show analog label $label pin $pin"
    export function lcdAnalog(label: string, pin: AnalogPin): void {
        rawLCD1602.showStatus(label, "VAL:" + pins.analogReadPin(pin))
    }

    //% block="LCD show digital label $label pin $pin"
    export function lcdDigital(label: string, pin: DigitalPin): void {
        rawLCD1602.showStatus(label, pins.digitalReadPin(pin) == 1 ? "ON" : "OFF")
    }

    //% block="LCD show tilt"
    export function lcdTilt(): void {
        rawLCD1602.showStatus("TILT", Data115IMU.tiltDirection(300))
    }
}
