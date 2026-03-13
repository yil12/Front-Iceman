export const DATASETS = {
  waves: {
    name: "Olas",
    api: "ICEMAN-METEO",
    marker: "circle-red"
  },
  winds: {
    name: "Viento",
    api: "ICEMAN-OCEAN",
    marker: "circle-blue"
  },
  salinity: {
    name: "Salinidad",
    api: "ICEMAN-SALINIDAD",
    marker: "circle-green"
  }
} as const;

export type DatasetKey = keyof typeof DATASETS;