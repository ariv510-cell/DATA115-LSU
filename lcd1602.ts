// Raw Parallel LCD1602 driver for HD44780-compatible displays in 4-bit mode.

//% color="#1E90FF" icon="\uf26c" block="Raw LCD1602"
namespace rawLCD1602 {
    let rs = DigitalPin.P0
    let en = DigitalPin.P1
    let d4 = DigitalPin.P8
    let d5 = DigitalPin.P12
    let d6 = DigitalPin.P13
    let d7 = DigitalPin.P14

    function pulseEnable(): void {
        pins.digitalWritePin(en, 0)
        control.waitMicros(1)
        pins.digitalWritePin(en, 1)
        control.waitMicros(1)
        pins.digitalWritePin(en, 0)
        basic.pause(1)
    }

    function write4Bits(value: number): void {
        pins.digitalWritePin(d4, (value >> 0) & 1)
        pins.digitalWritePin(d5, (value >> 1) & 1)
        pins.digitalWritePin(d6, (value >> 2) & 1)
        pins.digitalWritePin(d7, (value >> 3) & 1)
        pulseEnable()
    }

    function send(value: number, mode: number): void {
        pins.digitalWritePin(rs, mode)
        write4Bits(value >> 4)
        write4Bits(value & 0x0F)
    }

    function command(value: number): void { send(value, 0) }
    function writeChar(value: number): void { send(value, 1) }

    //% block="initialize LCD RS %rsPin E %enPin D4 %d4Pin D5 %d5Pin D6 %d6Pin D7 %d7Pin"
    //% group="Setup"
    export function init(rsPin: DigitalPin, enPin: DigitalPin, d4Pin: DigitalPin, d5Pin: DigitalPin, d6Pin: DigitalPin, d7Pin: DigitalPin): void {
        rs = rsPin; en = enPin; d4 = d4Pin; d5 = d5Pin; d6 = d6Pin; d7 = d7Pin
        basic.pause(50)
        pins.digitalWritePin(rs, 0); pins.digitalWritePin(en, 0)
        write4Bits(0x03); basic.pause(5); write4Bits(0x03); basic.pause(5); write4Bits(0x03); basic.pause(1); write4Bits(0x02)
        command(0x28); command(0x0C); command(0x06); command(0x01); basic.pause(5)
    }

    //% block="clear LCD"
    //% group="Display"
    export function clear(): void { command(0x01); basic.pause(2) }

    //% block="set LCD cursor col %col row %row"
    //% group="Cursor"
    export function setCursor(col: number, row: number): void {
        let rowOffsets = [0x00, 0x40]
        if (row < 0) row = 0
        if (row > 1) row = 1
        command(0x80 | (col + rowOffsets[row]))
    }

    //% block="LCD print %text"
    //% group="Display"
    export function print(text: string): void {
        for (let i = 0; i < text.length; i++) writeChar(text.charCodeAt(i))
    }

    //% block="LCD print line %text on row %row"
    //% group="Display"
    export function printLine(text: string, row: number): void {
        setCursor(0, row); print(text)
    }

    //% block="LCD show title $title value $value"
    //% group="Display"
    export function showStatus(title: string, value: string): void {
        clear(); printLine(title, 0); printLine(value, 1)
    }
}
