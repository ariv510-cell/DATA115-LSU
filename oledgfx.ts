// Data115 OLED Graphics for SSD1306 128x64 I2C OLED. No separate OLED extension required.

//% color="#00AEEF" icon="\uf26c" block="Data115 OLED"
namespace Data115OLED {
    let OLED_ADDR = 0x3C
    let WIDTH = 128
    let HEIGHT = 64
    let buffer = pins.createBuffer(1024)
    let ready = false

    function cmd(c: number): void {
        let b = pins.createBuffer(2)
        b[0] = 0x00
        b[1] = c
        pins.i2cWriteBuffer(OLED_ADDR, b)
    }

    function data(start: number, len: number): void {
        let b = pins.createBuffer(len + 1)
        b[0] = 0x40
        for (let i = 0; i < len; i++) b[i + 1] = buffer[start + i]
        pins.i2cWriteBuffer(OLED_ADDR, b)
    }

    //% block="initialize OLED address $address"
    //% address.defl=60
    //% group="Setup"
    export function init(address: number = 0x3C): void {
        OLED_ADDR = address
        basic.pause(100)
        cmd(0xAE); cmd(0xD5); cmd(0x80); cmd(0xA8); cmd(0x3F); cmd(0xD3); cmd(0x00)
        cmd(0x40); cmd(0x8D); cmd(0x14); cmd(0x20); cmd(0x00); cmd(0xA1); cmd(0xC8)
        cmd(0xDA); cmd(0x12); cmd(0x81); cmd(0xCF); cmd(0xD9); cmd(0xF1); cmd(0xDB); cmd(0x40)
        cmd(0xA4); cmd(0xA6); cmd(0xAF)
        ready = true
        clear()
        show()
    }

    //% block="OLED clear"
    //% group="Display"
    export function clear(): void {
        for (let i = 0; i < 1024; i++) buffer[i] = 0
    }

    //% block="OLED show"
    //% group="Display"
    export function show(): void {
        if (!ready) return
        cmd(0x21); cmd(0); cmd(127)
        cmd(0x22); cmd(0); cmd(7)
        for (let p = 0; p < 8; p++) data(p * 128, 128)
    }

    //% block="OLED set pixel x $x y $y on $on"
    //% on.defl=true
    //% group="Shapes"
    export function pixel(x: number, y: number, on: boolean = true): void {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
        let index = x + Math.idiv(y, 8) * WIDTH
        let mask = 1 << (y % 8)
        if (on) buffer[index] = buffer[index] | mask
        else buffer[index] = buffer[index] & ~mask
    }

    //% block="OLED line x1 $x0 y1 $y0 x2 $x1 y2 $y1"
    //% group="Shapes"
    export function line(x0: number, y0: number, x1: number, y1: number): void {
        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy
        while (true) {
            pixel(x0, y0, true)
            if (x0 == x1 && y0 == y1) break
            let e2 = 2 * err
            if (e2 >= dy) { err += dy; x0 += sx }
            if (e2 <= dx) { err += dx; y0 += sy }
        }
    }

    //% block="OLED rectangle x $x y $y width $w height $h"
    //% group="Shapes"
    export function rect(x: number, y: number, w: number, h: number): void {
        line(x, y, x + w - 1, y)
        line(x, y + h - 1, x + w - 1, y + h - 1)
        line(x, y, x, y + h - 1)
        line(x + w - 1, y, x + w - 1, y + h - 1)
    }

    //% block="OLED filled rectangle x $x y $y width $w height $h"
    //% group="Shapes"
    export function fillRect(x: number, y: number, w: number, h: number): void {
        for (let yy = y; yy < y + h; yy++) line(x, yy, x + w - 1, yy)
    }

    //% block="OLED circle x $x y $y radius $r"
    //% group="Shapes"
    export function circle(x: number, y: number, r: number): void {
        let f = 1 - r
        let ddF_x = 1
        let ddF_y = -2 * r
        let xx = 0
        let yy = r
        pixel(x, y + r, true); pixel(x, y - r, true); pixel(x + r, y, true); pixel(x - r, y, true)
        while (xx < yy) {
            if (f >= 0) { yy--; ddF_y += 2; f += ddF_y }
            xx++; ddF_x += 2; f += ddF_x
            pixel(x + xx, y + yy, true); pixel(x - xx, y + yy, true); pixel(x + xx, y - yy, true); pixel(x - xx, y - yy, true)
            pixel(x + yy, y + xx, true); pixel(x - yy, y + xx, true); pixel(x + yy, y - xx, true); pixel(x - yy, y - xx, true)
        }
    }

