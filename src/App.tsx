import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/Auth/Login"
import { SignUp } from "./pages/Auth/SignUp"
import { Home } from "./pages/Home/Home"


export function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path='/' element={<Root/>}/> 
       <Route path='/Home' element={<Home/>}/>
       <Route path='/Login' element={<Login/>}/>
       <Route path='/SignUp' element={<SignUp/>}/>
     </Routes>
   </BrowserRouter>
   

  )
}

 const Root = () => {
   const isAuthenticated = !!localStorage.getItem('cm:token');

   return isAuthenticated ? <Navigate to="/home"/> : <Navigate to="/login"/> 
 }
