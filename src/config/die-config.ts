export class DieConfig {
  public name = "unnamed";
  public dieString = "1d6";
}

export class DieCollectionConfig {
  public groups: Record<string, DieConfig[]> = {
    "group 1": [new DieConfig()]
  };
}

export class LegacyDieCollectionConfig {
  public dice: DieConfig[] = [];
}
