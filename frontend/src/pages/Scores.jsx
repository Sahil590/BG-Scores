import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function Scores() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [scoreValue, setScoreValue] = useState("");
  const [isWinner, setIsWinner] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [editScoreValue, setEditScoreValue] = useState("");
  const [editGameId, setEditGameId] = useState("");
  const [editPlayerId, setEditPlayerId] = useState("");
  const [editIsWinner, setEditIsWinner] = useState(false);

  const API_URL = import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchGames();
    fetchPlayers();
    fetchScores();
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

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/players/`);
      const data = await response.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Could not fetch players", e);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await fetch(`${API_URL}/scores/`);
      const data = await response.json();
      setScores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Could not fetch scores", e);
    }
  };

  const addScore = async (e) => {
    e.preventDefault();
    if (!selectedGame || !selectedPlayer || !scoreValue) return;
    await fetch(`${API_URL}/scores/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: selectedGame,
        player: selectedPlayer,
        score: parseInt(scoreValue),
        is_winner: isWinner,
      }),
    });
    setScoreValue("");
    setIsWinner(false);
    fetchScores();
  };

  const deleteScore = async (id) => {
    if (window.confirm("Are you sure you want to delete this score?")) {
      await fetch(`${API_URL}/scores/${id}/`, { method: "DELETE" });
      fetchScores();
    }
  };

  const openEdit = (score) => {
    setCurrentScore(score);
    setEditGameId(score.game);
    setEditPlayerId(score.player);
    setEditScoreValue(score.score);
    setEditIsWinner(score.is_winner || false);
    setEditOpen(true);
  };

  const updateScore = async () => {
    if (!currentScore || !editGameId || !editPlayerId || !editScoreValue)
      return;
    await fetch(`${API_URL}/scores/${currentScore.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: editGameId,
        player: editPlayerId,
        score: parseInt(editScoreValue),
        is_winner: editIsWinner,
      }),
    });
    setEditOpen(false);
    fetchScores();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Record Score
        </Typography>
        <form
          onSubmit={addScore}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <FormControl>
            <InputLabel>Game</InputLabel>
            <Select
              value={selectedGame}
              label="Game"
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              {games.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Player</InputLabel>
            <Select
              value={selectedPlayer}
              label="Player"
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              {players.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Score"
            type="number"
            variant="outlined"
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isWinner}
                onChange={(e) => setIsWinner(e.target.checked)}
                color="secondary"
                icon={<TrophyIcon color="action" />}
                checkedIcon={<TrophyIcon color="warning" />}
              />
            }
            label="Winner?"
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
              size="large"
            >
              Record Score
            </Button>
          </motion.div>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Entries (Management)
          </Typography>
          <List sx={{ maxHeight: 300, overflow: "auto" }}>
            <AnimatePresence>
              {scores
                .slice()
                .reverse()
                .map((score) => (
                  <motion.div
                    key={score.id}
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
                            onClick={() => openEdit(score)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteScore(score.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {score.player_name}: {score.score}
                            {score.is_winner && (
                              <TrophyIcon color="warning" fontSize="small" />
                            )}
                          </Box>
                        }
                        secondary={`${score.game_name} - ${new Date(score.played_at).toLocaleDateString()}`}
                      />
                    </ListItem>
                  </motion.div>
                ))}
            </AnimatePresence>
          </List>
        </Box>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle>Edit Score</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Game</InputLabel>
              <Select
                value={editGameId}
                label="Game"
                onChange={(e) => setEditGameId(e.target.value)}
              >
                {games.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Player</InputLabel>
              <Select
                value={editPlayerId}
                label="Player"
                onChange={(e) => setEditPlayerId(e.target.value)}
              >
                {players.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Score"
              type="number"
              fullWidth
              variant="outlined"
              value={editScoreValue}
              onChange={(e) => setEditScoreValue(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editIsWinner}
                  onChange={(e) => setEditIsWinner(e.target.checked)}
                  color="secondary"
                  icon={<TrophyIcon color="action" />}
                  checkedIcon={<TrophyIcon color="warning" />}
                />
              }
              label="Winner?"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={updateScore} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
}
