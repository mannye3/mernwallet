import React, { useEffect, useState } from 'react';

import { message, Table } from 'antd';
import TranFundModal from './TranFundModal';
import { getTransactions } from '../../apicalls/transactions';
import PageTitle from '../../componets/PageTitle';

import { useSelector } from 'react-redux';
import DepositModal from './DepositModal';

function Transactions() {
    const [showTransaferModal, setShowTransaferModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);

    
    const [data = [], setData] = React.useState([]); // Ensure data is initialized as an array
    const [loading, setLoading] = useState(false); // State to track loading
    const {user} = useSelector(state => state.users)

    const columns = [
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (text) => new Date(text).toLocaleString(), // Format the date
        },
        {
            title: "Transaction ID",
            dataIndex: "_id",
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (text,record) => {
                return 	record.sender._id === user._id ? "Debit" : "Credit"
            } 
        },
        {
  title: "Reference Account",
  dataIndex: "",
  render: (text, record) => {
    const referenceUser = record.sender._id === user._id ? record.receiver : record.sender;
    return `${referenceUser.firstname} ${referenceUser.lastname}`;
  }
},


         {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Status",
            dataIndex: "status",
        }
    ];

   const getData = async () => {
    try {
        setLoading(true); // Activate loader
        const response = await getTransactions(); // Fetch the transactions
        console.log("Response from API:", response); // Log the response for debugging

        if (response.success) {
            console.log("Data received:", response.data); // Log the actual data
            setData(response.data); // Set the data from the response
        } else {
            message.error(response.message); // Handle error message
        }
    } catch (error) {
        console.error('Error fetching transactions:', error); // Log the error for debugging
        message.error(error.message); // Handle fetch error
    } finally {
        setLoading(false); // Deactivate loader
    }
};


    useEffect(() => {
        getData(); // Fetch data when component mounts
    }, []);

    return (
        <div>
            <div className='flex justify-between items-center'>
                <PageTitle title="Transactions" />
                <div className='flex gap-1'>
                    <button className='primary-outlined-btn'  onClick={() => setShowDepositModal(true)} >Deposit</button>
                    <button className='primary-contained-btn'
                        onClick={() => setShowTransaferModal(true)}
                    >Transfer</button>
                </div>
            </div>

            <Table 
                columns={columns} 
                dataSource={data} // Use the data directly
                loading={loading} // Show loading state
                className='mt-2' 
                rowKey="_id" // Use a unique key for each row
            />

            {showTransaferModal && <TranFundModal
                showTransaferModal={showTransaferModal}
                setShowTransaferModal={setShowTransaferModal} 
            />} 


             {showDepositModal && <DepositModal
                showDepositModal={showDepositModal}
                setShowDepositModal={setShowTransaferModal} 
            />} 
        </div>
    );
}

export default Transactions;
