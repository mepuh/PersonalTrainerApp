import { Box, Paper, Typography } from "@mui/material";

// Home component displaying a welcome message and brief description
function Home() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <Paper elevation={4} sx={{ p: 5, maxWidth: 700, textAlign: "center" }}>
        <Typography variant="h4" sx ={{ mb: 2 }}>
          Personal Trainer Admin Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to the internal management system for handling customer information and training sessions.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Use the navigation menu to view and manage customers or review training data.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home;