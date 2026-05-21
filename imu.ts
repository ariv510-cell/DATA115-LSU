// Data115 IMU helpers.
// These blocks use the micro:bit built-in accelerometer.
// For external MPU6050 modules, use MakeCode's SENMPU6050 extension separately, or add it as a future dependency.

//% color="#9B59B6" icon="\uf135" block="Data115 IMU"
namespace Data115IMU {
    //% block="built in tilt X"
    export function tiltX(): number {
        return input.acceleration(Dimension.X)
    }

    //% block="built in tilt Y"
    export function tiltY(): number {
        return input.acceleration(Dimension.Y)
    }

    //% block="built in tilt Z"
    export function tiltZ(): number {
        return input.acceleration(Dimension.Z)
    }

    //% block="tilt direction threshold $threshold"
    //% threshold.defl=300
    export function tiltDirection(threshold: number = 300): string {
        let x = input.acceleration(Dimension.X)
        let y = input.acceleration(Dimension.Y)
        if (x > threshold) return "RIGHT"
        if (x < -threshold) return "LEFT"
        if (y > threshold) return "DOWN"
        if (y < -threshold) return "UP"
        return "FLAT"
    }

    //% block="shake strength"
    export function shakeStrength(): number {
        let x = Math.abs(input.acceleration(Dimension.X))
        let y = Math.abs(input.acceleration(Dimension.Y))
        let z = Math.abs(input.acceleration(Dimension.Z) - 1024)
        return x + y + z
    }

    //% block="impact detected threshold $threshold"
    //% threshold.defl=1800
    export function impactDetected(threshold: number): boolean {
        return shakeStrength() > threshold
    }
}
