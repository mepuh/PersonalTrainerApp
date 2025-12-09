import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { NavLink, Outlet } from 'react-router'
import { Box } from "@mui/material"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import './App.css'

function App() {

  return (
    <>
      <Container maxWidth="xl">
        <CssBaseline />
        <AppBar position="static" sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          marginBottom: 3
        }}>
          <Toolbar>
            <FitnessCenterIcon sx={{ marginRight: 2, fontSize: '1.8rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.8px' }}>PersonalTrainer</Typography>
            {/* Navigation links for the main sections of the app */}
            <Box sx={{ flexGrow: 1 }} />
            <nav>
              <NavLink to="/" style={({ isActive }) => ({
                fontSize: '0.95rem',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: isActive ? 600 : 500,
                borderBottom: isActive ? '2px solid #fff' : 'none',
                padding: '8px 16px',
              })}>HOME</NavLink>
              <NavLink to="/customers" style={({ isActive }) => ({
                fontSize: '0.95rem',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: isActive ? 600 : 500,
                borderBottom: isActive ? '2px solid #fff' : 'none',
                padding: '8px 16px',
              })}>CUSTOMERS</NavLink>
              <NavLink to="/trainings" style={({ isActive }) => ({
                fontSize: '0.95rem',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: isActive ? 600 : 500,
                borderBottom: isActive ? '2px solid #fff' : 'none',
                padding: '8px 16px',
              })}>TRAININGS</NavLink>
            </nav>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Container>
    </>
  )
}

export default App
