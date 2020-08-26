import { expect } from 'chai'
import DieRoller from '@/dice/die-roller'

describe('die-roller.ts', () => {
    it('d1 always rolls 1', () => {
        const testObject = new DieRoller()

        const actualValue = testObject.rollD(1);

        expect(actualValue).to.equal(1);
    }),
    it('d6 always rolls 1-6', () => {
        const testObject = new DieRoller()
        for (let i = 0; i < 100; i++) {
            const actualValue = testObject.rollD(6);

            expect(actualValue >= 1)
            expect(actualValue <= 6)
        }
    }),
    it('d6 rolls variety of 1-6', () => {
        const testObject = new DieRoller()
        const counts: number[] = new Array(6).fill(0);

        let maxRoll = 0;
        let minRoll = 20;
        for (let i = 0; i < 1000000; i++) {
            const actualValue = testObject.rollD(6);
            maxRoll = Math.max(maxRoll, actualValue)
            minRoll = Math.min(minRoll, actualValue)
            counts[actualValue - 1]++
        }
        let maxCount = 0;
        let minCount = Number.MAX_SAFE_INTEGER;
        counts.forEach((e) => {
            maxCount = Math.max(maxCount, e);
            minCount = Math.min(minCount, e);
        });
        expect(maxRoll).to.equal(6);
        expect(minRoll).to.equal(1);
        expect(maxCount / minCount).to.lessThan(1.02)
        expect(maxCount / minCount).to.greaterThan(0.98)
    }),
    it('d20 rolls variety of 1-20', () => {
        const testObject = new DieRoller()
        const counts: number[] = new Array(20).fill(0);

        let maxRoll = 0;
        let minRoll = 20;
        for (let i = 0; i < 1000000; i++) {
            const actualValue = testObject.rollD(20);
            maxRoll = Math.max(maxRoll, actualValue)
            minRoll = Math.min(minRoll, actualValue)
            counts[actualValue - 1]++
        }
        let maxCount = 0;
        let minCount = Number.MAX_SAFE_INTEGER;

        counts.forEach((e) => {
            maxCount = Math.max(maxCount, e);
            minCount = Math.min(minCount, e);
        });
        expect(maxRoll).to.equal(20);
        expect(minRoll).to.equal(1);
        expect(maxCount / minCount).to.lessThan(1.02)
        expect(maxCount / minCount).to.greaterThan(0.98)
    })

})
