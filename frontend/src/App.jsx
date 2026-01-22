import { useState, useMemo } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import Games from "./pages/Games";
import Players from "./pages/Players";
import Scores from "./pages/Scores";
import "./App.css";

// Theme moved inside App component for dynamic updates

function App() {
  const [mode, setMode] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#6750A4");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primaryColor,
          },
          secondary: {
            main: "#958DA5",
          },
          background: {
            default: mode === "light" ? "#F7F2FA" : "#1C1B1F",
            paper: mode === "light" ? "#F3EDF7" : "#2B2930",
          },
        },
        shape: {
          borderRadius: 20,
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h3: { fontWeight: 700 },
          h5: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "50px",
                textTransform: "none",
                boxShadow: "none",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                padding: "2rem",
                backgroundImage: "none",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                marginBottom: "1rem",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                marginBottom: "1rem",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              },
            },
          },
        },
      }),
    [mode, primaryColor],
  );

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md" className="container">
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: "primary.main", mb: 4 }}
            >
              Board Game Scores
            </Typography>
          </Box>

          <Navbar
            mode={mode}
            toggleMode={toggleMode}
            setPrimaryColor={setPrimaryColor}
          />

          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/games" element={<Games />} />
            <Route path="/players" element={<Players />} />
            <Route path="/scores" element={<Scores />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
