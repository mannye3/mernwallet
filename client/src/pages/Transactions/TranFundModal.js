import { Form, Modal, message, Input, InputNumber, Spin } from 'antd';
import React, { useState } from 'react';
import { TransferFund, VerifyAccount } from './../../apicalls/transactions';
import { useSelector } from 'react-redux';

function TranFundModal({ showTransaferModal, setShowTransaferModal }) {
  const { user } = useSelector((state) => state.users);
  const [isVerify, setIsVerify] = useState('');
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const verifyAccount = async (receiver) => {
    try {
      const response = await VerifyAccount({ receiver });
      if (response.success) {
        setIsVerify('true');
        setReceiverDetails(response.data);
        message.success('Account Verified Successfully');
      } else {
        setIsVerify('false');
        message.error('Invalid Account');
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      setIsVerify('false');
      message.error('Error verifying account');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        sender: user._id,
        status: 'success',
      };

      const response = await TransferFund(payload);

      if (response.success) {
        message.success('Transfer Successful');
        handleModalClose();
        window.location.reload(); // Reload the entire page
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiverChange = (e) => {
    const receiver = e.target.value;
    form.setFieldsValue({ receiver });

    if (receiver) {
      if (receiver === user._id) {
        message.error('You cannot send money to yourself.');
        form.setFieldsValue({ receiver: '' });
        return;
      }
      verifyAccount(receiver);
    } else {
      setIsVerify('');
      setReceiverDetails(null);
    }
  };

  const handleModalClose = () => {
    form.resetFields();
    setIsVerify('');
    setReceiverDetails(null);
    setShowTransaferModal(false);
  };

  const amount = Number(form.getFieldValue('amount')) || 0;

  return (
    <Modal
      title="Transfer Fund"
      open={showTransaferModal}
      onCancel={handleModalClose}
      footer={null}
    >
      <Spin spinning={loading} tip="Processing Transfer...">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="receiver"
            label="Account Number"
            rules={[
              { required: true, message: 'Please enter an account number' },
              { len: 24, message: 'Receiver account number must be 24 characters long.' },
            ]}
          >
            <Input
              type="text"
              placeholder="Enter account number"
              maxLength={24}
              onChange={handleReceiverChange}
            />
          </Form.Item>

          {isVerify === 'true' && receiverDetails && (
            <div className="success-bg">
              <h1 className="text-sm">
                Account Verified: {receiverDetails.firstname} {receiverDetails.lastname}
              </h1>
              <p>Email: {receiverDetails.email}</p>
            </div>
          )}

          {isVerify === 'false' && (
            <div className="error-bg">
              <h1 className="text-sm">Invalid Account</h1>
            </div>
          )}

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              {
                validator: (_, value) => {
                  if (value < 1) {
                    return Promise.reject('Amount must be greater than zero.');
                  }
                  if (value > user?.balance) {
                    return Promise.reject(`Insufficient Balance: $${user?.balance || 0}`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} placeholder="Enter amount" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            {amount < user.balance && isVerify === 'true' && (
              <button className="primary-contained-btn" htmlType="submit">
                Transfer
              </button>
            )}
            <button className="primary-outlined-btn" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

export default TranFundModal;
