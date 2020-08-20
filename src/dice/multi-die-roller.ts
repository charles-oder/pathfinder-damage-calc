import DieRoller from '@/dice/die-roller'

export default class MultiDieRoller {

    private dieRoller: DieRoller;

    constructor(dieRoller: DieRoller = new DieRoller) {
        this.dieRoller = dieRoller
    }

    roll(count: number, sides: number, bonus = 0): number {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += this.dieRoller.rollD(sides);
        }
        return total + bonus;
    }

    rollDieString(dieString: string): number {
        let bonus = 0;
        const dieAndBonus = dieString.split('+');
        if (dieAndBonus.length > 1) {
            bonus = parseInt(dieAndBonus[1]);
        }
        const components = dieAndBonus[0].split('d');
        if (components.length == 1) {
            return parseInt(components[0]);
        }
        const count = parseInt(components[0]);
        const sides = parseInt(components[1]);
        return this.roll(count, sides, bonus);
    }
}