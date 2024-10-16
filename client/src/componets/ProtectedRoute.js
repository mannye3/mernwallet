import React, { useEffect, useState } from 'react';

import { message } from 'antd';
import { GetUserInfo } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';


function ProtectedRoute(props) {
      const [userData, setUserData] = useState(null);
      const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await GetUserInfo();
      if (response.success) {
        setUserData(response.data);
       
      }else{
        message.error(response.message);
        navigate('/login'); // Redirect to login page if fetch fails.
      }
    } catch (error) {
        navigate('/login'); // Redirect to login page if fetch fails.
      message.error(error.message);
    }
  };  

  // Use the effect correctly to fetch data on component mount.
  useEffect(() => {
   if(localStorage.getItem("token")){
    if(!userData)
    {
         getData();
    }
   }else{
     message.info('Please login to access the protected route.');
    navigate("/login");
   }
  }, []);

  return ( 
    <div>
     {props.children}
    </div>
  )
}

export default ProtectedRoute
