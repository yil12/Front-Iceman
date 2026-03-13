import { useState, useMemo } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import type { Map as LeafletMap } from 'leaflet'
import type { DatasetKey } from "./data/dataset";

import SidebarWithMap from './component/SidebarWithMap'
import ResponsiveAppBar from './component/AppBar'
import Login from './component/modals/Login'
import ListDataGeo from './component/ListDataGeo'

import './App.css'

import { MapProvider } from './store/MapContext'
import { LocalStorageProvider } from './store/localStorageContext'

function App() {
  const [open, setOpen] = useState<boolean>(true)
  const [openLogin, setOpenLogin] = useState<boolean>(false)
  const [activeDataset, setActiveDataset] = useState<DatasetKey | null>(null)
  const [map, setMap] = useState<LeafletMap | null>(null)

  //  Crear queryClient con configuración optimizada
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 24,        // 24 horas
        gcTime: 1000 * 60 * 60 * 24 * 7,       // 7 días
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), [])

  //  Persister configurado correctamente
  const persister = useMemo(() =>
    createSyncStoragePersister({
      storage: window.localStorage,
      key: 'iceman-query-cache',
    }),
    [])

  return (
    // ✅ Envolver con PersistQueryClientProvider
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <MapProvider map={map} setMap={setMap}>
        <LocalStorageProvider>
          <div className="flex h-screen w-screen flex-col overflow-hidden">
            <ResponsiveAppBar />

            <div className="relative flex flex-1 overflow-hidden">
              <SidebarWithMap
                open={open}
                setOpen={setOpen}
                activeDataset={activeDataset}
                setActiveDataset={setActiveDataset}
              />
            </div>

            {activeDataset && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-end p-4">
                <div className="pointer-events-auto">
                  <ListDataGeo dataset={activeDataset} />
                </div>
              </div>
            )}

            <Login open={openLogin} onClose={setOpenLogin} />
          </div>
        </LocalStorageProvider>
      </MapProvider>
    </PersistQueryClientProvider>
  )
}

export default App