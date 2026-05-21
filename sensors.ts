// Data115 common sensor helpers for analog and digital modules.

//% color="#39A935" icon="\uf2db" block="Data115 Sensors"
namespace Data115Sensors {
    //% block="read analog sensor on %pin"
    export function analog(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="read digital sensor on %pin"
    export function digital(pin: DigitalPin): number {
        return pins.digitalReadPin(pin)
    }

    //% block="analog percent on %pin"
    export function analogPercent(pin: AnalogPin): number {
        return Math.idiv(pins.analogReadPin(pin) * 100, 1023)
    }

    //% block="light value on %pin"
    export function light(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="light percent on %pin"
    export function lightPercent(pin: AnalogPin): number {
        return analogPercent(pin)
    }

    //% block="sound value on %pin"
    export function sound(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="sound percent on %pin"
    export function soundPercent(pin: AnalogPin): number {
        return analogPercent(pin)
    }

    //% block="sound detected on %pin threshold $threshold"
    //% threshold.defl=600
    export function soundDetected(pin: AnalogPin, threshold: number): boolean {
        return pins.analogReadPin(pin) > threshold
    }

    //% block="soil moisture value on %pin"
    export function soilMoisture(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="soil moisture percent on %pin"
    export function soilPercent(pin: AnalogPin): number {
        return analogPercent(pin)
    }

    //% block="water level value on %pin"
    export function waterLevel(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="water level percent on %pin"
    export function waterPercent(pin: AnalogPin): number {
        return analogPercent(pin)
    }

    //% block="flame detected digital on %pin active low $activeLow"
    //% activeLow.defl=true
    export function flameDetected(pin: DigitalPin, activeLow: boolean = true): boolean {
        let v = pins.digitalReadPin(pin)
        return activeLow ? v == 0 : v == 1
    }

    //% block="crash sensor on %pin triggered active low $activeLow"
    //% activeLow.defl=false
    export function crashTriggered(pin: DigitalPin, activeLow: boolean = false): boolean {
        let v = pins.digitalReadPin(pin)
        return activeLow ? v == 0 : v == 1
    }

    //% block="PIR motion on %pin"
    export function pirMotion(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    //% block="touch sensor on %pin touched"
    export function touched(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    //% block="tilt switch on %pin active"
    export function tiltSwitch(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    //% block="hall sensor on %pin active"
    export function hallActive(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    //% block="line sensor on %pin detects dark threshold $threshold"
    //% threshold.defl=500
    export function lineDark(pin: AnalogPin, threshold: number): boolean {
        return pins.analogReadPin(pin) < threshold
    }

    //% block="ultrasonic distance cm trig %trig echo %echo"
    export function ultrasonicCm(trig: DigitalPin, echo: DigitalPin): number {
        pins.setPull(trig, PinPullMode.PullNone)
        pins.digitalWritePin(trig, 0)
        control.waitMicros(2)
        pins.digitalWritePin(trig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig, 0)
        let d = pins.pulseIn(echo, PulseValue.High, 25000)
        return Math.idiv(d, 58)
    }
}
