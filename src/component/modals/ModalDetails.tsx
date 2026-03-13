import React, { useState } from "react";
import type { Feature } from 'geojson';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
    Box,
    Typography,
    Divider,
    IconButton,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Slide,
} from '@mui/material';
import { getDepthByStation } from '../../request/get-depth-by-station';
import { useQuery } from '@tanstack/react-query';

const keyExclude: string[] = [
    'objectid',
    'globalid',
    'created_date_ms',
    'last_edited_date_ms',
    'OBJECTID',
    'GlobalID',
    'created_user',
    'created_date',
    'last_edited_user',
    'last_edited_date',
    'latitud',
    'longitud',
    'lat',
    'lon',
    'coordinates',
];

interface ModalProps {
    open: boolean;
    onClose: () => void;
    feature: Feature | null;
}


const ModalDetails: React.FC<ModalProps> = ({ open, onClose, feature }) => {
    const [position, setPosition] = useState({ x: 200, y: 90 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });


    const panelStyle = {
        position: 'absolute' as const,
        top: position.y,
        left: position.x,

        height: 'auto',
        maxHeight: 'calc(100vh - 150px)',

        width: 420,
        borderRadius: '24px',
        backgroundColor: '#ffffff',
        boxShadow: '0 20px 60px rgba(131, 121, 121, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2000,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.08)',
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging) return;

        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    React.useEffect(() => {

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

    }, [dragging, offset]);


    if (!feature || !feature.properties) return null;

    const props = feature.properties as Record<string, any>;

    const getProp = (keys: string[]) => {
        for (const k of keys) {
            if (props[k] !== undefined) return props[k];
            if (props[k.toUpperCase()] !== undefined) return props[k.toUpperCase()];
            if (props[k.toLowerCase()] !== undefined) return props[k.toLowerCase()];
        }
        return null;
    };

    const station =
        getProp(['Estacion', 'estacion', 'Station', 'station', 'PlatformCode', 'platform_code']) ||
        'Sin código';

    const lat =
        getProp(['Latitud', 'latitud', 'Latitude', 'latitude', 'Lat']) ||
        (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)
            ? feature.geometry.coordinates[1]
            : '—');

    const lon =
        getProp(['Longitud', 'longitud', 'Longitude', 'longitude', 'Lon']) ||
        (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)
            ? feature.geometry.coordinates[0]
            : '—');


    /*
    ORDENAMOS LAS PROPIEDADES
    normales primero
    QF al final
    */

    const orderedProps = Object.entries(props)
        .filter(([key, value]) =>
            !keyExclude.includes(key.toLowerCase()) &&
            value !== null &&
            value !== ''
        )
        .sort(([keyA], [keyB]) => {

            const aIsQF = keyA.toLowerCase().startsWith('qf');
            const bIsQF = keyB.toLowerCase().startsWith('qf');

            if (aIsQF && !bIsQF) return 1;
            if (!aIsQF && bIsQF) return -1;

            return 0;
        });

    return (
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <Box sx={panelStyle}>

                {/* HEADER */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    onMouseDown={handleMouseDown}
                    sx={{
                        cursor: "move",
                        px: 3,
                        py: 1.2,
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px'
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="var(--color-primary)">
                            <IconButton onClick={onClose} size="small">
                                <LocationOnIcon />
                            </IconButton> Estación: {station}
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                {/* COORDENADAS */}
                <Box sx={{ px: 4, pt: 2, pb: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 3
                        }}
                    >

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Latitud
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                color="var(--color-primary)"
                            >
                                {lat} °
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Longitud
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                color="var(--color-primary)"
                            >
                                {lon} °
                            </Typography>
                        </Box>

                    </Box>
                </Box>

                <Divider />

                {/* TABLA */}
                <Box
                    sx={{
                        overflowY: 'auto',
                        p: 2,
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#cbd5e1',
                            borderRadius: '8px',
                        },
                    }}
                >

                    <TableContainer component={Paper} elevation={1}>
                        <Table size="small">

                            <TableHead sx={{ backgroundColor: '#ffffff' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Propiedad</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Valor</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {orderedProps.map(([key, value]) => (

                                    <TableRow key={key} hover>

                                        <TableCell
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {key}
                                        </TableCell>

                                        <TableCell sx={{ fontSize: '0.9rem' }}>
                                            {String(value)}
                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>
                    </TableContainer>

                </Box>

                {/* FOOTER */}
                <Box p={2} display="flex" justifyContent="center" borderTop="1px solid #eee">
                     {/* TABLA 
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                            isFetching
                                ? <CircularProgress size={20} color="inherit" />
                                : <FileDownloadIcon />
                        }
                        onClick={() => refetch()}
                        disabled={isFetching}
                        sx={{ borderRadius: '20px', px: 4 }}
                    >
                        {isFetching ? 'Descargando...' : 'Descargar datos'}
                    </Button>*/}

                </Box>

            </Box>
        </Slide >
    );
};

export default ModalDetails;