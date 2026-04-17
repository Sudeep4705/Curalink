import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./Layouts/UserLayout"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import  { Toaster } from 'react-hot-toast';


function App() {


  return (
    <>
      <BrowserRouter>
          <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<UserLayout/>}>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
