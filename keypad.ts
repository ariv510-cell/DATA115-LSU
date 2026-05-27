// DATA115 Keypad helpers for 4x4 matrix keypads
// Default layout:
// 1  2  3  4
// 5  6  7  8
// 9  10 11 12
// 13 14 15 16

//% color="#8E44AD" icon="\uf11b" block="DATA115 Keypad"
namespace Data115Keypad {
    let r1 = DigitalPin.P0
    let r2 = DigitalPin.P1
    let r3 = DigitalPin.P2
    let r4 = DigitalPin.P8
    let c1 = DigitalPin.P12
    let c2 = DigitalPin.P13
    let c3 = DigitalPin.P14
    let c4 = DigitalPin.P15

    function setupPins(): void {
        pins.digitalWritePin(r1, 1)
        pins.digitalWritePin(r2, 1)
        pins.digitalWritePin(r3, 1)
        pins.digitalWritePin(r4, 1)

        pins.setPull(c1, PinPullMode.PullUp)
        pins.setPull(c2, PinPullMode.PullUp)
        pins.setPull(c3, PinPullMode.PullUp)
        pins.setPull(c4, PinPullMode.PullUp)
    }

    //% block="keypad init rows $row1 $row2 $row3 $row4 cols $col1 $col2 $col3 $col4"
    //% group="Setup"
    export function init(row1: DigitalPin, row2: DigitalPin, row3: DigitalPin, row4: DigitalPin, col1: DigitalPin, col2: DigitalPin, col3: DigitalPin, col4: DigitalPin): void {
        r1 = row1
        r2 = row2
        r3 = row3
        r4 = row4
        c1 = col1
        c2 = col2
        c3 = col3
        c4 = col4
        setupPins()
    }

    function readColumn(): number {
        if (pins.digitalReadPin(c1) == 0) return 1
        if (pins.digitalReadPin(c2) == 0) return 2
        if (pins.digitalReadPin(c3) == 0) return 3
        if (pins.digitalReadPin(c4) == 0) return 4
        return 0
    }

    function scanRow(rowPin: DigitalPin, rowNumber: number): number {
        pins.digitalWritePin(r1, 1)
        pins.digitalWritePin(r2, 1)
        pins.digitalWritePin(r3, 1)
        pins.digitalWritePin(r4, 1)

        pins.digitalWritePin(rowPin, 0)
        control.waitMicros(200)

        let col = readColumn()
        pins.digitalWritePin(rowPin, 1)

        if (col == 0) return 0
        return (rowNumber - 1) * 4 + col
    }

    //% block="keypad read button number"
    //% group="Read"
    export function readButton(): number {
        let k = scanRow(r1, 1)
        if (k != 0) return k

        k = scanRow(r2, 2)
        if (k != 0) return k

        k = scanRow(r3, 3)
        if (k != 0) return k

        k = scanRow(r4, 4)
        if (k != 0) return k

        return 0
    }

    //% block="keypad button $button is pressed"
    //% button.min=1 button.max=16
    //% group="Read"
    export function isPressed(button: number): boolean {
        return readButton() == button
    }

    //% block="keypad wait for button"
    //% group="Read"
    export function waitForButton(): number {
        let k = 0
        while (k == 0) {
            k = readButton()
            basic.pause(20)
        }
        while (readButton() != 0) {
            basic.pause(20)
        }
        return k
    }
}
