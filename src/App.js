import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Router from './routes'
import ThemeProvider from './theme'
import { ConfirmProvider } from "material-ui-confirm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ConfirmProvider>
            <Router/>
          </ConfirmProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App