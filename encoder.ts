// Rotary encoder helper for simple KY-040 style encoders.

//% color="#E67E22" icon="\uf01e" block="Data115 Encoder"
namespace Data115Encoder {
    let clkPin = DigitalPin.P0
    let dtPin = DigitalPin.P1
    let swPin = DigitalPin.P2
    let lastCLK = 0
    let value = 0

    //% block="initialize encoder CLK %clk DT %dt SW %sw"
    export function init(clk: DigitalPin, dt: DigitalPin, sw: DigitalPin): void {
        clkPin = clk
        dtPin = dt
        swPin = sw
        pins.setPull(clkPin, PinPullMode.PullUp)
        pins.setPull(dtPin, PinPullMode.PullUp)
        pins.setPull(swPin, PinPullMode.PullUp)
        lastCLK = pins.digitalReadPin(clkPin)
        value = 0
    }

    //% block="update encoder"
    export function update(): void {
        let currentCLK = pins.digitalReadPin(clkPin)
        if (currentCLK != lastCLK) {
            if (pins.digitalReadPin(dtPin) != currentCLK) value += 1
            else value -= 1
        }
        lastCLK = currentCLK
    }

    //% block="encoder value"
    export function read(): number {
        update()
        return value
    }

    //% block="reset encoder"
    export function reset(): void {
        value = 0
    }

    //% block="encoder button pressed"
    export function buttonPressed(): boolean {
        return pins.digitalReadPin(swPin) == 0
    }
}
