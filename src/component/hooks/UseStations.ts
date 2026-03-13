import { useState } from "react";
import { getStationsByYear } from "../../request/get-years";
import type { GeojsonProps } from "../../interface/geojson.interface";

export function useStations() {

  const [loading, setLoading] = useState(false);

  const loadStations = async (
     dataset: string,
    year: string
  ): Promise<GeojsonProps | null> => {

    setLoading(true);

    const data = await getStationsByYear( dataset,year);

    setLoading(false);

    return data;

  };

  return {
    loadStations,
    loading
  };

}