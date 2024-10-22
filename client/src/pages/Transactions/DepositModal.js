 import { Form, Modal, InputNumber, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { DepositFund } from '../../apicalls/transactions';
import { useSelector } from 'react-redux';

function DepositModal({ showDepositModal, setShowDepositModal, reloadData }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
    const {user} = useSelector(state=>state.users)

 

  const handleModalClose = () => {
    form.resetFields();
    
  };

 const onToken = async (token) => {
  try {
     setLoading(true);
    await form.validateFields(); // Ensure form validation
    setLoading(true);

    const amount = form.getFieldValue('amount');
    const userId = user._id; // Assuming user._id contains the logged-in user's ID

    // Ensure userId is defined
    if (!userId) {
      throw new Error('User ID is required for the deposit.');
    }

    // Pass userId along with token and amount to the DepositFund API call
    const response = await DepositFund({ token, amount, userId });

    if (response.success) {
      message.success('Deposit successful!');
      handleModalClose(); // Close the modal
       window.location.reload(); // Reload the entire page
    } else {
      throw new Error(response.message || 'Deposit failed');
    }
  } catch (error) {
    message.error(error.message);
  } finally {
    setLoading(false); // Reset loading state
  }
};


  return (
    <Modal
      title="Deposit"
      open={showDepositModal}
       onCancel={handleModalClose}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Spin spinning={loading} tip="Processing ...">
        <Form layout="vertical" form={form}>
         <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              
            ]}
          >
             <InputNumber min={1} placeholder="Enter amount" style={{ width: '100%' }} />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <StripeCheckout
              token={onToken}
              currency="USD"
              amount={form.getFieldValue('amount') * 100} // Convert to cents
              stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
              <button
                className="primary-contained-btn"
                disabled={loading}
              >
                Deposit
              </button>
            </StripeCheckout>

           <button className="primary-outlined-btn" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </Form>
        </Spin>
      </div>
    </Modal>
  );
}

export default DepositModal;