namespace Data115Dashboards {

    //% block="LCD show analog label $label pin $pin"
    export function lcdAnalog(label: string, pin: AnalogPin): void {
        rawLCD1602.showStatus(label, "VAL:" + pins.analogReadPin(pin))
    }

    //% block="LCD show digital label $label pin $pin"
    export function lcdDigital(label: string, pin: DigitalPin): void {
        if (pins.digitalReadPin(pin) == 1) {
            rawLCD1602.showStatus(label, "ON")
        } else {
            rawLCD1602.showStatus(label, "OFF")
        }
    }

    //% block="LCD show tilt"
    export function lcdTilt(): void {
        rawLCD1602.showStatus("TILT", Data115IMU.tiltDirection(300))
    }
}
