import DieRoller from '@/dice/die-roller'

export default class MockDieRoller extends DieRoller {

    private value = 0;
    lastSidesArg = 0;

    setMockValue(value: number) {
        this.value = value;
    }

    rollD(sides: number): number {
        this.lastSidesArg = sides;
        return this.value;
    }
}