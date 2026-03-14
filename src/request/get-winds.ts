// src/request/get-winds.ts - CORREGIDO

import type { GeojsonProps } from "../interface/geojson.interface";
import Vientos20172018 from '../data/viento_antartico.json';
import Vientos20182019 from '../data/vientos_2018.json';
import Vientos2020 from '../data/viento_2020.json';

const arrayDataWinds: GeojsonProps[] = [
    {
        rangeDate: '2017 - 2018',
        fileName: 'Vientos 2017 - 2018',
        geojson: Vientos20172018 as any,
        markerShape: 'circle-blue',  // ✅ AGREGAR
    },
    {
        rangeDate: '2018 - 2019',
        fileName: 'Vientos 2018 - 2019',
        geojson: Vientos20182019 as any,
        markerShape: 'circle-blue',  // ✅ AGREGAR
    },
    {
        rangeDate: '2020',
        fileName: 'Vientos 2020',
        geojson: Vientos2020 as any,
        markerShape: 'circle-blue',  // ✅ AGREGAR
    }
];

export function getWinds(data: GeojsonProps | undefined): GeojsonProps[] {
    const listWinds: GeojsonProps[] = [...arrayDataWinds];  // ✅ Copia para evitar mutaciones
    if (data) {
        listWinds.push(data);
    }
    return listWinds;
}