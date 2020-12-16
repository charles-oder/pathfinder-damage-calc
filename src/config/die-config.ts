export class DieCollectionConfig {
  public static get default(): DieCollectionConfig {
    return { dice: [{ name: "unnamed", dieString: "1d6" }] };
  }
  public dice?: DieConfig[];
}

export class DieConfig {
  public static get default(): DieConfig {
    return { name: "unnamed", dieString: "1d6" };
  }
  public name?: string;
  public dieString?: string;
}
