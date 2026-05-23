namespace Data115OLED {
    let addr = 0x3C
    let buffer = pins.createBuffer(1024)

    function cmd(c: number): void {
        let b = pins.createBuffer(2)
        b[0] = 0x00
        b[1] = c
        pins.i2cWriteBuffer(addr, b)
    }

    //% block="OLED init"
    export function init(): void {
        cmd(0xAE)
        cmd(0x20); cmd(0x00)
        cmd(0xB0)
        cmd(0xC8)
        cmd(0x00)
        cmd(0x10)
        cmd(0x40)
        cmd(0x81); cmd(0x7F)
        cmd(0xA1)
        cmd(0xA6)
        cmd(0xA8); cmd(0x3F)
        cmd(0xA4)
        cmd(0xD3); cmd(0x00)
        cmd(0xD5); cmd(0x80)
        cmd(0xD9); cmd(0xF1)
        cmd(0xDA); cmd(0x12)
        cmd(0xDB); cmd(0x40)
        cmd(0x8D); cmd(0x14)
        cmd(0xAF)
        clear()
        show()
    }

    //% block="OLED clear"
    export function clear(): void {
        for (let i = 0; i < 1024; i++) {
            buffer[i] = 0
        }
    }

   //% block="OLED show"
export function show(): void {

    for (let page = 0; page < 8; page++) {

        cmd(0xB0 + page)
        cmd(0x00)
        cmd(0x10)

        for (let col = 0; col < 128; col++) {

            let b = pins.createBuffer(2)

            b[0] = 0x40
            b[1] = buffer[page * 128 + col]

            pins.i2cWriteBuffer(addr, b)
        }
    }
}
    //% block="OLED pixel x $x y $y"
    export function pixel(x: number, y: number): void {
        if (x < 0 || x > 127 || y < 0 || y > 63) return

        let page = Math.idiv(y, 8)
        let index = page * 128 + x
        buffer[index] = buffer[index] | (1 << (y % 8))
    }

    //% block="OLED line x0 $x0 y0 $y0 x1 $x1 y1 $y1"
    export function line(x0: number, y0: number, x1: number, y1: number): void {
        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy

        while (true) {
            pixel(x0, y0)

            if (x0 == x1 && y0 == y1) break

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
    export function rect(x: number, y: number, w: number, h: number): void {
        line(x, y, x + w, y)
        line(x, y + h, x + w, y + h)
        line(x, y, x, y + h)
        line(x + w, y, x + w, y + h)
    }

    //% block="OLED fill rectangle x $x y $y w $w h $h"
    export function fillRect(x: number, y: number, w: number, h: number): void {
        for (let i = 0; i < w; i++) {
            line(x + i, y, x + i, y + h)
        }
    }

    //% block="OLED circle x $x y $y r $r"
    export function circle(x0: number, y0: number, r: number): void {
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
            if (err <= 0) err += 2 * y + 1
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

        fillRect(52, 22, 5, 8)
        fillRect(72, 22, 5, 8)

        for (let x = -14; x <= 14; x++) {
            let y = Math.sqrt(196 - x * x)
            pixel(64 + x, 38 + Math.round(y / 3))
            pixel(64 + x, 39 + Math.round(y / 3))
        }

        show()
    }
}
