import CommonForm from '@/components/Common/Form';
import { loginFormControls } from '@/Config/Index';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const initialState = {
  email: '',
  password: '',
}

const Login = () => {

  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch  = useDispatch();

   const onSubmit = (e) => {
    e.preventDefault();
   dispatch(loginUser(formData)).then((res) => {
    if (res.payload?.success) {
      toast.success(res.payload.message);
      navigate('/shop/home');
    } else {
      toast.error(res.payload?.message || "Login failed");
    }})
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>SignIn Your Account</h1>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    <p className='text-xs'>Forget your  password <Link className='underline'>Click here</Link></p>
       <p className='mt-2 text-xs'>
          Dont have an account
          <Link to="/auth/register" className='font-medium text-primary hover:underline ml-1'>
            Register
          </Link> 
        </p>

    </div>
  )
}

export default Login