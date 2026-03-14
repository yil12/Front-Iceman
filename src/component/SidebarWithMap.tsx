import { useState, type JSX, useMemo } from 'react';
import {
  IconButton,
  Box,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Public';

import {
  MapContainer,
  LayerGroup,
} from 'react-leaflet';

import { matrixColumns, matrixRows } from '../utils/toolConfig';

import { useMapContext } from '../store/MapContext';

import CustomZoomControl from './CustomZoom';
import type { DatasetKey } from "../data/dataset";
import ModalDetails from './modals/ModalDetails';
import { BaseMapSelector } from './LayersMaps';
import TileLayerContainer from './TileLayerContainer';
import UploadForm from './modals/FormUploadFile';
import ToolMenu from './ToolMenu';

import { useLocalStorageContext } from '../store/localStorageContext';
import GeoChip from './modals/GeoChip';
import { clearSelectedMarker } from '../utils/addGeojson';

interface SidebarWithMapProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeDataset: DatasetKey | null;
  setActiveDataset: React.Dispatch<React.SetStateAction<DatasetKey | null>>;
}

const SidebarWithMap = ({
  open,
  setOpen,
  activeDataset,
  setActiveDataset,
}: Readonly<SidebarWithMapProps>): JSX.Element => {

  const { map, setMap } = useMapContext()

  const [selectedMap, setSelectedMap] = useState('baseMap');
  const [openMap, setOpenMap] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const {
    value,
    modal: { setModalOpen, modalOpen, selectedData, handleFeatureClick },
    geoChipArray
  } = useLocalStorageContext();

  const handleCloseModal = () => {
    setModalOpen(false);

    if (map) {
      clearSelectedMarker(map);
    }
  };

  const modalDimensions = useMemo(() => {
    const CELL_SIZE = 40;
    const GAP = 8;
    const PADDING = 16;
    const ICON_COLUMN_WIDTH = 40;
    const HEADER_PADDING = 16 * 2;

    const width =
      HEADER_PADDING +
      ICON_COLUMN_WIDTH +
      matrixColumns.length * (CELL_SIZE + GAP) -
      GAP;

    const height =
      PADDING * 2 +
      matrixRows.length * (CELL_SIZE + GAP) -
      GAP +
      57;

    return { width, height };
  }, []);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0
      }}
    >

      {/* BOTÓN MENU */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: 'var(--color-primary)',
            opacity: 0.9,
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#074dafff',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* PANEL HERRAMIENTAS */}
      {open && (
        <Box
          sx={{
            position: "absolute",
            top: 3,
            left: 2,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            zIndex: 1300,
            width: modalDimensions.width,
            height: modalDimensions.height,
            overflow: 'hidden',
            pointerEvents: 'auto',
            transform: "translateX(0)",
            transition: "all .25s ease",
          }}
        >

          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 0.6,
              borderBottom: '1px solid var(--color-primary)',
              bgcolor: '#fafafa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuIcon fontSize="small" sx={{ color: 'var(--color-primary)' }} />
              <Typography
                variant="subtitle2"
                fontWeight={500}
                color="var(--color-primary)"
                sx={{ letterSpacing: 0.5 }}
              >
                PANEL
              </Typography>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{
                width: 28,
                height: 28,
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <ToolMenu
            activeDataset={activeDataset}
            onCellClick={(cell) => {
              if (cell.datasetKey) {
                setActiveDataset(
                  activeDataset === cell.datasetKey
                    ? null
                    : cell.datasetKey
                );
              }
            }}
          />

        </Box>
      )}

      {/* BOTÓN MAPA BASE */}
      {!openMap && (
        <IconButton
          onClick={() => setOpenMap(true)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1300,
            backgroundColor: 'var(--color-primary)',
            opacity: 0.9,
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#074dafff',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <MapIcon />
        </IconButton>
      )}

      {/* MAPA */}
      <div className="relative h-full w-full">
        <MapContainer
          center={[-60, -20]}
          zoom={2.5}
          minZoom={2}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={(leafletMap) => {
            if (leafletMap) {
              setMap(leafletMap);
            }
          }}
        >
          <CustomZoomControl />

          <LayerGroup>
            <TileLayerContainer selectedMap={selectedMap} />
          </LayerGroup>

        </MapContainer>
      </div>

      <BaseMapSelector
        selectedMap={selectedMap}
        onChange={(value: string) => setSelectedMap(value)}
        setOpenMap={setOpenMap}
        openMap={openMap}
      />

      <ModalDetails
        open={modalOpen}
        onClose={handleCloseModal}
        feature={selectedData}
      />

      <UploadForm
        open={openForm}
        onClose={() => setOpenForm(false)}
      />

      {/* CHIPS DE CAPAS */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        position="absolute"
        top={3}
        left="42.4%"
        sx={{
          transform: "translateX(-50%)",
          maxWidth: "100%",
          gap: 0.5,  // ✅ Reducir gap (antes: 1)
          zIndex: 1250,
          pointerEvents: "auto"
        }}
      >
        {map && geoChipArray?.map((fileName) => {
          const markerShape =
            value?.[fileName]?.markerShape === 'circle-blue'
              ? 'circle-blue'
              : 'circle-red';

          return (
            <GeoChip
              key={fileName}
              label={fileName}
              geojson={value?.[fileName]?.geojson}
              markerShape={markerShape}
              onFeatureClick={handleFeatureClick}
              size="small"  // ✅ Pasar prop de tamaño
            />
          );
        })}
      </Box>

    </Box>
  );
};

export default SidebarWithMap;