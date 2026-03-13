import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Map  } from 'leaflet';
import { useLocalStorageContext } from '../../store/localStorageContext';
import { toggleGeoJsonOnMap } from '../../utils/addGeojson';
import type { Feature } from 'geojson';

import { useMap } from '../../store/MapContext';

interface GeoChipProps {
    label: string;
    //map: Map;
    geojson: any;
    markerShape: 'circle-red' | 'circle-blue';
    onFeatureClick: (feature: Feature) => void;
}

const GeoChip = ({ label, geojson, markerShape, onFeatureClick }: GeoChipProps) => {

    const map = useMap()
    const { removeGeoChip, toggleVisibility } = useLocalStorageContext();

    const handleDelete = () => {
        if (!map) return // ✅ Seguridad
        removeGeoChip(label);
        toggleVisibility(label);
        toggleGeoJsonOnMap(map, geojson, label, markerShape, onFeatureClick);
    };

    return (
        <Stack direction="row" spacing={1}>
            <Chip
                label={label}
                onDelete={handleDelete}
                sx={{
                    backgroundColor: "#fffcfc",
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    opacity: 0.7,
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    '& .MuiChip-deleteIcon': {
                        color: "var(--color-primary)",
                    },
                    '&:hover': {
                        backgroundColor: "#f1f5f9",
                    }
                }}
            />
        </Stack>
    );
};

export default GeoChip;