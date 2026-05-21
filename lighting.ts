// Data115 lighting helpers. Basic LEDs and RGB pins.
// NeoPixel support normally needs MakeCode NeoPixel extension added separately.

//% color="#F1C40F" icon="\uf0eb" block="Data115 Lighting"
namespace Data115Lighting {
    //% block="turn LED pin %pin on"
    export function ledOn(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 1)
    }

    //% block="turn LED pin %pin off"
    export function ledOff(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
    }

    //% block="blink LED pin %pin times $times delay $delayMs ms"
    //% times.defl=3 delayMs.defl=200
    export function blink(pin: DigitalPin, times: number, delayMs: number): void {
        for (let i = 0; i < times; i++) {
            pins.digitalWritePin(pin, 1)
            basic.pause(delayMs)
            pins.digitalWritePin(pin, 0)
            basic.pause(delayMs)
        }
    }

    //% block="RGB pins R %rPin G %gPin B %bPin values R $r G $g B $b"
    export function rgb(rPin: AnalogPin, gPin: AnalogPin, bPin: AnalogPin, r: number, g: number, b: number): void {
        pins.analogWritePin(rPin, r)
        pins.analogWritePin(gPin, g)
        pins.analogWritePin(bPin, b)
    }
}
