// Data115 display helpers for LEDs, micro:bit screen, and simple 4-digit display placeholders.

//% color="#34495E" icon="\uf108" block="Data115 Displays"
namespace Data115Displays {
    //% block="show microbit status $text"
    export function microbitStatus(text: string): void {
        basic.showString(text)
    }

    //% block="show happy"
    export function happy(): void {
        basic.showIcon(IconNames.Happy)
    }

    //% block="show sad"
    export function sad(): void {
        basic.showIcon(IconNames.Sad)
    }

    //% block="show arrow direction $direction"
    export function showArrowText(direction: string): void {
        if (direction == "LEFT") basic.showArrow(ArrowNames.West)
        else if (direction == "RIGHT") basic.showArrow(ArrowNames.East)
        else if (direction == "UP") basic.showArrow(ArrowNames.North)
        else if (direction == "DOWN") basic.showArrow(ArrowNames.South)
        else basic.showIcon(IconNames.SmallDiamond)
    }

    //% block="show 4 digit value $value"
    export function fourDigitPlaceholder(value: number): void {
        basic.showNumber(value)
    }
}
