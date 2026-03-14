import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Box,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LayersProps {
    selectedMap: string;
    onChange: (value: string) => void;
    setOpenMap: React.Dispatch<React.SetStateAction<boolean>>;
    openMap: boolean;
}

export const BaseMapSelector = ({
    selectedMap,
    onChange,
    setOpenMap,
    openMap,
}: LayersProps) => {
    return (
        <RadioGroup
            value={selectedMap}
            onChange={(e) => {
                onChange(e.target.value);
                setOpenMap(false);
            }}
            sx={{
                position: "absolute",
                top: 5,
                right: openMap ? 10 : "-260px",
                width: 180,
                zIndex: 1300,
                transition: "right .3s ease",

                backgroundColor: "#f4f6f8",
                color: "#333",

                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                padding: 1,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Mapas Base
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => setOpenMap(false)}
                    sx={{ color: "var(--color-primary)" }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Divider
                sx={{
                    my: 1,
                    borderColor: "var(--color-primary)",
                    borderBottomWidth: 1
                }}
            />

            {/* Opciones */}
            <FormControlLabel
                value="baseMap"
                control={
                    <Radio
                        sx={{
                            color: "#666",
                            "&.Mui-checked": {
                                color: "var(--color-primary)",
                            },
                        }}
                    />
                }
                label="Base Map"
                sx={{ marginLeft: 0 }}
            />

            <FormControlLabel
                value="sateliteMap"
                control={
                    <Radio
                        sx={{
                            color: "#666",
                            "&.Mui-checked": {
                                color: "var(--color-primary)",
                            },
                        }}
                    />
                }
                label="Satellite Map"
                sx={{ marginLeft: 0 }}
            />

            <FormControlLabel
                value="topoMap"
                control={
                    <Radio
                        sx={{
                            color: "#666",
                            "&.Mui-checked": {
                                color: "var(--color-primary)",
                            },
                        }}
                    />
                }
                label="Topo Map"
                sx={{ marginLeft: 0 }}
            />

            <FormControlLabel
                value="darkMap"
                control={
                    <Radio
                        sx={{
                            color: "#666",
                            "&.Mui-checked": {
                                color: "var(--color-primary)",
                            },
                        }}
                    />
                }
                label="Dark Map"
                sx={{ marginLeft: 0 }}
            />
        </RadioGroup>
    );
};