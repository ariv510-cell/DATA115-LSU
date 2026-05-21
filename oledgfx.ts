namespace Data115OLED {

    let initialized = false
    let addr = 0x3C

    function cmd(c: number): void {
        let b = pins.createBuffer(2)
        b[0] = 0x00
        b[1] = c
        pins.i2cWriteBuffer(addr, b)
    }

    function data(d: number): void {
        let b = pins.createBuffer(2)
        b[0] = 0x40
        b[1] = d
        pins.i2cWriteBuffer(addr, b)
    }

    export function init(): void {
        cmd(0xAE)
        cmd(0xA4)
        cmd(0xD5)
        cmd(0xF0)
        cmd(0xA8)
        cmd(0x3F)
        cmd(0xD3)
        cmd(0x00)
        cmd(0x40)
        cmd(0x8D)
        cmd(0x14)
        cmd(0x20)
        cmd(0x00)
        cmd(0xA1)
        cmd(0xC8)
        cmd(0xDA)
        cmd(0x12)
        cmd(0x81)
        cmd(0xCF)
        cmd(0xD9)
        cmd(0xF1)
        cmd(0xDB)
        cmd(0x40)
        cmd(0xA6)
        cmd(0xAF)

        clear()
        initialized = true
    }

    export function clear(): void {
        for (let page = 0; page < 8; page++) {
            cmd(0xB0 + page)
            cmd(0x00)
            cmd(0x10)

            for (let i = 0; i < 128; i++) {
                data(0x00)
            }
        }
    }

    export function pixel(x: number, y: number): void {
        let page = Math.idiv(y, 8)

        cmd(0xB0 + page)
        cmd(x & 0x0F)
        cmd(0x10 | (x >> 4))

        data(1 << (y % 8))
    }

    export function line(x0: number, y0: number, x1: number, y1: number): void {

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

    export function rect(x: number, y: number, w: number, h: number): void {

        line(x, y, x + w, y)
        line(x, y + h, x + w, y + h)
        line(x, y, x, y + h)
        line(x + w, y, x + w, y + h)
    }

    export function smiley(): void {

        clear()

        rect(20, 5, 80, 50)

        rect(35, 18, 8, 8)
        rect(75, 18, 8, 8)

        line(40, 40, 80, 40)
        line(40, 41, 80, 41)

        line(40, 40, 50, 48)
        line(50, 48, 70, 48)
        line(70, 48, 80, 40)
    }

    export function blink(): void {

        clear()

        rect(20, 5, 80, 50)

        line(35, 22, 45, 22)
        line(75, 22, 85, 22)

        line(40, 40, 80, 40)
        line(40, 41, 80, 41)

        line(40, 40, 50, 48)
        line(50, 48, 70, 48)
        line(70, 48, 80, 40)
    }
}
