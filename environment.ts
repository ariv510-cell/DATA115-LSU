// Data115 environment helpers.
// DHT11/DHT22 one-wire timing is difficult in pure MakeCode extensions.
// This file includes simple analog temperature helpers and placeholders for DHT workflows.

//% color="#2ECC71" icon="\uf2c9" block="Data115 Environment"
namespace Data115Environment {
    //% block="analog temperature raw on %pin"
    export function analogTemperatureRaw(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="TMP36 temperature C on %pin"
    export function tmp36C(pin: AnalogPin): number {
        let raw = pins.analogReadPin(pin)
        let millivolts = raw * 3300 / 1023
        return Math.round((millivolts - 500) / 10)
    }

    //% block="TMP36 temperature F on %pin"
    export function tmp36F(pin: AnalogPin): number {
        return Math.round(tmp36C(pin) * 9 / 5 + 32)
    }

    //% block="humidity raw on %pin"
    export function humidityRaw(pin: AnalogPin): number {
        return pins.analogReadPin(pin)
    }

    //% block="humidity percent estimate on %pin"
    export function humidityPercent(pin: AnalogPin): number {
        return Math.idiv(pins.analogReadPin(pin) * 100, 1023)
    }
}
