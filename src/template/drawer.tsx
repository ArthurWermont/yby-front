import { ExpandLess, ExpandMore, Place } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Collapse,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import AnalyticsIcon from '@mui/icons-material/Analytics';

import * as React from "react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import FolderIcon from "@mui/icons-material/Folder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/auth-context";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function ResponsiveDrawerLayout(props: Props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useContext(AuthContext);

  const isClient = !!user?.client_id;
  const isCooperative = !!user?.cooperative_id;
  const isAdmin = !!user?.isAdmin;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate("/signIn");
  };

  const ybyPng = require("../assets/ybyBlack.png");

  const AdminMenu = () => {
    return (
      <>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cadastro"
            style={{ color: "black", fontWeight: "bold" }}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/cadastro/cliente")}
            >
              <ListItemText primary="Clientes" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                primary="Cooperativas"
                onClick={() => navigate("/cadastro/cooperativa")}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                primary="Usuários"
                onClick={() => navigate("/cadastro/users")}
              />
            </ListItemButton>

          </List>
        </Collapse>

        <ListItemButton onClick={() => navigate("/planejamento")}>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText
            style={{ color: "black", fontWeight: "bold" }}
            primary="Planejamento"
          />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/relatorios")}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            style={{ color: "black", fontWeight: "bold" }}
            primary="Relatórios"
          />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText
            style={{ color: "black", fontWeight: "bold" }}
            primary="Dashboard"
          />
        </ListItemButton>
      </>
    );
  };

  const ClientMenu = () => {
    return (
      <>
        <ListItemButton onClick={() => navigate("/relatorios")}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            style={{ color: "black", fontWeight: "bold" }}
            primary="Relatórios"
          />
        </ListItemButton>
      </>
    );
  };

  const CooperativeMenu = () => {
    return (
      <>
        <ListItemButton onClick={() => navigate("/ponto-coleta")}>
          <ListItemIcon>
            <Place />
          </ListItemIcon>
          <ListItemText
            style={{ color: "black", fontWeight: "bold" }}
            primary="PEVs"
          />
        </ListItemButton>
      </>
    );
  };

  const drawer = (
    <div
      style={{ backgroundColor: " rgba(221, 195, 147, 0.2)", height: "100%" }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 2,
        }}
      >
        <img src={ybyPng} alt="YBY Logo" width="100" height="100" />
      </Box>

      {isAdmin && <AdminMenu />}
      {isClient && <ClientMenu />}
      {isCooperative && <CooperativeMenu />}

      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        {/* LogoutIcon */}
        <Divider />
        <Button
          variant="contained"
          onClick={() => {
            handleLogout();
          }}
          style={{
            width: "100%",
            borderRadius: 0,
            backgroundColor: "rgba(221, 195, 147, 0.1)",
            justifyContent: "flex-start",
            color: "rgba(0, 0, 0, 0.50)",
            textTransform: "none",
          }}
        >
          <LogoutIcon />
          <Typography
            style={{ marginLeft: 8, fontSize: "14px", textTransform: "none" }}
          >
            Sair
          </Typography>
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {isMobile && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ position: "absolute", top: 16, left: 16, zIndex: 1100 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Outlet />
    </Box>
  );
}