    // Simple built-in block font for A-Z, 0-9, space, and basic symbols.
    const font = "0000005F000003000300147F147F14242A7F2A12231308646236495522500005030000001C2241000041221C00082A1C2A0808083E0808005030000008080808006060000201008040231514946027951493606494949360030710907003636494936064949291E003F4444443F417F4141417F494949413E414141227F494949363E4141413E7F494949367F484848407F090909013E4149492E7F0808087F00417F41002040413F017F081422417F404040407F0204027F7F0408107F3E4141413E7F090909063E4151215E7F09192946364949492601017F01013F4040403F1F2040201F7F2018207F631408146303047804036364949413E41454951413E0101017F0040407F40420408702040413F3F4038403F631408146007027047000000000000"

    function drawChar(ch: string, x: number, y: number): void {
        let code = ch.charCodeAt(0)
        if (code < 32 || code > 90) code = 32
        let idx = (code - 32) * 5
        for (let col = 0; col < 5; col++) {
            let v = parseInt(font.substr((idx + col) * 2, 2), 16)
            for (let row = 0; row < 7; row++) if ((v >> row) & 1) pixel(x + col, y + row, true)
        }
    }

    //% block="OLED text $text x $x y $y"
    //% group="Text"
    export function text(text: string, x: number, y: number): void {
        text = text.toUpperCase()
        for (let i = 0; i < text.length; i++) drawChar(text.charAt(i), x + i * 6, y)
    }

    //% block="OLED big text $text x $x y $y"
    //% group="Text"
    export function bigText(text: string, x: number, y: number): void {
        text = text.toUpperCase()
        for (let i = 0; i < text.length; i++) {
            let ox = x + i * 12
            drawChar(text.charAt(i), ox, y)
            drawChar(text.charAt(i), ox + 1, y)
            drawChar(text.charAt(i), ox, y + 1)
            drawChar(text.charAt(i), ox + 1, y + 1)
        }
    }

    //% block="OLED status title $title value $value"
    //% group="Dashboards"
    export function status(title: string, value: string): void {
        clear(); rect(0, 0, 128, 64); text(title, 4, 6); line(0, 18, 127, 18); text(value, 4, 28); show()
    }

    //% block="OLED bar value $value max $max label $label"
    //% max.defl=1023
    //% group="Dashboards"
    export function bar(value: number, max: number, label: string): void {
        if (value < 0) value = 0
        if (value > max) value = max
        let w = Math.idiv(value * 118, max)
        clear(); text(label, 4, 4); rect(4, 24, 120, 16); fillRect(5, 25, w, 14); text("" + value, 4, 48); show()
    }

    //% block="OLED gauge value $value max $max label $label"
    //% max.defl=1023
    //% group="Dashboards"
    export function gauge(value: number, max: number, label: string): void {
        if (value < 0) value = 0
        if (value > max) value = max
        let angle = 180 - Math.idiv(value * 180, max)
        let cx = 64, cy = 54
        clear(); text(label, 4, 2); circle(cx, cy, 34); line(cx - 34, cy, cx + 34, cy)
        let rad = angle * 3.14159 / 180
        line(cx, cy, cx + Math.round(Math.cos(rad) * 28), cy - Math.round(Math.sin(rad) * 28))
        text("" + value, 48, 20); show()
    }

    //% block="OLED explosion"
    //% group="Animations"
    export function explosion(): void {
        for (let r = 2; r < 35; r += 4) {
            clear(); circle(64, 32, r)
            for (let i = 0; i < 35; i++) pixel(randint(20, 108), randint(4, 60), true)
            bigText("CRASH", 34, 25); show(); basic.pause(80)
        }
    }

    //% block="OLED wave"
    //% group="Animations"
    export function wave(): void {
        clear()
        for (let x = 0; x < 128; x++) pixel(x, 32 + Math.round(15 * Math.sin(x / 8)), true)
        show()
    }

    //% block="OLED radar sweep"
    //% group="Animations"
    export function radar(): void {
        for (let a = 0; a < 360; a += 20) {
            clear(); circle(64, 32, 28); circle(64, 32, 18)
            let rad = a * 3.14159 / 180
            line(64, 32, 64 + Math.round(Math.cos(rad) * 28), 32 + Math.round(Math.sin(rad) * 28))
            show(); basic.pause(60)
        }
    }
}
