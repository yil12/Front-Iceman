import type { FeatureCollection } from "geojson";
import type { DatasetKey } from "../data/dataset";

//import type { Map } from "leaflet";

export type MarkerShape = 'circle-red' | 'circle-blue';

export interface GeojsonProps {
  fileName: string;
  geojson: FeatureCollection;
  rangeDate: string;
  markerShape: MarkerShape;
}


export interface ListGeojsonProps {
  dataset: DatasetKey | null;
  //map: Map | null;
}