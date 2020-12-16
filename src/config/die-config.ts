export class DieConfig {
  public name = "unnamed";
  public dieString = "1d6";
}

export class DieGroup {
  public name = "New Group";
  public dice: DieConfig[] = [new DieConfig()];
}

export class DieCollectionConfig {
  public static fromJson(json: string): DieCollectionConfig {
    const jsonObj: DieCollectionConfig = JSON.parse(json);
    const cloneObj = new DieCollectionConfig();
    cloneObj.groups = jsonObj.groups;
    return cloneObj;
  }
  public groups: DieGroup[] = [new DieGroup()];

  public get groupNames(): Array<string> {
    return this.groups.map(group => group.name);
  }
}

export class LegacyDieCollectionConfig {
  public dice?: DieConfig[];
}

export class LegacyDieCollectionConfigV2 {
  public groups: Record<string, DieConfig[]> = {
    "group 1": [new DieConfig()]
  };
}
