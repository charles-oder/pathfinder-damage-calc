import MultiDieRoller from '@/dice/multi-die-roller';

export default class MockMultiDieRoller extends MultiDieRoller {
    
    rollDieStringReturnValues = new Map<string, number[]>()
    rollDieStringArguments = new Array<string>();

    rollDieString(dieString: string): number {
        this.rollDieStringArguments.push(dieString);
        const value = this.rollDieStringReturnValues.get(dieString)?.shift();
        if (value) {
            return value;
        }
        return 0
    }
}