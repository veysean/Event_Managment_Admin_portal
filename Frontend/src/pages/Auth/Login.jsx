import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import API from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoLoginData = location.state;

  const { login } = useContext(AuthContext);
   
  const [email, setEmail] = useState(autoLoginData?.email || "");
  const [password, setPassword] = useState(autoLoginData?.password || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoLoginData?.email && autoLoginData?.password) {
      handleSubmit(); // auto login
    }
  }, [autoLoginData]);

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const res = await API.post('/auth/login', {
        email,
        password,
      });

      const { token } = res.data;

      if(token) {

        login(token);

        navigate("/dashboard");

      } else {
        setError("Invalid response from server")
      }
    } catch (error) {
      if (error.response?.data?.message) {

        setError(error.response.data.message);
        
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
   <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden p-4">
      {/* Header bar */}
      <div className="w-full max-w-4xl border-b border-slate-500 py-4 flex justify-center mb-16">
        <div className="text-slate-500 text-3xl font-normal font-['Righteous']">EventNA</div>
      </div>

      <div className="flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden max-w-4xl w-full">
        {/* Left welcome panel */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-slate-500 to-slate-500 p-8 flex flex-col justify-center items-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center">Welcome Back!</h2>
          <p className="text-blue-100 text-sm md:text-base font-light text-center">
            Please login to your account.
          </p>
          
        </div>

        {/* Right login panel */}
        <div className="w-full md:w-2/3 bg-white p-8 flex flex-col items-center">
          <h2 className="text-slate-600 text-4xl font-normal font-['Righteous'] mb-8">LogIn</h2>

          {error && (
            <div className="w-full max-w-xs rounded-md bg-red-50 p-3 mb-6">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <form className="w-full max-w-xs flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="w-full p-3 bg-white rounded-xl border border-slate-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter username or email"
                className="w-full bg-transparent outline-none text-slate-600 text-sm font-light leading-snug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password field */}
            <div className="w-full p-3 bg-white rounded-xl border border-slate-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter password"
                className="w-full bg-transparent outline-none text-slate-600 text-sm font-light leading-snug"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-gradient-to-r from-slate-500 to-slate-500 rounded-xl flex justify-center items-center gap-2.5 hover:from-slate-500 hover:to-slate-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-white text-sm font-bold font-['Inter'] leading-snug">Logging in...</span>
                </div>
              ) : (
                <span className="text-white text-sm font-bold font-['Inter'] leading-snug">Login</span>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}