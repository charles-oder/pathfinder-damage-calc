import { expect } from 'chai'
import AttackResolver from '@/attack/attack-resolver'
import MockMultiDieRoller from './mock-multi-die-roller'

describe('attack-resolver.ts', () => {
    it('below AC with no bonus returns 0', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 0;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 0, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    }),
    it('below AC roll with bonus over AC returns damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 1, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    }),
    it('natural 1 misses', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 0;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [1]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 10, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    }),
    it('natural 20 always hits', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 1]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(40, 10, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    }),
    it('unconfirmed crit rolls normal damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 0, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    }),
    it('confirmed crit rolls multiplier damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 2;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 10]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 0, 20, 2, '1d6')

        expect(actualValue).to.equal(expectedValue);
    })
})
