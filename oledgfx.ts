namespace Data115OLED {

    let initialized = false

    //% block="OLED initialize"
    export function init(): void {

        pins.i2cWriteNumber(
        0x3C,
        0xAF,
        NumberFormat.UInt8BE,
        false
        )

        initialized = true
    }

    //% block="OLED clear"
    export function clear(): void {

        for (let i = 0; i < 8; i++) {

            pins.i2cWriteBuffer(0x3C, pins.createBuffer(2))

            for (let j = 0; j < 128; j++) {

                let buf = pins.createBuffer(2)

                buf[0] = 0x40
                buf[1] = 0x00

                pins.i2cWriteBuffer(0x3C, buf)
            }
        }
    }

    //% block="OLED line x0 $x0 y0 $y0 x1 $x1 y1 $y1"
    export function line(
    x0: number,
    y0: number,
    x1: number,
    y1: number
    ): void {

        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1

        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1

        let err = dx + dy

        while (true) {

            pixel(x0, y0)

            if (x0 == x1 && y0 == y1) {
                break
            }

            let e2 = 2 * err

            if (e2 >= dy) {
                err += dy
                x0 += sx
            }

            if (e2 <= dx) {
                err += dx
                y0 += sy
            }
        }
    }

    //% block="OLED rectangle x $x y $y w $w h $h"
    export function rect(
    x: number,
    y: number,
    w: number,
    h: number
    ): void {

        line(x, y, x + w, y)
        line(x, y + h, x + w, y + h)

        line(x, y, x, y + h)
        line(x + w, y, x + w, y + h)
    }

    //% block="OLED pixel x $x y $y"
    export function pixel(x: number, y: number): void {

        let page = Math.idiv(y, 8)

        let buf = pins.createBuffer(3)

        buf[0] = 0x00
        buf[1] = 0xB0 + page
        buf[2] = x & 0x7F

        pins.i2cWriteBuffer(0x3C, buf)

        let data = pins.createBuffer(2)

        data[0] = 0x40
        data[1] = 1 << (y % 8)

        pins.i2cWriteBuffer(0x3C, data)
    }

    //% block="OLED circle x $x y $y r $r"
    export function circle(
    x0: number,
    y0: number,
    r: number
    ): void {

        let x = r
        let y = 0

        let err = 0

        while (x >= y) {

            pixel(x0 + x, y0 + y)
            pixel(x0 + y, y0 + x)

            pixel(x0 - y, y0 + x)
            pixel(x0 - x, y0 + y)

            pixel(x0 - x, y0 - y)
            pixel(x0 - y, y0 - x)

            pixel(x0 + y, y0 - x)
            pixel(x0 + x, y0 - y)

            y += 1

            if (err <= 0) {
                err += 2 * y + 1
            }

            if (err > 0) {
                x -= 1
                err -= 2 * x + 1
            }
        }
    }

    //% block="OLED smiley"
    export function smiley(): void {

        clear()

        circle(64, 32, 25)

        circle(54, 24, 3)
        circle(74, 24, 3)

        for (let x = -12; x <= 12; x++) {

            let y = Math.sqrt(144 - (x * x))

            pixel(
            64 + x,
            38 + Math.round(y / 3)
            )
        }
    }

    //% block="OLED show"
    export function show(): void {

    }
}
