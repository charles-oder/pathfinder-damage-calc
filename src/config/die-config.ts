export class DieCollectionConfig {
  public static default: DieCollectionConfig = {dice: [{ name: "unnamed", dieString: "1d6" }]};
  public dice?: DieConfig[];
}

export class DieConfig {
  public static default: DieConfig = { name: "unnamed", dieString: "1d6" };
  public name?: string;
  public dieString?: string;
}