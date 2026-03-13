import type { Feature, Geometry, FeatureCollection, Point } from "geojson";

export function findFeaturesAtSameLocation(
  geojson: FeatureCollection<Geometry>
): Record<string, Feature<Geometry>[]> {

  const featuresByLocation: Record<string, Feature<Geometry>[]> = {};

  geojson.features.forEach((feature) => {

    if (feature.geometry?.type === "Point") {

      const coords = (feature.geometry as Point).coordinates;
      const key = `${coords[0]},${coords[1]}`;

      if (!featuresByLocation[key]) {
        featuresByLocation[key] = [];
      }

      featuresByLocation[key].push(feature);

    }

  });

  return featuresByLocation;
}