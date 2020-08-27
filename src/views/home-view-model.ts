import { FullAttackResultSet } from "@/attack/attack-result";
import AttackResolver from "@/attack/attack-resolver";
import SimSettings from "@/config/sim-settings";
import AttackSettings from "@/config/attack-settings";

export default class HomeViewModel {
  simSettings = new SimSettings();
  attackSettings = [
    new AttackSettings(),
    new AttackSettings(),
    new AttackSettings()
  ];
  resultSet = new FullAttackResultSet();
  buttonTitle = "Calculate";
  resolvers: Array<AttackResolver> = [];
  running = false;
  startTime = 0;
  lapTime = 0;

  constructor() {
    this.attackSettings[0].color = "#BBDB9B";
    this.attackSettings[0].name = "BASE";
    this.attackSettings[1].color = "#ABC4A1";
    this.attackSettings[1].name = "OPTION 1";
    this.attackSettings[2].color = "#9DB4AB";
    this.attackSettings[2].name = "OPTION 2";
  }

  startTimer() {
    this.startTime = new Date().getTime();
    this.lapTime = this.startTime;
  }

  printTimer(name: string, end = false) {
    const endTime = new Date().getTime();
    const runningTime = (
      (endTime - (end ? this.startTime : this.lapTime)) /
      1000
    ).toFixed(3);
    this.lapTime = endTime;

    // eslint-diable-next-line
    console.log(name + " completed in " + runningTime + " seconds");
  }

  killTimeouts() {
    const highestTimeoutId = setTimeout(";");
    for (let id = 0; id < highestTimeoutId; id++) {
      clearTimeout(id);
    }
  }

  runJob(ac: number, iteration: number, batchSize: number) {
    const totalIterations = parseInt(this.simSettings.iterations);
    if (iteration >= totalIterations) {
      this.printTimer("AC " + ac);
      ac++;
      iteration = 0;
    }
    if (ac > parseInt(this.simSettings.acMax)) {
      this.printTimer("Job", true);
      this.buttonTitle = "Calculate";
      this.running = false;
      return;
    }
    const index = ac - parseInt(this.simSettings.acMin);

    this.buttonTitle =
      "Calculating (AC: " +
      ac +
      ", iteration: " +
      iteration +
      ")... Click to cancel";
    setTimeout(() => {
      for (let i = 0; i < batchSize; i++) {
        for (let r = 0; r < this.resolvers.length; r++) {
          this.resultSet.addResult(
            index,
            r,
            this.resolvers[r].resolveFullAttack(ac)
          );
        }
      }
      this.runJob(ac, iteration + batchSize, batchSize);
    }, 0);
  }

  caclulateClicked() {
    this.startTimer();
    if (this.running) {
      this.running = false;
      this.killTimeouts();
      this.buttonTitle = "Calculate";
      return;
    }
    this.running = true;
    this.simSettings.save();
    this.attackSettings[0].save();
    this.resultSet.colors = this.attackSettings.map(setting => {
      return setting.color;
    });
    this.resultSet.reset();

    this.resolvers = this.attackSettings.map(setting => {
      return new AttackResolver(setting);
    });

    this.buttonTitle = "Starting run...";
    const batchSize = Math.max(
      Math.min(parseInt(this.simSettings.iterations) / 100, 1000),
      1
    );
    // eslint-diable-next-line
    console.log("Starting Run (Batch Size: " + batchSize + ")");
    this.runJob(parseInt(this.simSettings.acMin), 0, batchSize);
  }
}
