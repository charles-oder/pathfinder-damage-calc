export class DieConfig {
  public name = "unnamed";
  public dieString = "1d6";
}

export class DieGroup {
  public name = "New Group";
  public dice: DieConfig[] = [new DieConfig()];
}

export class DieCollectionConfig {
  public groups: DieGroup[] = [new DieGroup()];
}

export class LegacyDieCollectionConfig {
  public dice: DieConfig[] = [];
}

export class LegacyDieCollectionConfigV2 {
  public groups: Record<string, DieConfig[]> = {
    "group 1": [new DieConfig()]
  };
}
