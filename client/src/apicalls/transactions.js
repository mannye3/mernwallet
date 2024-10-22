const {axiosInstance} = require(".");


// Verify Receiver Account Information
export const VerifyAccount = async (payload) =>{
    try {
        const {data} = await axiosInstance.post("http://localhost:5000/api/transaction/verify-account", payload);
        return data;
    } catch (error) {
        return error.response.data
    }
}



export const TransferFund = async (payload) => {
    try {
        const {data} = await axiosInstance.post("http://localhost:5000/api/transaction/transfer-fund", payload);
        return data;
    } catch (error) {
        return error.response.data
    }
}





export const getTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.get(
      "http://localhost:5000/api/transaction/user-transactions",
      {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent.
      }
    );

    console.log('API Response Data:', data); // Check the API response.

    if (data.success) {
      // Return the transactions directly from the response
      return { success: true, data: data.data }; // Make sure to return the array of transactions.
    }
    
    return { success: false, message: 'Failed to fetch user data' };
  } catch (error) {
    console.error('API Error Response:', error.response?.data);
    return error.response?.data || { success: false, message: 'Unknown error occurred' };
  }
};





export const DepositFund = async (payload) => {
    try {
        const {data} = await axiosInstance.post("http://localhost:5000/api/transaction/deposit-fund", payload);
        return data;
    } catch (error) {
        return error.response.data
    }
}






