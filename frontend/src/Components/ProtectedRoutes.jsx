import { useContext } from "react";
import { AuthContext } from "../Context/Context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { User, Loading } = useContext(AuthContext);
  console.log(User);
  if (Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
  if (!User) {
    return <Navigate to="/login" />;
  }
  return children;
}
