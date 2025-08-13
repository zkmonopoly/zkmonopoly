export const FeatureList = <const>["ZKSHUFFLE"];
export type Feature = typeof FeatureList[number];

export class FeatureFlagService {
  private static featureMap = new Map<Feature, Boolean>();

  static {
    FeatureList.forEach((feature) => {
      const featureDisabled = process.env["FLAG_" + feature] === "false";
      this.featureMap.set(feature, featureDisabled);
    });
  }
  
  static isDisabled(feature: Feature) {
    return this.featureMap.get(feature);
  }
}