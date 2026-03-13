import { DATASETS } from "../data/dataset";
import type { DatasetKey } from "../data/dataset";

const API_URL = "https://api-dimar.onrender.com";

export default function downloadExcel(dataset: DatasetKey, year: string) {

  const apiName = DATASETS[dataset].api;

  const url = `${API_URL}/${apiName}/download/${year}`;

  window.open(url, "_blank");
}