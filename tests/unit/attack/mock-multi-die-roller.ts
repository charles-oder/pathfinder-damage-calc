import MultiDieRoller from '@/dice/multi-die-roller'
import Logger from '@/logging/logger'

export default class MockMultiDieRoller extends MultiDieRoller {
    
    rollDieStringReturnValues = new Map<string, number[]>()
    rollDieStringArguments = new Array<string>()

    rollDieString(dieString: string): number {
        Logger.mock('Rolling ' + dieString)
        this.rollDieStringArguments.push(dieString)
        const value = this.rollDieStringReturnValues.get(dieString)?.shift()
        if (!value && !dieString.includes('d')) {
            return parseInt(dieString)
        }
        Logger.mock('Result ' + value)
        if (value) {
            return value
        }
        return 0
    }
}