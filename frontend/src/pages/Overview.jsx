import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";

export default function Overview() {
  const [scores, setScores] = useState([]);
  const API_URL = import.meta.env.PROD ? "/api" : "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await fetch(`${API_URL}/scores/`);
      const data = await response.json();
      setScores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Could not fetch scores", e);
    }
  };

  // Group scores by Game
  const gamesMap = scores.reduce((acc, score) => {
    if (!acc[score.game_name]) {
      acc[score.game_name] = {
        name: score.game_name,
        latest: score.played_at,
        scores: [],
      };
    }
    acc[score.game_name].scores.push(score);
    // Keep track of latest activity for sorting
    if (new Date(score.played_at) > new Date(acc[score.game_name].latest)) {
      acc[score.game_name].latest = score.played_at;
    }
    return acc;
  }, {});

  const sortedGames = Object.values(gamesMap).sort(
    (a, b) => new Date(b.latest) - new Date(a.latest),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Game Summaries
      </Typography>

      <Grid container spacing={3}>
        <AnimatePresence>
          {sortedGames.map((game, index) => (
            <Grid item xs={12} md={6} key={game.name}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {game.name}
                    </Typography>
                  </Box>
                  <CardContent>
                    {game.scores
                      .sort(
                        (a, b) => new Date(b.played_at) - new Date(a.played_at),
                      )
                      .map((score) => (
                        <Box
                          key={score.id}
                          sx={{
                            mb: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 4,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: score.is_winner
                                  ? "warning.main"
                                  : "secondary.main",
                                width: 32,
                                height: 32,
                                fontSize: "0.875rem",
                              }}
                            >
                              {score.player_name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Typography variant="subtitle2" component="div">
                                  {score.player_name}
                                </Typography>
                                {score.is_winner && (
                                  <TrophyIcon
                                    sx={{ fontSize: 16, color: "warning.main" }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Chip
                            label={score.score}
                            color={score.is_winner ? "warning" : "primary"}
                            variant={score.is_winner ? "filled" : "outlined"}
                            sx={{ fontWeight: "bold" }}
                          />
                        </Box>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>

        {sortedGames.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No games played yet. Go to "Record Score" to start!
            </Typography>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
}
