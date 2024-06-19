
import {Routes, Route  , Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages && Components 
import Home from './pages/Home'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProfileUserDetails from './pages/ProfileUserDetails'
import Users from './pages/Users'
import Invitation from './pages/Invitation'
import Amis from './pages/Amis'
import NavBar2 from './components/NavBar2'

function App() {
  const { user } = useAuthContext()
  console.log("user" , user);

  return (
    <>
   
      {/* <NavBar /> */}
      <NavBar2/>
      <Routes>
        <Route path='/' element = {user ? <Home /> : <Navigate to="/login" />} />
        <Route path='/profile' element = {user ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/profileUser' element = {user ? <ProfileUserDetails /> : <Navigate to="/login" />} />
        <Route path='/users' element= {user ? <Users /> : <Navigate to="/login" /> } />
        <Route path='/amis' element= {user ? <Amis /> : <Navigate to="/login" /> } />

        <Route path='/invitation' element= {user ? <Invitation /> : <Navigate to="/login" /> } />
        <Route path='/login' element = {!user ? <Login />: <Navigate to="/" />} />
        <Route path='/register' element = {!user ?<Register /> : <Navigate to="/" /> } />
      

      </Routes>
    </>
  )
}

export default App
