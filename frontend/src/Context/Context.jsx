import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext()


export const AuthProvider = ({children})=>{
const [User,setUser] = useState(null)
const [Loading,setLoading] = useState(true)


useEffect(()=>{
    const verify = async()=>{
        try{
            let res =await axios.get("https://curalink-xe7y.onrender.com/auth/me",{withCredentials:true})
            console.log(res.data.user);
            setUser(res.data.user)
        }catch(error){
            console.log(error);
            setUser(null)
        }
        finally{
             setLoading(false)
        }
    }
    verify()
},[])
return (
    <>
    <AuthContext.Provider value={{User,Loading,setUser}}>
        {children}
    </AuthContext.Provider>
    </>
)
}