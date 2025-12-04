import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
// import './App.css'

function App() {

  return (
    <>
      <Container maxWidth="lg">
        <AppBar position="static" sx={{ marginBottom: 2 }}>
          <Toolbar>
            <Typography variant="h6">Training</Typography>
          </Toolbar>
        </AppBar>
        <CssBaseline />
      </Container>
    </>
  )
}

export default App
