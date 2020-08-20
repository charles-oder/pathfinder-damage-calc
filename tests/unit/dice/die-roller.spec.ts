import { expect } from 'chai'
import DieRoller from '@/dice/die-roller'

describe('die-roller.ts', () => {
    it('d1 always rolls 1', () => {
        const testObject = new DieRoller()
        const expectedValue = 1;

        const actualValue = testObject.rollD(1);

        expect(actualValue).to.equal(expectedValue);
    }),
    it('d6 always rolls 1-6', () => {
        const testObject = new DieRoller()
        const expectedValue = 1;
        for (let i = 0; i < 100; i++) {
            const actualValue = testObject.rollD(6);

            expect(actualValue >= 1)
            expect(actualValue <= 6)
        }
    }),
    it('d6 rolls variety of 1-6', () => {
        const testObject = new DieRoller()
        const counts = [0,0,0,0,0,0]

        for (let i = 0; i < 100; i++) {
            const actualValue = testObject.rollD(6);
            counts[actualValue - 1]++
        }
        expect(counts[0]).greaterThan(0)
        expect(counts[1]).greaterThan(0)
        expect(counts[2]).greaterThan(0)
        expect(counts[3]).greaterThan(0)
        expect(counts[4]).greaterThan(0)
        expect(counts[5]).greaterThan(0)
    })

})
