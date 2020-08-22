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

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(expectedValue);
        expect(actualValue.isHit).false;
        expect(actualValue.isCrit).false;
    }),
    it('below AC roll with bonus over AC returns damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 1, 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(expectedValue);
        expect(actualValue.isHit).true;
        expect(actualValue.isCrit).false;
    }),
    it('natural 1 misses', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 0;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [1]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 10, 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(expectedValue);
        expect(actualValue.isHit).false;
        expect(actualValue.isCrit).false;
    }),
    it('natural 20 always hits', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 1]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(40, 10, 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(expectedValue);
        expect(actualValue.isHit).true
        expect(actualValue.isCrit).false;
    }),
    it('unconfirmed crit rolls normal damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 0, 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(expectedValue);
        expect(actualValue.isHit).true
        expect(actualValue.isCrit).false;
    }),
    it('confirmed crit rolls multiplier damage', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 2;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [20, 10]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1]);

        const actualValue = testObject.resolveSingleAttack(10, 0, 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.baseDamage).to.equal(1);
        expect(actualValue.isHit).true
        expect(actualValue.isCrit).true;
    }),
    it('full attack all hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 2;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9, 9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1]);

        const actualValue = testObject.resolveFullAttack(10, '+6/+1', 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(2);
        expect(actualValue.totalAttacks).to.equal(2);
        expect(actualValue.totalHits).to.equal(2);
        expect(actualValue.totalCrits).to.equal(0);
    }),
    it('full attack half hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 1;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [4, 4]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1]);

        const actualValue = testObject.resolveFullAttack(10, '+6/+1', 20, 2, '1d6')

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(expectedValue);
        expect(actualValue.totalAttacks).to.equal(2);
        expect(actualValue.totalHits).to.equal(1);
        expect(actualValue.totalCrits).to.equal(0);
    }),
    it('jabbing style mod all hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 7;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9, 9, 9, 9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1, 1, 1, 1, 1, 1, 1]);
        const mod = AttackResolver.createModFromString('hit > 1:1d6');

        const actualValue = testObject.resolveFullAttack(10, '+6/+6/+1/+1', 20, 2, '1d6', mod)

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(expectedValue);
        expect(actualValue.totalAttacks).to.equal(4);
        expect(actualValue.totalHits).to.equal(4);
        expect(actualValue.totalCrits).to.equal(0);
    }),
    it('jabbing style mod half hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 3;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [4, 4, 4, 4]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1, 1, 1, 1, 1, 1, 1]);
        const mod = AttackResolver.createModFromString('hit > 1:1d6');

        const actualValue = testObject.resolveFullAttack(10, '+6/+6/+1/+1', 20, 2, '1d6', mod)

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(expectedValue);
        expect(actualValue.totalAttacks).to.equal(4);
        expect(actualValue.totalHits).to.equal(2);
        expect(actualValue.totalCrits).to.equal(0);
    }),
    it('jabbing master mod all hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 14;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [9, 9, 9, 9]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1, 1, 1, 1]);
        mockDieRoller.rollDieStringReturnValues.set('2d6', [2, 2]);
        mockDieRoller.rollDieStringReturnValues.set('4d6', [4, 4, 4]);
        const mod = AttackResolver.createModFromString('hit > 2:4d6;hit > 1:2d6');

        const actualValue = testObject.resolveFullAttack(10, '+6/+6/+1/+1', 20, 2, '1d6', mod)

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(expectedValue);
        expect(actualValue.totalAttacks).to.equal(4);
        expect(actualValue.totalHits).to.equal(4);
        expect(actualValue.totalCrits).to.equal(0);
    }),
    it('jabbing master mod half hit', () => {
        const mockDieRoller = new MockMultiDieRoller();
        const testObject = new AttackResolver(mockDieRoller);
        const expectedValue = 4;
        mockDieRoller.rollDieStringReturnValues.set('1d20', [4, 4, 4, 4]);
        mockDieRoller.rollDieStringReturnValues.set('1d6', [1, 1, 1, 1, 1]);
        mockDieRoller.rollDieStringReturnValues.set('2d6', [2, 2]);
        mockDieRoller.rollDieStringReturnValues.set('4d6', [4, 4, 4]);
        const mod = AttackResolver.createModFromString('hit > 2:4d6;hit > 1:2d6');

        const actualValue = testObject.resolveFullAttack(10, '+6/+6/+1/+1', 20, 2, '1d6', mod)

        expect(actualValue.totalDamage).to.equal(expectedValue);
        expect(actualValue.totalBaseDamage).to.equal(expectedValue);
        expect(actualValue.totalAttacks).to.equal(4);
        expect(actualValue.totalHits).to.equal(2);
        expect(actualValue.totalCrits).to.equal(0);
    })
})
