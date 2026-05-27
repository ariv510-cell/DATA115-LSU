// DATA115 Arcade helpers

namespace Data115Arcade {
    let selectedGame = 1
    let score = 0

    //% block="arcade game name $game"
    export function gameName(game: number): string {
        if (game == 1) return "FLAPPY"
        if (game == 2) return "SNAKE"
        if (game == 3) return "PONG"
        if (game == 4) return "BREAKOUT"
        if (game == 5) return "INVADERS"
        if (game == 6) return "TETRIS"
        if (game == 7) return "DINO"
        if (game == 8) return "FROGGER"
        if (game == 9) return "2048"
        if (game == 10) return "MEMORY"
        if (game == 11) return "MINES"
        if (game == 12) return "REFLEX"
        if (game == 13) return "RHYTHM"
        if (game == 14) return "TIC TAC"
        if (game == 15) return "RACING"
        if (game == 16) return "SUDOKU"
        return "NONE"
    }

    //% block="arcade selected game"
    export function getSelectedGame(): number {
        return selectedGame
    }

    //% block="arcade selected game name"
    export function selectedGameName(): string {
        return gameName(selectedGame)
    }

    //% block="arcade read keypad game selection"
    export function readKeypadGameSelection(): number {
        let key = Data115Keypad.readButton()
        if (key >= 1 && key <= 16) {
            selectedGame = key
        }
        return selectedGame
    }

    //% block="arcade wait for keypad game selection"
    export function waitForKeypadGameSelection(): number {
        let key = Data115Keypad.waitForButton()
        if (key >= 1 && key <= 16) {
            selectedGame = key
        }
        return selectedGame
    }

    //% block="arcade reset score"
    export function resetScore(): void {
        score = 0
    }

    //% block="arcade add $points points"
    export function addScore(points: number): void {
        score += points
        if (score < 0) score = 0
        if (score > 9999) score = 9999
    }

    //% block="arcade score"
    export function getScore(): number {
        return score
    }

    //% block="rect collision ax $ax ay $ay aw $aw ah $ah bx $bx by $by bw $bw bh $bh"
    export function rectCollision(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
    }

    //% block="arcade flap sound"
    export function flapSound(): void {
        music.playTone(880, music.beat(BeatFraction.Sixteenth))
    }

    //% block="arcade point sound"
    export function pointSound(): void {
        music.playTone(1175, music.beat(BeatFraction.Sixteenth))
    }

    //% block="arcade game over sound"
    export function gameOverSound(): void {
        music.playTone(330, music.beat(BeatFraction.Quarter))
        music.playTone(220, music.beat(BeatFraction.Quarter))
        music.playTone(110, music.beat(BeatFraction.Half))
    }
}
