import DieRoller from '@/dice/die-roller'

export default class MockDieRoller extends DieRoller {

    sidesArgs: number[] = []
    private mockValues = new Map<number, number[]>()

    setMockValue(die: number, value: number[]) {
        this.mockValues.set(die, value)
    }

    rollD(sides: number): number {
        this.sidesArgs.push(sides)
        const value = this.mockValues.get(sides)?.shift()
        if (value) {
            return value
        }
        return 0
    }
}