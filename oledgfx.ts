// Data115 OLED GFX Library
// SSD1306 128x64 I2C OLED
// Adafruit GFX-style functions

//% color="#00AEEF" icon="\uf26c" block="Data115 OLED"
namespace Data115OLED {
    let OLED_ADDR = 0x3C
    let WIDTH = 128
    let HEIGHT = 64
    let buffer = pins.createBuffer(1024)
    let ready = false

    let cursorX = 0
    let cursorY = 0
    let textSize = 1

    function cmd(c: number): void {
        let b = pins.createBuffer(2)
        b[0] = 0x00
        b[1] = c
        pins.i2cWriteBuffer(OLED_ADDR, b)
    }

    function data(start: number, len: number): void {
        let b = pins.createBuffer(len + 1)
        b[0] = 0x40
        for (let i = 0; i < len; i++) {
            b[i + 1] = buffer[start + i]
        }
        pins.i2cWriteBuffer(OLED_ADDR, b)
    }

    //% block="OLED begin address $address"
    //% address.defl=60
    //% group="Setup"
    export function begin(address: number = 0x3C): void {
        OLED_ADDR = address
        basic.pause(100)

        cmd(0xAE)
        cmd(0xD5); cmd(0x80)
        cmd(0xA8); cmd(0x3F)
        cmd(0xD3); cmd(0x00)
        cmd(0x40)
        cmd(0x8D); cmd(0x14)
        cmd(0x20); cmd(0x00)
        cmd(0xA1)
        cmd(0xC8)
        cmd(0xDA); cmd(0x12)
        cmd(0x81); cmd(0xCF)
        cmd(0xD9); cmd(0xF1)
        cmd(0xDB); cmd(0x40)
        cmd(0xA4)
        cmd(0xA6)
        cmd(0xAF)

        ready = true
        clearDisplay()
        display()
    }

    //% block="initialize OLED address $address"
    //% address.defl=60
    //% group="Setup"
    export function init(address: number = 0x3C): void {
        begin(address)
    }

    //% block="OLED clear display"
    //% group="Display"
    export function clearDisplay(): void {
        for (let i = 0; i < 1024; i++) {
            buffer[i] = 0
        }
    }

    //% block="OLED clear"
    //% group="Display"
    export function clear(): void {
        clearDisplay()
    }

    //% block="OLED display"
    //% group="Display"
    export function display(): void {
        if (!ready) return

        cmd(0x21)
        cmd(0)
        cmd(127)

        cmd(0x22)
        cmd(0)
        cmd(7)

        for (let p = 0; p < 8; p++) {
            data(p * 128, 128)
        }
    }

    //% block="OLED show"
    //% group="Display"
    export function show(): void {
        display()
    }

    //% block="OLED draw pixel x $x y $y"
    //% group="Drawing"
    export function drawPixel(x: number, y: number): void {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return

        let index = x + Math.idiv(y, 8) * WIDTH
        let mask = 1 << (y % 8)
        buffer[index] = buffer[index] | mask
    }

    //% block="OLED clear pixel x $x y $y"
    //% group="Drawing"
    export function clearPixel(x: number, y: number): void {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return

        let index = x + Math.idiv(y, 8) * WIDTH
        let mask = 1 << (y % 8)
        buffer[index] = buffer[index] & ~mask
    }

    //% block="OLED pixel x $x y $y on $on"
    //% on.defl=true
    //% group="Drawing"
    export function pixel(x: number, y: number, on: boolean = true): void {
        if (on) drawPixel(x, y)
        else clearPixel(x, y)
    }

