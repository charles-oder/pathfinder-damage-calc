import AttackResolver from "./attack-resolver";
import MultiDieRoller from "@/dice/multi-die-roller";
import { FullAttackResult } from "./attack-result";

export default class IterativeAttackResolver {
  private iterations: number;
  private attackResolver = new AttackResolver();

  constructor(iterations: number) {
    this.iterations = iterations;
  }

  resolveFullAttack(
    targetAc: number,
    attackBonuses: string,
    critThreshold: number,
    critMult: number,
    damage: string,
    damageMod:
      | ((attack: number, hit: number, roller: MultiDieRoller) => () => number)
      | null = null
  ): FullAttackResult {
    const results = new FullAttackResult();
    for (let i = 0; i < this.iterations; i++) {
      results.merge(
        this.attackResolver.resolveFullAttack(
          targetAc,
          attackBonuses,
          critThreshold,
          critMult,
          damage,
          damageMod
        )
      );
    }
    return results;
  }
}
