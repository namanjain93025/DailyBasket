import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {

    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    const { axios, navigate } = useAppContext();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            // console.log('inside forot psw component')
            const { data } = await axios.post('/api/reset/update-password-token', { email });

            if (data.success) {
                setSent(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <form
                onSubmit={submitHandler}
                className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Forgot</span> Password
                </p>

                {sent ? (
                    <p className="text-sm text-center w-full text-gray-600">
                        If that email exists in our system, a reset link has been sent.
                        Please check your inbox.
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-gray-500">
                            Enter your registered email and we'll send you a link to reset your password.
                        </p>
                        <div className="w-full">
                            <p>Email</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="type here"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </>
                )}

                <p
                    onClick={() => navigate('/')}
                    className="m-auto text-xs text-primary cursor-pointer hover:underline"
                >
                    Back to home
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;