    //% block="OLED draw line x0 $x0 y0 $y0 x1 $x1 y1 $y1"
    //% group="Drawing"
    export function drawLine(x0: number, y0: number, x1: number, y1: number): void {
        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy

        while (true) {
            drawPixel(x0, y0)

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

    //% block="OLED line x0 $x0 y0 $y0 x1 $x1 y1 $y1"
    //% group="Drawing"
    export function line(x0: number, y0: number, x1: number, y1: number): void {
        drawLine(x0, y0, x1, y1)
    }

    //% block="OLED draw fast horizontal line x $x y $y width $w"
    //% group="Drawing"
    export function drawFastHLine(x: number, y: number, w: number): void {
        for (let i = x; i < x + w; i++) {
            drawPixel(i, y)
        }
    }

    //% block="OLED draw fast vertical line x $x y $y height $h"
    //% group="Drawing"
    export function drawFastVLine(x: number, y: number, h: number): void {
        for (let i = y; i < y + h; i++) {
            drawPixel(x, i)
        }
    }

    //% block="OLED draw rect x $x y $y width $w height $h"
    //% group="Shapes"
    export function drawRect(x: number, y: number, w: number, h: number): void {
        drawFastHLine(x, y, w)
        drawFastHLine(x, y + h - 1, w)
        drawFastVLine(x, y, h)
        drawFastVLine(x + w - 1, y, h)
    }

    //% block="OLED rect x $x y $y width $w height $h"
    //% group="Shapes"
    export function rect(x: number, y: number, w: number, h: number): void {
        drawRect(x, y, w, h)
    }

    //% block="OLED fill rect x $x y $y width $w height $h"
    //% group="Shapes"
    export function fillRect(x: number, y: number, w: number, h: number): void {
        for (let yy = y; yy < y + h; yy++) {
            drawFastHLine(x, yy, w)
        }
    }

    //% block="OLED draw circle x $x y $y radius $r"
    //% group="Shapes"
    export function drawCircle(x0: number, y0: number, r: number): void {
        let f = 1 - r
        let ddF_x = 1
        let ddF_y = -2 * r
        let x = 0
        let y = r

        drawPixel(x0, y0 + r)
        drawPixel(x0, y0 - r)
        drawPixel(x0 + r, y0)
        drawPixel(x0 - r, y0)

        while (x < y) {
            if (f >= 0) {
                y--
                ddF_y += 2
                f += ddF_y
            }

            x++
            ddF_x += 2
            f += ddF_x

            drawPixel(x0 + x, y0 + y)
            drawPixel(x0 - x, y0 + y)
            drawPixel(x0 + x, y0 - y)
            drawPixel(x0 - x, y0 - y)
            drawPixel(x0 + y, y0 + x)
            drawPixel(x0 - y, y0 + x)
            drawPixel(x0 + y, y0 - x)
            drawPixel(x0 - y, y0 - x)
        }
    }

    //% block="OLED circle x $x y $y radius $r"
    //% group="Shapes"
    export function circle(x: number, y: number, r: number): void {
        drawCircle(x, y, r)
    }

    //% block="OLED fill circle x $x y $y radius $r"
    //% group="Shapes"
    export function fillCircle(x0: number, y0: number, r: number): void {
        drawFastVLine(x0, y0 - r, 2 * r + 1)

        let f = 1 - r
        let ddF_x = 1
        let ddF_y = -2 * r
        let x = 0
        let y = r

        while (x < y) {
            if (f >= 0) {
                y--
                ddF_y += 2
                f += ddF_y
            }

            x++
            ddF_x += 2
            f += ddF_x

            drawFastVLine(x0 + x, y0 - y, 2 * y + 1)
            drawFastVLine(x0 - x, y0 - y, 2 * y + 1)
            drawFastVLine(x0 + y, y0 - x, 2 * x + 1)
            drawFastVLine(x0 - y, y0 - x, 2 * x + 1)
        }
    }

    //% block="OLED draw triangle x0 $x0 y0 $y0 x1 $x1 y1 $y1 x2 $x2 y2 $y2"
    //% group="Shapes"
    export function drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): void {
        drawLine(x0, y0, x1, y1)
        drawLine(x1, y1, x2, y2)
        drawLine(x2, y2, x0, y0)
    }

    //% block="OLED fill triangle x0 $x0 y0 $y0 x1 $x1 y1 $y1 x2 $x2 y2 $y2"
    //% group="Shapes"
    export function fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): void {
        drawLine(x0, y0, x1, y1)
        drawLine(x1, y1, x2, y2)
        drawLine(x2, y2, x0, y0)

        let minX = Math.min(x0, Math.min(x1, x2))
        let maxX = Math.max(x0, Math.max(x1, x2))
        let minY = Math.min(y0, Math.min(y1, y2))
        let maxY = Math.max(y0, Math.max(y1, y2))

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                let a = ((y1 - y2) * (x - x2) + (x2 - x1) * (y - y2))
                let b = ((y2 - y0) * (x - x2) + (x0 - x2) * (y - y2))
                let c = ((y0 - y1) * (x - x1) + (x1 - x0) * (y - y1))

                if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0)) {
                    drawPixel(x, y)
                }
            }
        }
    }

    //% block="OLED draw round rect x $x y $y width $w height $h radius $r"
    //% group="Shapes"
    export function drawRoundRect(x: number, y: number, w: number, h: number, r: number): void {
        drawFastHLine(x + r, y, w - 2 * r)
        drawFastHLine(x + r, y + h - 1, w - 2 * r)
        drawFastVLine(x, y + r, h - 2 * r)
        drawFastVLine(x + w - 1, y + r, h - 2 * r)

        drawCircle(x + r, y + r, r)
        drawCircle(x + w - r - 1, y + r, r)
        drawCircle(x + r, y + h - r - 1, r)
        drawCircle(x + w - r - 1, y + h - r - 1, r)
    }

    //% block="OLED fill round rect x $x y $y width $w height $h radius $r"
    //% group="Shapes"
    export function fillRoundRect(x: number, y: number, w: number, h: number, r: number): void {
        fillRect(x + r, y, w - 2 * r, h)
        fillCircle(x + r, y + r, r)
        fillCircle(x + w - r - 1, y + r, r)
        fillCircle(x + r, y + h - r - 1, r)
        fillCircle(x + w - r - 1, y + h - r - 1, r)
    }

    // Small 5x7 font
    const font = "0000005F000003000300147F147F14242A7F2A12231308646236495522500005030000001C2241000041221C00082A1C2A0808083E0808005030000008080808006060000201008040231514946027951493606494949360030710907003636494936064949291E003F4444443F417F4141417F494949413E414141227F494949363E4141413E7F494949367F484848407F090909013E4149492E7F0808087F00417F41002040413F017F081422417F404040407F0204027F7F0408107F3E4141413E7F090909063E4151215E7F09192946364949492601017F01013F4040403F1F2040201F7F2018207F631408146303047804036364949413E41454951413E0101017F0040407F40420408702040413F3F4038403F631408146007027047000000000000"

    function drawChar(ch: string, x: number, y: number): void {
        let code = ch.charCodeAt(0)

        if (code < 32 || code > 90) {
            code = 32
        }

        let idx = (code - 32) * 5

        for (let col = 0; col < 5; col++) {
            let hex = font.substr((idx + col) * 2, 2)
            let v = parseInt(hex, 16)

            for (let row = 0; row < 7; row++) {
                if ((v >> row) & 1) {
                    if (textSize <= 1) {
                        drawPixel(x + col, y + row)
                    } else {
                        fillRect(x + col * textSize, y + row * textSize, textSize, textSize)
                    }
                }
            }
        }
    }

    //% block="OLED set cursor x $x y $y"
    //% group="Text"
    export function setCursor(x: number, y: number): void {
        cursorX = x
        cursorY = y
    }

    //% block="OLED set text size $size"
    //% size.defl=1
    //% group="Text"
    export function setTextSize(size: number): void {
        if (size < 1) size = 1
        textSize = size
    }

    //% block="OLED print $text"
    //% group="Text"
    export function print(text: string): void {
        text = text.toUpperCase()

        for (let i = 0; i < text.length; i++) {
            let ch = text.charAt(i)

            if (ch == "\n") {
                cursorX = 0
                cursorY += 8 * textSize
            } else {
                drawChar(ch, cursorX, cursorY)
                cursorX += 6 * textSize
            }
        }
    }

    //% block="OLED text $text x $x y $y"
    //% group="Text"
    export function text(text: string, x: number, y: number): void {
        setCursor(x, y)
        print(text)
    }

    //% block="OLED big text $text x $x y $y"
    //% group="Text"
    export function bigText(text: string, x: number, y: number): void {
        let oldSize = textSize
        setTextSize(2)
        text(text, x, y)
        setTextSize(oldSize)
    }

    //% block="OLED draw bitmap x $x y $y width $w height $h bitmap $bitmap"
    //% group="Bitmap"
    export function drawBitmap(x: number, y: number, w: number, h: number, bitmap: number[]): void {
        let byteIndex = 0
        let bitIndex = 0

        for (let yy = 0; yy < h; yy++) {
            for (let xx = 0; xx < w; xx++) {
                let byteVal = bitmap[byteIndex]
                if ((byteVal >> (7 - bitIndex)) & 1) {
                    drawPixel(x + xx, y + yy)
                }

                bitIndex++

                if (bitIndex == 8) {
                    bitIndex = 0
                    byteIndex++
                }
            }
        }
    }

    //% block="OLED invert display $invert"
    //% invert.defl=true
    //% group="Display"
    export function invertDisplay(invert: boolean): void {
        if (invert) {
            cmd(0xA7)
        } else {
            cmd(0xA6)
        }
    }

    //% block="OLED dim display $dim"
    //% dim.defl=true
    //% group="Display"
    export function dim(dim: boolean): void {
        cmd(0x81)

        if (dim) {
            cmd(0x00)
        } else {
            cmd(0xCF)
        }
    }

    //% block="OLED status title $title value $value"
    //% group="Dashboards"
    export function status(title: string, value: string): void {
        clearDisplay()
        drawRect(0, 0, 128, 64)
        text(title, 4, 6)
        drawLine(0, 18, 127, 18)
        text(value, 4, 30)
        display()
    }

    //% block="OLED bar value $value max $max label $label"
    //% max.defl=1023
    //% group="Dashboards"
    export function bar(value: number, max: number, label: string): void {
        if (value < 0) value = 0
        if (value > max) value = max

        let w = Math.idiv(value * 118, max)

        clearDisplay()
        text(label, 4, 4)
        drawRect(4, 24, 120, 16)
        fillRect(5, 25, w, 14)
        text("" + value, 4, 48)
        display()
    }

    //% block="OLED gauge value $value max $max label $label"
    //% max.defl=1023
    //% group="Dashboards"
    export function gauge(value: number, max: number, label: string): void {
        if (value < 0) value = 0
        if (value > max) value = max

        let angle = 180 - Math.idiv(value * 180, max)
        let cx = 64
        let cy = 54

        clearDisplay()
        text(label, 4, 2)
        drawCircle(cx, cy, 34)
        drawLine(cx - 34, cy, cx + 34, cy)

        let rad = angle * 3.14159 / 180
        let x2 = cx + Math.round(Math.cos(rad) * 28)
        let y2 = cy - Math.round(Math.sin(rad) * 28)

        drawLine(cx, cy, x2, y2)
        text("" + value, 48, 20)
        display()
    }

    //% block="OLED explosion"
    //% group="Animations"
    export function explosion(): void {
        for (let r = 2; r < 35; r += 4) {
            clearDisplay()
            drawCircle(64, 32, r)

            for (let i = 0; i < 35; i++) {
                drawPixel(randint(20, 108), randint(4, 60))
            }

            bigText("CRASH", 34, 25)
            display()
            basic.pause(80)
        }
    }

    //% block="OLED wave"
    //% group="Animations"
    export function wave(): void {
        clearDisplay()

        for (let x = 0; x < 128; x++) {
            let y = 32 + Math.round(15 * Math.sin(x / 8))
            drawPixel(x, y)
        }

        display()
    }

    //% block="OLED radar sweep"
    //% group="Animations"
    export function radar(): void {
        for (let a = 0; a < 360; a += 20) {
            clearDisplay()
            drawCircle(64, 32, 28)
            drawCircle(64, 32, 18)

            let rad = a * 3.14159 / 180
            let x = 64 + Math.round(Math.cos(rad) * 28)
            let y = 32 + Math.round(Math.sin(rad) * 28)

            drawLine(64, 32, x, y)
            display()
            basic.pause(60)
        }
    }

    //% block="OLED smiley blink"
    //% group="Animations"
    export function smileyBlink(): void {
        clearDisplay()
        drawCircle(64, 32, 28)
        fillCircle(52, 24, 3)
        fillCircle(76, 24, 3)
        drawLine(50, 44, 78, 44)
        drawLine(48, 42, 50, 44)
        drawLine(78, 44, 80, 42)
        display()
        basic.pause(1000)

        clearDisplay()
        drawCircle(64, 32, 28)
        drawLine(48, 24, 56, 24)
        drawLine(72, 24, 80, 24)
        drawLine(50, 44, 78, 44)
        drawLine(48, 42, 50, 44)
        drawLine(78, 44, 80, 42)
        display()
        basic.pause(200)
    }
}
