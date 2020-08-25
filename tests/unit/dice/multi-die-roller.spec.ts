import { expect } from 'chai'

import MultiDieRoller from '@/dice/multi-die-roller'
import MockDieRoller from './mock-die-roller'

describe('multi-die-roller.ts', () => {
    it('rolls 2 dice', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(6, [1, 1])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.roll(2, 6)

        expect(actualValue).to.equal(2)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
    }),it('rolls 3 dice', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(10, [1, 1, 1])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.roll(3, 10)

        expect(actualValue).to.equal(3)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(10)
    }),
    it('rolls 2 dice from string', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(6, [1, 1])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('2d6')

        expect(actualValue).to.equal(2)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
    }),
    it('rolls 2 dice from string with bonus', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(6, [1, 1])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('2d6+5')

        expect(actualValue).to.equal(7)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
    }),it('rolls 3 dice from string', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(10, [1, 1, 1])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('3d10')

        expect(actualValue).to.equal(3)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(10)
    }),
    it('returns value of static number', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(0, [5])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('5')

        expect(actualValue).to.equal(5)
        expect(mockDieRoller.sidesArgs.length).to.equal(0)
    }),
    it('rolls 2 die sets', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(4, [2, 2])
        mockDieRoller.setMockValue(6, [2, 2, 2])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('2d4+3d6')

        expect(actualValue).to.equal(10)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(4)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(4)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
    }),
    it('rolls 2 die sets with bonus', () => {
        const mockDieRoller = new MockDieRoller()
        mockDieRoller.setMockValue(4, [2, 2])
        mockDieRoller.setMockValue(6, [2, 2, 2])
        const testObject = new MultiDieRoller(mockDieRoller)

        const actualValue = testObject.rollDieString('2d4+3d6+10')

        expect(actualValue).to.equal(20)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(4)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(4)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
        expect(mockDieRoller.sidesArgs.shift()).to.equal(6)
    })
})
