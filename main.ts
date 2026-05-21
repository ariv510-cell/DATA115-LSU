// Data115 Full Extension
//% color="#1E90FF" icon="\uf1b2" block="Data115"
namespace Data115 {
    //% block="hello Data115"
    export function hello(): void {
        basic.showString("D115")
    }

    //% block="map value $value from low $fromLow high $fromHigh to low $toLow high $toHigh"
    export function mapValue(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number {
        return Math.idiv((value - fromLow) * (toHigh - toLow), (fromHigh - fromLow)) + toLow
    }

    //% block="clamp value $value min $min max $max"
    export function clamp(value: number, min: number, max: number): number {
        if (value < min) return min
        if (value > max) return max
        return value
    }
}
