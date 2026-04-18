import "@fontsource-variable/inter-tight/wght.css";
import { Mail, UserRound, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Context";
import axios from "axios";
import {  useContext } from "react";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
export default function Register() {
  const [eye, seteye] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext)
   const { register, handleSubmit, formState: { errors } } = useForm();
   const formsubmit = async (data) => {
    try {
      let res = await axios.post("https://curalink-xe7y.onrender.com/auth/signup", data, { withCredentials: true })
      setUser(res.data.user)
      toast.success(res.data.message)
       navigate("/") 
    } catch(error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };
   const sendtoken = async(credential)=>{
    try{
       let res = await axios.post("https://curalink-xe7y.onrender.com/google/authsignup",{
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
            src="/health.svg"
            className="max-w-md md:min-w-xl md:rounded-4xl rounded-xl"
            alt=""
          />
        </div>
        <div className="form-inputs flex flex-col">
          <div className="side-effect pt-2">
            <p className="text-gray-400 pl-30 md:pl-40">
              Already have an account?{" "}
              <a href="/login" className="text-black">
                Sign in
              </a>
            </p>
          </div>

          <div className="heading">
            <h1 className="text-black font-semibold text-4xl px-2 py-5">
              Sign Up
            </h1>
          </div>
          <div className="small-heading">
            <h1 className="text-black font-semibold px-2 py-3">
              Sign Up with open account
            </h1>
          </div>
          <div className="google-btn">
            <GoogleLogin size="large" onSuccess={(response)=>{
                    console.log(response); 
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
              <UserRound className="absolute top-2 left-5 text-gray-700 size-6 text-center" />
              <input
                type="text"
                placeholder="Username1234"
                className="p-2 rounded-xl border border-black pl-10"
                {...register("username", {
                    required: "Required",
                    pattern: { value: /^[a-zA-Z0-9]{2,30}$/, message: "Invalid username" }
                  })}
              />
                {errors.username && <p className="text-red-400 text-xs text-left">{errors.username.message}</p>}
            </div>
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
                  pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Min 8 chars, uppercase, lowercase, number and special character" }
                })}
              />
                
              {eye ? (
                <Eye
                  onClick={() => seteye(!eye)}
                  className="absolute left-75 md:left-80 text-center"
                />
              ) : (
                <EyeOff
                  onClick={() => seteye(!eye)}
                  className="absolute md:left-80 left-75 flex justify-center items-center"
                />

              )}
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col justify-center px-3">
              <button type="submit" className="rounded-xl border border-white p-2 bg-blue-600 text-white">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
