import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SyncIcon from "@mui/icons-material/Sync";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const userName = localStorage.getItem("user_name") || "Usuario";
  const userLastname = localStorage.getItem("user_lastname") || "";
  const userEmail =
    localStorage.getItem("user_email") || "usuario@dimar.gov.co";

  const fullName = `${userName} ${userLastname}`.trim();

  const handleLogout = () => {
    localStorage.clear();
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        color: "black",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logos izquierda */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="https://puertocartagena.com/sites/default/files/inline-images/Logo-Dimar_0.png"
            alt="DIMAR"
            style={{ height: 45 }}
          />

          <Divider orientation="vertical" flexItem />

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/61/Mindefensa_Colombia.svg"
            alt="DEFENSA"
            style={{ height: 45 }}
          />
        </Box>

        {/* Perfil derecha */}
        <Box>
          <Button
            onClick={handleOpen}
            startIcon={
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "var(--color-primary)",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            }
            endIcon={<ExpandMoreIcon />}
            sx={{
              textTransform: "none",
              color: "black",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {fullName}
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={600}>{fullName}</Typography>
              <Typography fontSize={13} color="gray">
                {userEmail}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleClose}>
              <SyncIcon sx={{ mr: 1 }} fontSize="small" />
              Cambiar contraseña
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <PersonIcon sx={{ mr: 1 }} fontSize="small" />
              Personalizar perfil
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                handleClose();
                handleLogout();
              }}
            >
              <PowerSettingsNewIcon sx={{ mr: 1 }} fontSize="small" />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}