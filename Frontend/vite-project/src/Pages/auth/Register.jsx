import { registerFormControls } from '@/Config/Index'
import CommonForm from '@/components/Common/Form'
import { toast } from 'sonner'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'



const initialState = {
  username: '',
  email: '',
  password: '',
}
const Register = () => {

  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch  = useDispatch();


 const onSubmit = (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData); // 👈

  dispatch(registerUser(formData)).then((res) => {
  if (res.payload?.success) {
    toast.success(res.payload.message);
    navigate('/auth/login');
  } else {
    console.log("Registration error:", res);
    
    toast.error(res.payload?.message || "Registration failed");
  }
});
  }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Create New Account</h1>
      </div>

      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign UP"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

       <p className='mt-2'>
          Already have an account
          <Link to="/auth/login" className='font-medium text-primary hover:underline ml-1'>
            Login
          </Link> 
        </p>

    </div>
  )
}

export default Register