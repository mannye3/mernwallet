import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '../../componets/PageTitle';


function Index() {
  const {user} = useSelector(state=>state.users)
  const dispatch = useDispatch();
  

  return (
    <div>
      <PageTitle
      title={`Hello ${user.firstname}   ${user.lastname}, Welcome to the MERN WALLET`}
      />
    <div className='other-bg p-2 mt-2 br-3 w-50 flex flex-col gap-1'>
      <div className='flex justify-between '>
        <h1 className='text-md text-white'>
         Account Number
          </h1>
          <div className='text-md text-white'>
            {user._id}
          </div>
      

      </div>

      <div className='flex justify-between '>
        <h1 className='text-md text-white'>
        Balance
          </h1>
          <div className='text-md'>
           <h1 className='text-md text-white'>$ {user.balance || 0}</h1> 
          </div>
      

      </div>

    </div>


     <div className='card p-2 mt-2 br-3 w-50 flex flex-col gap-1'>
      <div className='flex justify-between '>
        <h1 className='text-md'>
         First Name
          </h1>
          <div className='text-md'>
            {user.firstname}
          </div>
      </div>

      <div className='flex justify-between '>
        <h1 className='text-md'>
         Last Name
          </h1>
          <div className='text-md'>
            {user.lastname}
          </div>
      </div>

       <div className='flex justify-between '>
        <h1 className='text-md'>
         Email
          </h1>
          <div className='text-md'>
            {user.email}
          </div>
      </div>


       <div className='flex justify-between '>
        <h1 className='text-md'>
         Phone
          </h1>
          <div className='text-md'>
            {user.phone}
          </div>
      </div>


 <div className='flex justify-between '>
        <h1 className='text-md'>
         Identification Type
          </h1>
          <div className='text-md'>
            {user.identification}
          </div>
      </div>


      <div className='flex justify-between '>
        <h1 className='text-md'>
         Identification Number
          </h1>
          <div className='text-md'>
            {user.identificationNumber}
          </div>
      </div>

      

    </div>
    </div>
  );
}

export default Index;
