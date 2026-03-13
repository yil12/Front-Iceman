import type { GeojsonProps } from "../interface/geojson.interface";
import { stationCache } from "../cache/stationCache";

const API_URL = "https://api-dimar.onrender.com/";

export async function getYears(dataset: string): Promise<string[] | null> {

    try {

        const res = await fetch(`${API_URL}${dataset}/anios`, {
            headers: { Accept: "application/json" }
        });

        if (!res.ok) {
            console.error("Error fetching years");
            return null;
        }

        const data = await res.json();

        return data.anios;

    } catch (err) {

        console.error(err);
        return null;

    }

}


export async function getStationsByYear(
    dataset: string,
    year: string
): Promise<GeojsonProps | null> {

    if (stationCache[year]) {
        return stationCache[year];
    }

    try {

        const res = await fetch(
            `${API_URL}${dataset}/anio/${year}/estaciones`,
            { headers: { Accept: "application/json" } }
        );

        if (!res.ok) {
            console.error("Error fetching stations");
            return null;
        }

        const geojson = await res.json();

        const data: GeojsonProps = {
            rangeDate: geojson.anio.toString(),
            fileName: `Iceman-Ocean ${geojson.anio}`,
            markerShape: "circle-blue",
            geojson: {
                type: "FeatureCollection",
                features: geojson.features
            }
        };

        stationCache[year] = data;

        return data;

    } catch (err) {

        console.error(err);
        return null;

    }

}


