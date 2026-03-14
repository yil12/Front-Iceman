// src/request/get-waves.ts - CORREGIDO

import type { GeojsonProps } from "../interface/geojson.interface";
import Oleaje20172018 from '../data/oleaje_velocity.json';
import Oleaje20182019 from '../data/oleaje_2018.json';

const arrayDataWaves: GeojsonProps[] = [
    {
        rangeDate: '2017 - 2018',
        fileName: 'Oleajes 2017 - 2018',
        geojson: Oleaje20172018 as any,
        markerShape: 'circle-red',  // ✅ AGREGAR
    },
    {
        rangeDate: '2018 - 2019',
        fileName: 'Oleajes 2018 - 2019',
        geojson: Oleaje20182019 as any,
        markerShape: 'circle-red',  // ✅ AGREGAR
    }
];

export function getWaves(data: GeojsonProps | undefined): GeojsonProps[] {
    const listWaves: GeojsonProps[] = [...arrayDataWaves];  // ✅ Copia para evitar mutaciones
    if (data) {
        listWaves.push(data);
    }
    return listWaves;
}