import React from 'react'
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const UpdatePassword = () => {

    const { token } = useParams();
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const { axios, navigate } = useAppContext();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill both fields");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/reset/reset-password', {
                token,
                password,
                
            });
            if (data.success) {
                toast.success(data.message);
                setDone(true);
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
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
                    <span className="text-primary">Update</span> Password
                </p>

                {done ? (
                    <p className="text-sm text-center w-full text-gray-600">
                        Password updated successfully. Redirecting to login...
                    </p>
                ) : (
                    <>
                        <div className="w-full">
                            <p>New Password</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="type here"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="password"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <p>Confirm Password</p>
                            <input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                placeholder="type here"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default UpdatePassword;