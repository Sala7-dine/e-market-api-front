import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { registerSchema } from "../../validation/authValidation";
import bgImage from "../../assets/images/bg.jpg";

const Register = () => {

    const navigate = useNavigate();
    const { register } = useAuth();
    const [data , setData] = useState({
        fullName : "",
        email : "",
        password : "",
        cpassword : ""
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiError("");

        try {
            // Validation avec Yup
            await registerSchema.validate(data, { abortEarly: false });

            // Si validation OK, tentative d'inscription
            const newData = {
                fullName : data.fullName,
                email : data.email,
                password : data.password
            };
            
            await register(newData);
            navigate("/login");
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Erreurs de validation Yup
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                // Erreurs de l'API
                setApiError(error.response?.data?.error || "Échec de l'inscription");
            }
        }
    }

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

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <Link to="/">
                            <h2 className="text-4xl font-bold text-black mb-2">E-Market</h2>
                        </Link>
                        <p className="text-gray-600">Create your account</p>
                    </div>

                    {/* Error Message */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF6B6B]'
                                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder="Enter your full name"
                                    value={data.fullName}
                                    onChange={(e) => {
                                        setData({ ...data, fullName: e.target.value });
                                        setErrors({ ...errors, fullName: '' });
                                    }}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF6B6B]'
                                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder="example@email.com"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData({ ...data, email: e.target.value });
                                        setErrors({ ...errors, email: '' });
                                    }}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF6B6B]'
                                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => {
                                        setData({ ...data, password: e.target.value });
                                        setErrors({ ...errors, password: '' });
                                    }}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                </div>
                                <input
                                    id="cpassword"
                                    name="cpassword"
                                    type="password"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        errors.cpassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF6B6B]'
                                    } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                    placeholder="Confirm your password"
                                    value={data.cpassword}
                                    onChange={(e) => {
                                        setData({ ...data, cpassword: e.target.value });
                                        setErrors({ ...errors, cpassword: '' });
                                    }}
                                />
                            </div>
                            {errors.cpassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.cpassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-[#FF6B6B] focus:ring-[#FF6B6B] border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="font-medium text-[#FF6B6B] hover:text-[#ff5252]">
                                    Terms and Conditions
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] transition-colors"
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                            </div>
                        </div>

            

                        {/* Sign In Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-[#FF6B6B] hover:text-[#ff5252]">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Register;