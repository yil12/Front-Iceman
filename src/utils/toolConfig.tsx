// data/toolMatrixConfig.tsx
import {  type JSX } from 'react';
import { 
  DirectionsBoat,
  Waves,
  Air,
  WaterDrop,
  Thermostat,
  Speed,
  Grain,
  Storm,
  Water
} from '@mui/icons-material';
import type { DatasetKey } from '../data/dataset';

export interface MatrixCell {
  rowId: string;
  colId: string;
  datasetKey?: DatasetKey;
  available: boolean;
  label: string;
}

export interface MatrixRow {
  id: string;
  icon: JSX.Element;
  label: string;
}

export interface MatrixColumn {
  id: string;
  icon: JSX.Element;
  label: string;
}

// components/icons/BuoyIcon.tsx
import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

export default function BuoyIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: 20,
        height: 20,
        ...props.sx,
      }}
      {...props}
    >
      {/* Anillo superior */}
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      
      {/* Estructura triangular de la boya */}
      <path 
        d="M9 6h6l-1 12H10L9 6z" 
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Barras horizontales de la estructura */}
      <line x1="9.5" y1="9" x2="14.5" y2="9" stroke="white" strokeWidth="0.5" />
      <line x1="10" y1="12" x2="14" y2="12" stroke="white" strokeWidth="0.5" />
      <line x1="10.5" y1="15" x2="13.5" y2="15" stroke="white" strokeWidth="0.5" />
      
      {/* Base de la boya */}
      <rect x="6" y="18" width="12" height="3" rx="0.5" fill="currentColor" />
      
      {/* Línea de agua */}
      <path 
        d="M5 21.5c2-0.5 4-0.5 7 0s5 0.5 7 0" 
        stroke="currentColor" 
        strokeWidth="1" 
        fill="none"
      />
    </SvgIcon>
  );
}

// Filas (parámetros/mediciones)
export const matrixRows: MatrixRow[] = [
  { id: 'temp', icon: <Thermostat fontSize="small" />, label: 'Temperatura' },
  { id: 'waves', icon: <Waves fontSize="small" />, label: 'Oleaje' },
  { id: 'wind', icon: <Air fontSize="small" />, label: 'Viento' },
  { id: 'salinity', icon: <WaterDrop fontSize="small" />, label: 'Salinidad' },
  { id: 'currents', icon: <Speed fontSize="small" />, label: 'Corrientes' },
  { id: 'co2', icon: <Grain fontSize="small" />, label: 'CO2' },
  { id: 'rain', icon: <Storm fontSize="small" />, label: 'Lluvia' },
];

// Columnas (plataformas/tipos)
export const matrixColumns: MatrixColumn[] = [
  { id: 'ships', icon: <DirectionsBoat fontSize="small" />, label: 'Cruceros' },
  { id: 'buoys', icon: <BuoyIcon />, label: 'Boyas' },
  { id: 'stations', icon: <WaterDrop fontSize="small" />, label: 'Estaciones' },
  { id: 'satellites', icon: <Air fontSize="small" />, label: 'Satélites' },
];

// Celdas disponibles (intersecciones)
export const matrixCells: MatrixCell[] = [
  // Oleaje + Cruceros
  { rowId: 'waves', colId: 'ships', datasetKey: 'waves', available: true, label: 'Olas - Cruceros' },
  // Viento + Cruceros
  { rowId: 'wind', colId: 'ships', datasetKey: 'winds', available: true, label: 'Viento - Cruceros' },
  // Temperatura + Estaciones
  { rowId: 'temp', colId: 'stations', available: false, label: 'Temp - Estaciones' },
  // Salinidad + Boyas
  { rowId: 'salinity', colId: 'buoys', available: false, label: 'Salinidad - Boyas' },
  // Agregar más combinaciones según necesites
];