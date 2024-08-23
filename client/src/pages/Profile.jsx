import React from 'react';
import { useSelector } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
    const currentUser = useSelector(state => state.user.currentUser);
    const { error, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({});

    const [updatedSuccess, setUpdatedSuccess] = React.useState(false);

    console.log(formData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`http://localhost:3000/user/update/${currentUser._id}`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdatedSuccess(true);
            // console.log(data);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`http://localhost:3000/user/delete/${currentUser._id}`, {
                credentials: 'include',
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess());
            console.log(data);
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('http://localhost:3000/signout', {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }

            dispatch(signOutUserSuccess());
        } catch (error) {
            dispatch(signOutUserFailure(error.message));
        }
    }

    return (
        <div className='p-4 min-h-screen mt-20'>
            <h1 className='text-3xl font-semibold text-center my-7 uppercase text-dark-500'>Profile</h1>

            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className='flex justify-center mb-4'>
                    <img src={currentUser.photo} alt='profile' className='rounded-full h-24 w-24 object-cover' />
                </div>

                <div className='flex flex-col max-w-md mx-auto p-3 w-full'>
                    <label htmlFor='username' className='text-xl text-gray-700'>
                        Username:
                    </label>
                    <input type='text' id='username' placeholder='Enter your username' onChange={handleChange} defaultValue={currentUser.username} className='border border-gray-300 mt-2 p-2 rounded-lg focus:outline-none w-full' />
                </div>

                <div className='flex flex-col max-w-md mx-auto p-3 w-full'>
                    <label htmlFor='email' className='text-xl text-gray-700'>
                        Email:
                    </label>
                    <input type='email' id='email' placeholder='Enter your email' onChange={handleChange} defaultValue={currentUser.email} className='border border-gray-300 mt-2 p-2 rounded-lg focus:outline-none w-full' />
                </div>

                <div className='flex flex-col max-w-md mx-auto p-3 w-full'>
                    <label htmlFor='password' className='text-xl text-gray-700'>
                        Password:
                    </label>
                    <input type='password' id='password' placeholder='Enter your password' onChange={handleChange} defaultValue={currentUser.password} className='border border-gray-300 mt-2 p-2 rounded-lg focus:outline-none w-full' />
                </div>

                <div className='flex flex-col max-w-md mx-auto p-3 w-full'>
                    <button disabled={loading} type='submit' className='bg-gray-700 text-white p-2 rounded-lg mt-2 hover:opacity-95 w-full'>
                        {loading ? 'Loading...' : 'UPDATE'}
                    </button>
                </div>

                <div className='flex flex-col max-w-md mx-auto p-3 w-full'>
                    <Link className='bg-green-700 text-center text-white p-2 uppercase rounded-lg hover:opacity-95' to={"/create-listing"} >
                        Create Listing
                    </Link>
                </div>

                <div className='flex justify-between max-w-md mx-auto p-3 w-full'>
                    <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete Account</span>
                    <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Logout</span>
                </div>

                {/* {error && <p className='text-red-500 text-center mt-5'> {error} </p>} */}
                <p className='text-red-500 text-center mt-5'>{error ? error : ''} </p>
                <p className='text-green-600 text-center mt-5'>{updatedSuccess ? 'User is updated successfully' : ''}</p>
            </form>
        </div>
    );
}