// DATA115 joystick helpers

namespace Data115Joystick {
    let xPin = AnalogPin.P3
    let yPin = AnalogPin.P4
    let swPin = DigitalPin.P5

    //% block="joystick init x $x y $y switch $sw"
    export function init(x: AnalogPin, y: AnalogPin, sw: DigitalPin): void {
        xPin = x
        yPin = y
        swPin = sw

        pins.setPull(swPin, PinPullMode.PullUp)
    }

    //% block="joystick x"
    export function x(): number {
        return pins.analogReadPin(xPin)
    }

    //% block="joystick y"
    export function y(): number {
        return pins.analogReadPin(yPin)
    }

    //% block="joystick pressed"
    export function pressed(): boolean {
        return pins.digitalReadPin(swPin) == 0
    }

    //% block="joystick direction"
    export function direction(): string {

        let xv = x()
        let yv = y()

        if (xv < 300) {
            return "LEFT"
        }

        if (xv > 700) {
            return "RIGHT"
        }

        if (yv < 300) {
            return "UP"
        }

        if (yv > 700) {
            return "DOWN"
        }

        return "CENTER"
    }
}
