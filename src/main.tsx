import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import Home from './components/Home.tsx'
import Customers from './components/Customers.tsx'
import Trainings from './components/Trainings.tsx'
// import './index.css'

// The router defines the routes for the application (for navigation)
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Home />},
      {path: 'customers', element: <Customers />},
      {path: 'trainings', element: <Trainings />},
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
