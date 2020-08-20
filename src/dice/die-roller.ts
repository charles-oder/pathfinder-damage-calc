export default class DieRoller {

    rollD(sides: number): number {
        return 1 + Math.floor(Math.random() * sides);
    }

 }