import { expect } from 'chai'

import MultiDieRoller from '@/dice/multi-die-roller'
import MockDieRoller from './mock-die-roller'

describe('multi-die-roller.ts', () => {
    it('rolls 2 dice', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(1)
        const testObject = new MultiDieRoller(mockDieRoller)
        const expectedValue = 2

        const actualValue = testObject.roll(2, 6)
        const passedArg = mockDieRoller.lastSidesArg

        expect(actualValue).to.equal(expectedValue)
        expect(passedArg).to.equal(6)
    }),
    it('rolls 3 dice', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(1)
        const testObject = new MultiDieRoller(mockDieRoller)
        const expectedValue = 3

        const actualValue = testObject.roll(3, 10)
        const passedArg = mockDieRoller.lastSidesArg

        expect(actualValue).to.equal(expectedValue)
        expect(passedArg).to.equal(10)
    }),
    it('rolls 2 dice from string', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(1)
        const testObject = new MultiDieRoller(mockDieRoller)
        const expectedValue = 2

        const actualValue = testObject.rollDieString('2d6')
        const passedArg = mockDieRoller.lastSidesArg

        expect(actualValue).to.equal(expectedValue)
        expect(passedArg).to.equal(6)
    }),
    it('rolls 3 dice from string', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(1)
        const testObject = new MultiDieRoller(mockDieRoller)
        const expectedValue = 3

        const actualValue = testObject.rollDieString('3d10')
        const passedArg = mockDieRoller.lastSidesArg

        expect(actualValue).to.equal(expectedValue)
        expect(passedArg).to.equal(10)
    }),
    it('returns value of static number', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(5)
        const testObject = new MultiDieRoller(mockDieRoller)
        const expectedValue = 5

        const actualValue = testObject.rollDieString('5')
        const passedArg = mockDieRoller.lastSidesArg

        expect(actualValue).to.equal(expectedValue)
    })
})
