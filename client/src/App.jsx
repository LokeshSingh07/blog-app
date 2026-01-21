import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import Login from './pages/Login'
import Profile from './pages/Profile';
import axios from "axios";
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
axios.defaults.withCredentials = true;



function App() {
  


  return (
    <>
        <div className="h-screen w-full mx-auto ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={ <PostDetail/> } /> 
            <Route path="/create" element={ <CreatePost/> } />
            <Route path="/edit/:id" element={ <EditPost/> } />
            <Route path="/profile" element={ <Profile/> } />
            <Route path="/register" element={ <Register/> } />
            <Route path="/login" element={ <Login/> } /> 


            <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl">404 – Page not found</div>} />
            
          </Routes>
          <Toaster />
        </div>
    
    </>
  )
}

export default App
