import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { PublicationsContextProvider } from './context/PublicationContext.jsx';
import { ProfileContextProvider } from './context/ProfileContext.jsx';

import {UsersContextProvider} from "./context/UserContext.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UsersContextProvider>
      <ProfileContextProvider>
        <AuthContextProvider>
          <PublicationsContextProvider>
            <App />
          </PublicationsContextProvider>
        </AuthContextProvider>
      </ProfileContextProvider>
    </UsersContextProvider>
  </BrowserRouter>,
)
