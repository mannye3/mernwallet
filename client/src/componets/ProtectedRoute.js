import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd'; // Import Ant Design's Spin component
import { GetUserInfo } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/userSlice';
import DefaultLayout from './DefaultLayout';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users); // Access Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track loading state

  const getData = async () => {
    try {
      const response = await GetUserInfo();
      console.log('API Response:', response); // Check the API response

      if (response.success) {
        console.log('Dispatching User Data:', response.user); // Ensure user data exists
        dispatch(SetUser(response.user)); // Dispatch user data to Redux
        setLoading(false); // Stop loading
      } else {
        message.error(response.message || 'Failed to fetch user data.');
        navigate('/login'); // Redirect to login on failure
      }
    } catch (error) {
      console.error('Error Fetching User:', error);
      message.error('An error occurred. Redirecting to login...');
      navigate('/login'); // Handle API error
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug token

    if (token) {
      if (!user) {
        console.log('User not found in Redux. Fetching user data...');
        getData(); // Fetch user data
      } else {
        console.log('User found in Redux:', user); // Log the current user state
        setLoading(false); // Stop loading if user exists
      }
    } else {
      message.info('Please log in to access this page.');
      navigate('/login'); // Redirect if no token found
    }
  }, [user, navigate]); // Re-run effect if `user` state changes

  if (loading) {
    // Display a centered spinner during loading
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Loading..." /> {/* Ant Design spinner */}
      </div>
    );
  }

  if (!user) {
    return null; // Prevent children from rendering if no user
  }

  return (
    <DefaultLayout>
      {children} {/* Render any children passed to ProtectedRoute */}
    </DefaultLayout>
  );
}

export default ProtectedRoute;
