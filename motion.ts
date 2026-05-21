// Data115 motion helpers for servo, buzzer, relay, and simple motor drivers.

//% color="#E74C3C" icon="\uf085" block="Data115 Motion"
namespace Data115Motion {
    //% block="servo pin %pin angle $angle"
    //% angle.min=0 angle.max=180
    export function servo(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, angle)
    }

    //% block="servo sweep pin %pin"
    export function servoSweep(pin: AnalogPin): void {
        for (let a = 0; a <= 180; a += 10) {
            pins.servoWritePin(pin, a)
            basic.pause(40)
        }
        for (let a = 180; a >= 0; a -= 10) {
            pins.servoWritePin(pin, a)
            basic.pause(40)
        }
    }

    //% block="relay pin %pin on"
    export function relayOn(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 1)
    }

    //% block="relay pin %pin off"
    export function relayOff(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
    }

    //% block="buzzer pin %pin beep frequency $freq duration $ms"
    //% freq.defl=880 ms.defl=200
    export function beep(pin: AnalogPin, freq: number, ms: number): void {
        pins.analogSetPitchPin(pin)
        music.playTone(freq, ms)
    }

    //% block="motor direction pin %dir speed pin %speedPin speed $speed forward $forward"
    //% speed.min=0 speed.max=1023
    export function motor(dir: DigitalPin, speedPin: AnalogPin, speed: number, forward: boolean): void {
        pins.digitalWritePin(dir, forward ? 1 : 0)
        pins.analogWritePin(speedPin, speed)
    }
}
