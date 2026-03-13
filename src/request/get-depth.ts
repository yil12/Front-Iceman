import type { GeojsonProps } from "../interface/geojson.interface";


const URL_DEPTH_API: string = 'https://api-dimar.onrender.com/';

export async function getYears(): Promise<string[] | null> {
    try {
        const res = await fetch(`${URL_DEPTH_API}ICEMAN-OCEAN/anios`,
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
        if (!res.ok) {
            console.error(`getYears: HTTP ${res.status}`);
            return null;
        }
        const data = (await res.json());
        return data.anios as string[];
    } catch (err) {
        console.error('getYears error:', err);
        return null;
    }
}

export async function getDepth(): Promise<GeojsonProps[] | null> {
    try {
        const years: string[] | null = await getYears();
        if (!years) {
            return null;
        }
        const listDepth: GeojsonProps[] = await Promise.all(
            years.map(async (year: string) => {
                const res = await fetch(`${URL_DEPTH_API}ICEMAN-OCEAN/anio/${year}/estaciones`,
                    {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    });
                if (!res.ok) {
                    console.error(`getDepth: HTTP ${res.status} for year ${year}`);
                    return null;
                }
                const geojson = await res.json();
                return {
                    rangeDate: geojson.anio,
                    fileName: `Iceman-Ocean ${geojson.anio}`,
                    geojson: { type: "FeatureCollection", features: geojson.features }
                } as GeojsonProps;
            })
        ) as GeojsonProps[];
        return listDepth
    } catch (err) {
        console.error('getDepth error:', err);
        return null;
    }
}

