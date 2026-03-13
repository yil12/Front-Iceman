// components/ToolMatrix.tsx
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
    matrixRows,
    matrixColumns,
    matrixCells,
    type MatrixCell
} from '../utils/toolConfig';
import type { DatasetKey } from '../data/dataset';

interface ToolMatrixProps {
    activeDataset: DatasetKey | null;
    onCellClick: (cell: MatrixCell) => void;
}

export default function ToolMatrix({ activeDataset, onCellClick }: ToolMatrixProps) {
    const CELL_SIZE = 39;
    const GAP = 8;

    // Helper para encontrar celda
    const getCell = (rowId: string, colId: string) => {
        return matrixCells.find(cell => cell.rowId === rowId && cell.colId === colId);
    };

    // Helper para verificar si está activa
    const isActive = (cell?: MatrixCell) => {
        return cell?.available && cell.datasetKey === activeDataset;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                pl: 2,
                gap: 1,
            }}
        >
            {/* Header - Columnas */}
            <Box
                sx={{
                    display: 'flex',
                    ml: `${CELL_SIZE + GAP}px`,  // Espacio para las filas
                    gap: `${GAP}px`,
                }}
            >
                {matrixColumns.map((col) => (
                    <Tooltip key={col.id} title={col.label} placement="top" arrow>
                        <Box
                            sx={{
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)',
                                opacity: 0.7,
                            }}
                        >
                            {col.icon}
                        </Box>
                    </Tooltip>
                ))}
            </Box>

            {/* Filas con celdas */}
            {matrixRows.map((row) => (
                <Box
                    key={row.id}
                    sx={{
                        display: 'flex',
                        gap: `${GAP}px`,
                        alignItems: 'center',
                    }}
                >
                    {/* Icono de fila */}
                    <Tooltip title={row.label} placement="left" arrow>
                        <Box
                            sx={{
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)',
                                opacity: 0.7,
                            }}
                        >
                            {row.icon}
                        </Box>
                    </Tooltip>

                    {/* Celdas de la fila */}
                    {matrixColumns.map((col) => {
                        const cell = getCell(row.id, col.id);
                        const cellActive = isActive(cell);

                        return (
                            <Tooltip
                                key={`${row.id}-${col.id}`}
                                title={cell?.label || 'No disponible'}
                                placement="top"
                                arrow
                            >
                                <Box
                                    onClick={() => cell?.available && cell.datasetKey && onCellClick(cell)}
                                    sx={{
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        borderRadius: 1.5,
                                        backgroundColor: cellActive
                                            ? 'var(--color-primary)'
                                            : cell?.available
                                                ? 'white'
                                                : '#c7c3c3',
                                        border: cell?.available
                                            ? `2px solid ${cellActive ? 'var(--color-primary)' : '#e0e0e0'}`
                                            : '2px solid transparent',
                                        cursor: cell?.available ? 'pointer' : 'not-allowed',
                                        opacity: cell?.available ? 1 : 0.3,
                                        transition: 'all 0.2s ease',
                                        '&:hover': cell?.available && !cellActive ? {
                                            backgroundColor: '#e3f2fd',
                                            borderColor: 'var(--color-primary)',
                                            transform: 'scale(1.05)',
                                        } : {},
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Box>
            ))}
        </Box>
    );
}