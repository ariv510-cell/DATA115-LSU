// Data115 datalogger helpers. Uses the official MakeCode datalogger dependency.

//% color="#FF8C00" icon="\uf201" block="Data115 Logging"
namespace Data115Logging {
    //% block="log value name $name value $value"
    export function logValue(name: string, value: number): void {
        datalogger.log(datalogger.createCV(name, value))
    }

    //% block="log analog name $name pin $pin"
    export function logAnalog(name: string, pin: AnalogPin): void {
        datalogger.log(datalogger.createCV(name, pins.analogReadPin(pin)))
    }

    //% block="log digital name $name pin $pin"
    export function logDigital(name: string, pin: DigitalPin): void {
        datalogger.log(datalogger.createCV(name, pins.digitalReadPin(pin)))
    }

    //% block="log light pin $pin"
    export function logLight(pin: AnalogPin): void {
        datalogger.log(datalogger.createCV("light", pins.analogReadPin(pin)))
    }

    //% block="log sound pin $pin"
    export function logSound(pin: AnalogPin): void {
        datalogger.log(datalogger.createCV("sound", pins.analogReadPin(pin)))
    }

    //% block="log soil pin $pin"
    export function logSoil(pin: AnalogPin): void {
        datalogger.log(datalogger.createCV("soil", pins.analogReadPin(pin)))
    }

    //% block="delete all data logs"
    export function deleteLogs(): void {
        datalogger.deleteLog()
    }
}
