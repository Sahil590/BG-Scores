import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Brightness4, Brightness7, Settings } from "@mui/icons-material";

export default function Navbar({ mode, toggleMode, setPrimaryColor }) {
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const colors = ["#6750A4", "#B3261E", "#2E7D32", "#006C7C", "#F57C00"];

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
      <Toolbar
        component={Box}
        sx={{ justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            to="/"
            variant={location.pathname === "/" ? "contained" : "text"}
          >
            Overview
          </Button>
          <Button
            component={Link}
            to="/games"
            variant={location.pathname === "/games" ? "contained" : "text"}
          >
            Games
          </Button>
          <Button
            component={Link}
            to="/players"
            variant={location.pathname === "/players" ? "contained" : "text"}
          >
            Players
          </Button>
          <Button
            component={Link}
            to="/scores"
            variant={location.pathname === "/scores" ? "contained" : "text"}
          >
            Record Score
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Settings">
            <IconButton onClick={handleClick} color="inherit">
              <Settings />
            </IconButton>
          </Tooltip>

          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "settings-button",
            }}
          >
            <MenuItem
              onClick={() => {
                toggleMode();
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 2,
                }}
              >
                <Typography variant="body2">Dark Mode</Typography>
                {mode === "dark" ? (
                  <Brightness7 fontSize="small" />
                ) : (
                  <Brightness4 fontSize="small" />
                )}
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 1 }}
              >
                Theme Color
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => {
                      setPrimaryColor(color);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        theme.palette.primary.main === color
                          ? `2px solid ${theme.palette.text.primary}`
                          : "1px solid transparent",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
