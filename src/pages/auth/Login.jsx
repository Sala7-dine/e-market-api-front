// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../validation/authValidation";
import bgImage from "../../assets/images/bg.jpg";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    try {
      // Validation avec Yup
      await loginSchema.validate(data, { abortEarly: false });

      // Si validation OK, tentative de connexion
      await login(data);
      navigate("/");
    } catch (error) {
      if (error.name === "ValidationError") {
        // Erreurs de validation Yup
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Erreurs de l'API
        setApiError(error.response?.data?.error || "Échec de la connexion");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Background */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gray-700 opacity-30"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link to="/">
              <h2 className="text-4xl font-bold text-black mb-2">E-Market</h2>
            </Link>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#FF6B6B]"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="example@email.com"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#FF6B6B]"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#FF6B6B] focus:ring-[#FF6B6B] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#FF6B6B] hover:text-[#ff5252]">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] transition-colors"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-[#FF6B6B] hover:text-[#ff5252]">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
