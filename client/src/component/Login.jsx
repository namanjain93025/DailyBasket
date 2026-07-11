import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [otpSent, setOtpSent] = React.useState(false);
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password, otp });
            if (data.success) {
                setUser(data.user);
                setShowUserLogin(false);
                navigate('/')

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendOtpHandler = async () => {
        if (!email) {
            toast.error("Fill email");
            return;
        }
        try {
            console.log('Otp send successfully')
            const { data } = await axios.post('/api/user/sendOtp', { name, email });
            if (data.success) {
                setOtpSent(true);
                toast.success("OTP sent to your email");
            } else {
                toast.error(data.message);
                console.log(data);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };


    const switchState = (newState) => {
        setState(newState);
        setOtpSent(false);
        setOtp("");
    };

    return (
        <div onClick={() => { setShowUserLogin(false) }} className=' fixed left-0 right-0 top-0 bottom-0 z-10 flex items-center text-sm text-gray-600 text-black/10'>
            <form onSubmit={submitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>

                {state === "register" && (
                    <div className="w-full flex flex-col gap-2">
                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={sendOtpHandler}
                                className="text-primary border border-primary rounded-md px-3 py-1.5 text-xs hover:bg-primary hover:text-white transition-all cursor-pointer w-fit"
                            >
                                Send OTP
                            </button>
                        ) : (
                            <>
                                <div className="w-full">
                                    <p>OTP</p>
                                    <input
                                        onChange={(e) => setOtp(e.target.value)}
                                        value={otp}
                                        placeholder="type here"
                                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <button
                                        type="button"
                                        onClick={sendOtpHandler}
                                        className="text-gray-500 underline hover:text-primary transition-all cursor-pointer"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span onClick={() => switchState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span onClick={() => switchState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button
                    type="submit"
                    disabled={state === "register" && !otpSent}
                    className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
};
export default Login