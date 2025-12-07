import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
}

// Register User

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register",formData,{ withCredentials:true });
      return response.data;
    } catch (error) {
      // Pass backend error to rejected action
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

// export const registerUser = createAsyncThunk("auth/register", async(formData)=>{
//         const response = await axios.post('http://localhost:5000/api/auth/register', formData, {withCredentials: true});
//         console.log("response index.js:", response);
//         return response.data;   
// })

// Login 
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login",formData,{ withCredentials:true });
      
      console.log(response,"login");
      
      return response.data;
    } catch (error) {
      // Pass backend error to rejected action
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);



// export const loginUser = createAsyncThunk("auth/login", async(formData)=>{
//     const response = await axios.post('http://localhost:5000/api/auth/login', formData, {withCredentials: true});
//     return response.data;   
// });

// Logout User

export const logoutUser = createAsyncThunk("auth/logout", async()=>{
    const response = await axios.post('http://localhost:5000/api/auth/logout', {}, {withCredentials: true});
    return response.data;
});

// Check Auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/checkAuth", {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
        },
      });
      return response.data;
    } catch (error) {
      // Pass backend error to rejected action
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser:(state, action) => {},
    },

    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
             state.isLoading = false;
             state.user = action.payload.success ? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
          
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        }).addCase(logoutUser.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        }).addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        }).addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = action.payload.success;
            state.user = action.payload.success ? action.payload.user : null;
        }).addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        })
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

