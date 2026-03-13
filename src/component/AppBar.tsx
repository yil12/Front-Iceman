import * as React from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Avatar,
    Button,
    Divider,
    Menu,
    MenuItem,
} from "@mui/material";

import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SyncIcon from "@mui/icons-material/Sync";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function ResponsiveAppBar() {  // ✅ Sin props

    // 🔹 Estado del menú perfil
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    // 🔹 Datos usuario
    const userName = localStorage.getItem("user_name") || "Usuario";
    const userLastname = localStorage.getItem("user_lastname") || "";
    const userEmail =
        localStorage.getItem("user_email") || "usuario@dimar.gov.co";

    const fullName = `${userName} ${userLastname}`.trim();

    // 🔹 Handlers del menú de perfil
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        handleCloseMenu();
        // Opcional: redirigir al login
        window.location.href = "/login";
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "white",
                color: "var(--color-primary)",
                borderBottom: "3px solid var(--color-primary)", 
            }}
        >
            <Container maxWidth={false}>
                <Toolbar disableGutters> 
                    {/* 🔹 Logo + Título */}
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        ml: { xs: 2, md: 3 }  // ✅ Margen izquierdo responsivo
                    }}>
                        <DirectionsBoatFilledIcon sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: ".2rem",
                            }}
                        >
                            ICEMAN
                        </Typography>
                    </Box>

                    {/* 🔹 Espacio flexible */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* 🔹 Logos institucionales */}
                    <Box sx={{ 
                        display: { xs: "none", md: "flex" },  // ✅ Ocultar en móvil si es necesario
                        alignItems: "center", 
                        gap: 2, 
                        mr: 3 
                    }}>
                        <img
                            src="https://puertocartagena.com/sites/default/files/inline-images/Logo-Dimar_0.png"
                            alt="DIMAR"
                            style={{ height: 40 }}
                        />
                        <Divider orientation="vertical" flexItem />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/61/Mindefensa_Colombia.svg"
                            alt="DEFENSA"
                            style={{ height: 40 }}
                        />
                    </Box>

                    {/* 🔹 Perfil Usuario */}
                    <Box sx={{ mr: { xs: 1, md: 2 } }}>
                        <Button
                            onClick={handleOpenMenu}
                            startIcon={
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: "var(--color-primary)",
                                        fontSize: 14,
                                    }}
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>
                            }
                            endIcon={<ExpandMoreIcon />}
                            sx={{
                                textTransform: "none",
                                color: "inherit",
                                px: 1,
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{ 
                                    display: { xs: "none", sm: "block" }  // ✅ Ocultar nombre en móvil
                                }}
                            >
                                {fullName}
                            </Typography>
                        </Button>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography fontWeight={600}>{fullName}</Typography>
                                <Typography fontSize={13} color="gray">
                                    {userEmail}
                                </Typography>
                            </Box>

                            <Divider />

                            <MenuItem onClick={handleCloseMenu}>
                                <SyncIcon sx={{ mr: 1 }} fontSize="small" />
                                Cambiar contraseña
                            </MenuItem>

                            <MenuItem onClick={handleCloseMenu}>
                                <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                                Personalizar perfil
                            </MenuItem>

                            <Divider />

                            <MenuItem 
                                onClick={handleLogout}
                                sx={{ color: "error.main" }}
                            >
                                <PowerSettingsNewIcon sx={{ mr: 1 }} fontSize="small" />
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;