import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from 'sonner';

function ResetPassword() {

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

     if(confirmPassword !== password) {
      toast.error("Passwords do not match.");
      return;
     }
      const res = await axios.post(
        `https://ecom-web-woad.vercel.app/api/auth/reset-password/${token}`,
        { password }
      );

      toast.success(res.data.message);
      Navigate('/auth/login')

    } catch (error) {
      console.log(error);
      toast.error("Failed to reset password.");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> 
  <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8"> 
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6"> Reset Password </h2>
     <form onSubmit={handleSubmit} className="space-y-4"> 
        <div> 
            <label className="block text-sm font-medium text-gray-600 mb-1"> New Password </label> 
            <input type="password" placeholder="Enter new password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
             </div>

             <div> 
            <label className="block text-sm font-medium text-gray-600 mb-1"> Confirm Password </label> 
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
             </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition" > Reset Password </button> 
              </form>
               </div> 
               </div>
  );
}

export default ResetPassword;