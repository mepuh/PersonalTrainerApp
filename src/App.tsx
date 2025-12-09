import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { NavLink, Outlet } from 'react-router'
import { Box } from "@mui/material"
import './App.css'

function App() {

  return (
    <>
      <Container maxWidth="xl">
        <CssBaseline />
        <AppBar position="static" sx={{ marginBottom: 2 }}>
          <Toolbar>
            <Typography variant="h6">PersonalTrainer</Typography>
            {/* Navigation links for the main sections of the app, might change style in the future */}
            <Box sx={{ flexGrow: 1 }} />
            <nav>
              <NavLink style={({ isActive }) => ({ fontSize: '95%', margin: '20px', textDecoration: "none", color: isActive ? "darkblue" : "white" })} to={"/"}>HOME</NavLink>
              <NavLink style={({ isActive }) => ({ fontSize: '95%', margin: '20px', textDecoration: "none", color: isActive ? "darkblue" : "white" })} to={"/customers"}>CUSTOMERS</NavLink>
              <NavLink style={({ isActive }) => ({ fontSize: '95%', margin: '20px', textDecoration: "none", color: isActive ? "darkblue" : "white" })} to={"/trainings"}>TRAININGS</NavLink>
            </nav>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Container>
    </>
  )
}

export default App
