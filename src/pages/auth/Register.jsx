import {useState , useRef} from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">

            <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Full Name</label>
                        <input name="fullName" type="text" onFocus={handilFocus}
                               className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                               placeholder="Enter name..."
                               value={data.fullName}
                               onChange={(e) => setData({...data, fullName : e.target.value})}
                        />
                        <span className="text-red-500 hidden" ref={nameRef}>invalid name</span>
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                        <input name="email" type="email" onFocus={handilFocus}
                               className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                               placeholder="Enter your email..."
                               value={data.email}
                               onChange = { (e) => setData({...data , email : e.target.value}) }
                        />
                        <span className="text-red-500 hidden" ref={emailRef}>invalid email</span>

                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                        <input name="password" type="password" onFocus={handilFocus}
                               className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                               placeholder="Enter password"
                               value={data.password}
                               onChange = { (e) => setData({...data , password : e.target.value})}
                        />
                        <span className="text-red-500 hidden" ref={passwordRef}>invalid password</span>

                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Confirm Password</label>
                        <input name="cpassword" type="password" onFocus={handilFocus}
                               className="bg-slate-100 w-full text-slate-900 text-sm px-4 py-3 rounded-md focus:bg-transparent outline-blue-500 transition-all"
                               placeholder="Enter confirm password"
                               value={data.cpassword}
                               onChange = {(e) => setData({...data , cpassword : e.target.value})}
                        />
                        <span className="text-red-500 hidden" ref={cpasswordRef}>invalid password</span>
                    </div>
                </div>

                <div className="mt-12">
                    <button type="submit"
                            className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )

}

export default Register;