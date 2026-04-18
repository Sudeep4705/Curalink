import "@fontsource-variable/inter-tight/wght.css";
import axios from "axios"
import { Mail, UserRound, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Context";
import {  useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast"
export default function Login(){
  const [eye, seteye] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm(); 
  const { setUser } = useContext(AuthContext)
  const formsubmit = async (data) => {
    try {
      let res = await axios.post("https://curalink-xe7y.onrender.com/auth/login", data, { withCredentials: true })
        setUser(res.data.user)
      toast.success(res.data.message)
       navigate("/") 
    } catch(error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };
    const sendtoken = async(credential)=>{
    try{
       let res = await axios.post("https://curalink-xe7y.onrender.com/google/authlogin",{
        token:credential
      },{withCredentials:true})
      toast.success(res.data.message)
      setUser(res.data.user)
       navigate("/chatbot") 
    }
    catch(err){
        toast.error(err || "google error")
      }}
  return (
    <div
      className="register-form w-full"
      style={{ fontFamily: "'Inter Tight Variable', sans-serif;" }}
    >
      <div className="main-con min-w-10 bg-white md:flex p-2 md:justify-center md:gap-20 md:p-20">
        <div className="Image">
          <img
            src="/health2.svg"
            className="max-w-md md:min-w-xl md:rounded-4xl rounded-xl"
            alt=""
          />
        </div>
        <div className="form-inputs flex flex-col">
          <div className="side-effect pt-2">
            <p className="text-gray-400 pl-30 md:pl-40">
              Dont have an account?{" "}
              <a href="/register" className="text-black">
                Sign up
              </a>
            </p>
          </div>

          <div className="heading">
            <h1 className="text-black font-semibold text-4xl px-2 py-5">
              Sign in
            </h1>
          </div>
          <div className="small-heading">
            <h1 className="text-black font-semibold px-2 py-3">
              Sign in with open account
            </h1>
          </div>
          <div className="google-btn">
             <GoogleLogin  size="large" onSuccess={(response)=>{
                       sendtoken(response.credential)
                  }} onError={()=>{
                    console.log("Login failed");
                  }}/>
          </div>

          {/*form*/}
          <div className="default-form py-2">
            <h1 className="font-semibold px-2 py-2 md:pb-5">
              Or continue with emails address
            </h1>
          </div>
          <form onSubmit={handleSubmit(formsubmit)} className="form flex flex-col gap-7 md:gap-10 pb-4">
            <div className="flex flex-col justify-center px-3 relative">
              <Mail className="absolute top-2 left-5 text-gray-700 size-6 text-center" />
              <input
                type="email"
                placeholder="test@gmail.com"
                className="p-2 rounded-xl border border-black pl-10"
                 {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Enter a valid email" }
                })}
              />
              
                 {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col justify-center px-3 relative">
              <LockKeyhole className="absolute top-2 left-5 text-gray-700 size-6 text-center" />
              <input
                type={eye ? "text" : "password"}
                placeholder="1223456789"
                className="p-2 rounded-xl border border-black pl-10"
                 {...register("password", {
                  required: "Password is required",
                })}
              />
              {eye ? (
                <Eye
                  onClick={() => seteye(!eye)}
                  className="absolute left-75 md:left-80"
                />
              ) : (
                <EyeOff
                  onClick={() => seteye(!eye)}
                  className="absolute md:left-80 left-75"
                />
              )}
                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col justify-center px-3">
              <button type="submit" className="rounded-xl border border-white p-2 bg-blue-600 text-white">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
