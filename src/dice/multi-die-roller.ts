import DieRoller from "@/dice/die-roller";
import Logger from "@/logging/logger";

export default class MultiDieRoller {
  private dieRoller: DieRoller;

  constructor(dieRoller: DieRoller = new DieRoller()) {
    this.dieRoller = dieRoller;
  }

  roll(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += this.dieRoller.rollD(sides);
    }
    return total;
  }

  rollDieString(dieString: string): number {
    let total = 0;
    const dieSets = dieString.split("+");
    dieSets.forEach(die => {
      total += this.rollSingleDie(die);
    });
    return total;
  }

  private rollSingleDie(dieString: string): number {
    const components = dieString.split("d");
    if (components.length == 1) {
      return parseInt(components[0]);
    }
    const count = parseInt(components[0]);
    const sides = parseInt(components[1]);
    Logger.log("count: " + count + " sides: " + sides);
    return this.roll(count, sides);
  }
}
