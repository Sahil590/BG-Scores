import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function Games() {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [editName, setEditName] = useState("");

  const API_URL = import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_URL}/games/`);
      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Could not fetch games", e);
    }
  };

  const addGame = async (e) => {
    e.preventDefault();
    if (!newGameName) return;
    await fetch(`${API_URL}/games/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGameName }),
    });
    setNewGameName("");
    fetchGames();
  };

  const deleteGame = async (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      await fetch(`${API_URL}/games/${id}/`, { method: "DELETE" });
      fetchGames();
    }
  };

  const openEdit = (game) => {
    setCurrentGame(game);
    setEditName(game.name);
    setEditOpen(true);
  };

  const updateGame = async () => {
    if (!currentGame || !editName) return;
    await fetch(`${API_URL}/games/${currentGame.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditOpen(false);
    fetchGames();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Manage Games
        </Typography>
        <form onSubmit={addGame}>
          <TextField
            label="New Game Name"
            variant="outlined"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Game
          </Button>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Game List
          </Typography>
          <List>
            <AnimatePresence>
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ListItem
                    sx={{
                      bgcolor: "background.default",
                      mb: 1,
                      borderRadius: 2,
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => openEdit(game)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteGame(game.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText primary={game.name} />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Box>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Game Name"
              fullWidth
              variant="outlined"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={updateGame} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
}
