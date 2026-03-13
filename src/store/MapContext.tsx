// src/context/MapContext.tsx
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Map as LeafletMap } from 'leaflet';

// 1. Definir el tipo del contexto
interface MapContextType {
  map: LeafletMap | null;
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
}

// 2. Crear el contexto con valor inicial undefined (para detectar errores de uso)
const MapContext = createContext<MapContextType | undefined>(undefined);

// 3. Provider component
interface MapProviderProps {
  children: ReactNode;
  map: LeafletMap | null;
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
}

export const MapProvider = ({ children, map, setMap }: MapProviderProps) => {
  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};

// 4. Custom hook para consumir el contexto (con validación)
export const useMapContext = () => {
  const context = useContext(MapContext);
  
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  
  return context;
};

// 5. Hook simplificado si solo necesitas leer el mapa (opcional)
export const useMap = () => {
  const { map } = useMapContext();
  return map;
};