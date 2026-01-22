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

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [editName, setEditName] = useState("");

  const API_URL = import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/players/`);
      const data = await response.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Could not fetch players", e);
    }
  };

  const addPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName) return;
    await fetch(`${API_URL}/players/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlayerName }),
    });
    setNewPlayerName("");
    fetchPlayers();
  };

  const deletePlayer = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this player? Note: This will delete all scores associated with them.",
      )
    ) {
      await fetch(`${API_URL}/players/${id}/`, { method: "DELETE" });
      fetchPlayers();
    }
  };

  const openEdit = (player) => {
    setCurrentPlayer(player);
    setEditName(player.name);
    setEditOpen(true);
  };

  const updatePlayer = async () => {
    if (!currentPlayer || !editName) return;
    await fetch(`${API_URL}/players/${currentPlayer.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditOpen(false);
    fetchPlayers();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Manage Players
        </Typography>
        <form onSubmit={addPlayer}>
          <TextField
            label="New Player Name"
            variant="outlined"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Player
          </Button>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Player List
          </Typography>
          <List>
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
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
                          onClick={() => openEdit(player)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deletePlayer(player.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText primary={player.name} />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Box>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Player Name"
              fullWidth
              variant="outlined"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={updatePlayer} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
}
