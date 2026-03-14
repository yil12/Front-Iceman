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
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    //  Estado para posición (solo en desktop)
    const [position, setPosition] = useState({ x: 800, y: 150 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    //  Estilos responsive del panel
    const panelStyle = {
        position: 'absolute' as const,
        
        //  Móvil: pantalla completa
        top: isMobile ? 0 : position.y,
        left: isMobile ? 0 : position.x,
        right: isMobile ? 0 : 'auto',
        bottom: isMobile ? 0 : 'auto',
        
        //  Tamaño responsive
        width: isMobile ? '100%' : 320,
        height: isMobile ? '100%' : '420px',
        maxHeight: isMobile ? '100vh' : 'calc(100vh - 150px)',
        
        //  Bordes responsive
        borderRadius: isMobile ? 0 : '24px',
        
        backgroundColor: '#ffffff',
        boxShadow: isMobile 
            ? 'none' 
            : '0 20px 60px rgba(131, 121, 121, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2000,
        backdropFilter: isMobile ? 'none' : 'blur(8px)',
        border: isMobile ? 'none' : '1px solid rgba(0,0,0,0.08)',
        
        //  Animación de entrada
        transition: 'all 0.3s ease',
    };

    //  Handlers para drag (solo desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;  //  No permitir drag en móvil
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || isMobile) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    React.useEffect(() => {
        if (isMobile) return;  // ❌ No agregar listeners en móvil
        
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset, isMobile]);

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
        <Slide direction={isMobile ? "up" : "left"} in={open} mountOnEnter unmountOnExit>
            <Box sx={panelStyle}>

                {/* HEADER - Responsive */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    onMouseDown={handleMouseDown}
                    sx={{
                        cursor: isMobile ? 'default' : 'move',  //  Sin cursor move en móvil
                        px: isMobile ? 2 : 1.5,
                        py: isMobile ? 2 : 1.2,
                        borderTopLeftRadius: isMobile ? 0 : '24px',
                        borderTopRightRadius: isMobile ? 0 : '24px',
                        borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/*  Botón más grande en móvil */}
                        <IconButton 
                            onClick={onClose} 
                            size={isMobile ? 'medium' : 'small'}
                            sx={{ color: 'var(--color-primary)' }}
                        >
                            <LocationOnIcon fontSize={isMobile ? 'medium' : 'small'} />
                        </IconButton>
                        
                        <Typography 
                            variant={isMobile ? "h5" : "h6"} 
                            fontWeight={700} 
                            color="var(--color-primary)"
                            noWrap  //  Evitar desbordamiento en móvil
                        >
                         {station}
                        </Typography>
                    </Box>

                    {/*  Botón cerrar más grande en móvil */}
                    <IconButton 
                        onClick={onClose} 
                        size={isMobile ? 'medium' : 'small'}
                        sx={{ 
                            color: 'var(--color-primary)',
                            width: isMobile ? 48 : 40,  //  Área de toque más grande
                            height: isMobile ? 48 : 40,
                        }}
                    >
                        <CloseIcon fontSize={isMobile ? 'medium' : 'small'} />
                    </IconButton>
                </Box>

                {!isMobile && <Divider />}

                {/*  COORDENADAS - Responsive */}
                <Box sx={{ px: isMobile ? 3 : 4, pt: isMobile ? 2 : 2, pb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: isMobile ? 4 : 3,
                            flexWrap: isMobile ? 'wrap' : 'nowrap', 
                        }}
                    >
                        <Box sx={{ flex: isMobile ? '1 1 45%' : 1 }}>  
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                fontSize={isMobile ? 13 : 12}
                            >
                                Latitud
                            </Typography>
                            <Typography
                                variant={isMobile ? "h6" : "body1"}
                                fontWeight={600}
                                color="var(--color-primary)"
                                fontSize={isMobile ? 20 : 16}
                            >
                                {lat} °
                            </Typography>
                        </Box>

                        <Box sx={{ flex: isMobile ? '1 1 45%' : 1 }}>
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                fontSize={isMobile ? 13 : 12}
                            >
                                Longitud
                            </Typography>
                            <Typography
                                variant={isMobile ? "h6" : "body1"}
                                fontWeight={600}
                                color="var(--color-primary)"
                                fontSize={isMobile ? 20 : 16}
                            >
                                {lon} °
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider />

                {/* TABLA - Responsive con scroll horizontal */}
                <Box
                    sx={{
                        overflowY: 'auto',
                        overflowX: isMobile ? 'auto' : 'hidden',  
                        p: isMobile ? 2 : 2,
                        flex: 1,  // ✅ Ocupar espacio restante
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#cbd5e1',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <TableContainer 
                        component={Paper} 
                        elevation={isMobile ? 0 : 1}
                        sx={{ 
                            minWidth: isMobile ? 600 : 'auto',
                        }}
                    >
                        <Table size={isMobile ? 'medium' : 'small'}>
                            <TableHead sx={{ backgroundColor: '#fafafa' }}>
                                <TableRow>
                                    <TableCell 
                                        sx={{ 
                                            fontWeight: 700,
                                            fontSize: isMobile ? 14 : 13,
                                            whiteSpace: 'nowrap', 
                                        }}
                                    >
                                        Propiedad
                                    </TableCell>
                                    <TableCell 
                                        sx={{ 
                                            fontWeight: 700,
                                            fontSize: isMobile ? 14 : 13,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Valor
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {orderedProps.map(([key, value]) => (
                                    <TableRow 
                                        key={key} 
                                        hover
                                        sx={{ 
                                            '&:last-child td, &:last-child th': { 
                                                border: 0 
                                            },
                                            '&:hover': {
                                                backgroundColor: isMobile ? 'transparent' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: isMobile ? 13 : 12,
                                                whiteSpace: 'nowrap', 
                                                py: isMobile ? 1.5 : 1,
                                            }}
                                        >
                                            {key}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                fontSize: isMobile ? 14 : 13,
                                                whiteSpace: 'nowrap',
                                                py: isMobile ? 1.5 : 1,
                                                maxWidth: 200,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {String(value)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* ✅ FOOTER - Responsive */}
                <Box 
                    p={isMobile ? 2 : 2} 
                    display="flex" 
                    justifyContent="center" 
                    borderTop="1px solid #eee"
                    sx={{
                        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 2,  // ✅ Safe area para iPhone
                    }}
                >
                    {/* Botón de descarga (comentado por ahora) */}
                </Box>

            </Box>
        </Slide>
    );
};

export default ModalDetails;