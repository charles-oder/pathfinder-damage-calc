import DieRoller from "@/dice/die-roller";
import Logger from "@/logging/logger";

export default class MultiDieRoller {
  private dieRoller: DieRoller;

  constructor(dieRoller: DieRoller = new DieRoller()) {
    this.dieRoller = dieRoller;
  }

  roll(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < Math.abs(count); i++) {
      total += this.dieRoller.rollD(sides);
    }
    if (count < 0) {
      total *= -1;
    }
    return total;
  }

  rollDieString(dieString: string): number {
    let total = 0;
    const trimmed = dieString.replace(/ /g, "");
    const dieSets = trimmed.replace(/-/g, "+-").split("+");
    dieSets.forEach(die => {
      total += this.rollSingleDie(die);
    });
    return total;
  }

  rollDieStringWithBreakdown(dieString: string): number[] {
    let total = 0;
    const output = [];
    const dieSets = this.splitDieRolls(dieString);
    dieSets.forEach(die => {
      const roll = this.rollSingleDie(die);
      output.push(roll);
      total += roll;
    });
    output.push(total);
    return output;
  }

  private splitDieRolls(dieString: string): string[] {
    const output: string[] = [];
    const trimmed = dieString.replace(/ /g, "");
    const dieSets = trimmed.replace(/-/g, "+-").split("+");
    dieSets.forEach(die => {
      const components = die.split("d");
      if (components.length == 1) {
        output.push(components[0]);
        return;
      }
      const count = parseInt(components[0]);
      const sides = parseInt(components[1]);
      for (let i = 0; i < Math.abs(count); i++) {
        const str = (count >= 0 ? "" : "-") + "1d" + sides;
        output.push(str);
      }
    });
    return output;
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
