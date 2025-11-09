import {useState , useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
const Register = () => {

    const navigate = useNavigate();
    const [data , setData] = useState({
        fullName : "",
        email : "",
        password : "",
        cpassword : ""
    });

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const cpasswordRef = useRef(null);

    // const handleRegister = () => {
    //     console.log(fullName);
    // }

    const handilFocus = () => {
        emailRef.current.style.display = "none";
        passwordRef.current.style.display = "none";
        cpasswordRef.current.style.display = "none";
        nameRef.current.style.display = "none";

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!data.fullName) {
            nameRef.current.style.display = "block";
            return;
        }

        if(!data.email) {
            emailRef.current.style.display = "block";
            return;
        }

        if(!data.password ) {
            passwordRef.current.style.display = "block";
            return;
        }

        if(!data.cpassword) {
            cpasswordRef.current.style.display = "block";
            return;
        }

        if(data.password !== data.cpassword) {
            passwordRef.current.style.display = "block";
            cpasswordRef.current.style.display = "block";
            return;
        }

        let newData = {
            fullName : data.fullName,
            email : data.email,
            password : data.password
        }

        await axios.post('https://e-market-dh-03e9602f6d1a.herokuapp.com/api/auth/register' , newData)
            .then((response) => {
                console.log(response.data);
            }).catch((err)=>{
                console.log(err.response.data);
        });

        return navigate("/");
    }

    return (

        // <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        //
        //     <form onSubmit={handleSubmit}>
        //         <div className="grid sm:grid-cols-2 gap-8">
        //             <div>
        //                 <label className="text-slate-900 text-sm font-medium mb-2 block">Full Name</label>
        //                 <input name="fullName" type="text" onFocus={handilFocus}
        //                        className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
        //                        placeholder="Enter name..."
        //                        value={data.fullName}
        //                        onChange={(e) => setData({...data, fullName : e.target.value})}
        //                 />
        //                 <span className="text-red-500 text-sm hidden" ref={nameRef}>invalid name</span>
        //             </div>
        //             <div>
        //                 <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
        //                 <input name="email" type="email" onFocus={handilFocus}
        //                        className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
        //                        placeholder="Enter your email..."
        //                        value={data.email}
        //                        onChange = { (e) => setData({...data , email : e.target.value}) }
        //                 />
        //                 <span className="text-red-500 text-sm hidden" ref={emailRef}>invalid email</span>
        //
        //             </div>
        //             <div>
        //                 <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
        //                 <input name="password" type="password" onFocus={handilFocus}
        //                        className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
        //                        placeholder="Enter password"
        //                        value={data.password}
        //                        onChange = { (e) => setData({...data , password : e.target.value})}
        //                 />
        //                 <span className="text-red-500 text-sm hidden" ref={passwordRef}>invalid password</span>
        //
        //             </div>
        //             <div>
        //                 <label className="text-slate-900 text-sm font-medium mb-2 block">Confirm Password</label>
        //                 <input name="cpassword" type="password" onFocus={handilFocus}
        //                        className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
        //                        placeholder="Enter confirm password"
        //                        value={data.cpassword}
        //                        onChange = {(e) => setData({...data , cpassword : e.target.value})}
        //                 />
        //                 <span className="text-red-500 text-sm hidden" ref={cpasswordRef}>invalid password</span>
        //             </div>
        //         </div>
        //
        //         <div className="mt-12">
        //             <button type="submit"
        //                     className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
        //                 Sign up
        //             </button>
        //         </div>
        //     </form>
        //
        // </div>


        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-[480px] w-full">

                    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
                        <h1 className="text-slate-900 text-center text-3xl font-semibold">Sign Up</h1>
                        <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">Full Name</label>
                                <div className="relative flex items-center">
                                    <input name="fullName" type="text"  required onFocus={handilFocus}
                                           className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                           placeholder="Enter your name ..."
                                           value={data.fullName}
                                           onChange={(e) => setData({...data , fullName : e.target.value})}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                                         className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path
                                            d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                            data-original="#000000"></path>
                                    </svg>
                                </div>
                                    <span className="text-red-500 text-sm hidden" ref={nameRef}>invalid name</span>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                                <div className="relative flex items-center">
                                    <input name="email" type="email"  required onFocus={handilFocus}
                                           className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                           placeholder="Enter your email"
                                           value={data.email}
                                           onChange={(e) => setData({...data , email : e.target.value})}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                                         className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path
                                            d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                            data-original="#000000"></path>
                                    </svg>
                                </div>
                                    <span className="text-red-500 text-sm hidden" ref={emailRef}>invalid email</span>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type="password" required onFocus={handilFocus}
                                           className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                           placeholder="Enter password"
                                           value={data.password}
                                           onChange={(e )=> setData({...data , password : e.target.value })}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                                         className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                                        <path
                                            d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                            data-original="#000000"></path>
                                    </svg>
                                </div>
                                    <span className="text-red-500 text-sm hidden" ref={passwordRef}>invalid password</span>
                            </div>

                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">Confirme Password</label>
                                <div className="relative flex items-center">
                                    <input name="cpassword" type="password" required onFocus={handilFocus}
                                           className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                           placeholder="Confirme your password..."
                                           value={data.cpassword}
                                           onChange={(e )=> setData({...data , cpassword : e.target.value })}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
                                         className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                                        <path
                                            d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                            data-original="#000000"></path>
                                    </svg>
                                </div>
                                    <span className="text-red-500 text-sm text-sm hidden" ref={cpasswordRef}>invalid password</span>
                            </div>


                            <div className="!mt-12">
                                <button type="submit"
                                        className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                                    Sign in
                                </button>
                            </div>
                            <p className="text-slate-900 text-sm !mt-6 text-center">already have an account ?
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">Login
                                    here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    )

}

export default Register;