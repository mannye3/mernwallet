import React, { useState } from 'react';
import { Form, Col, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../../apicalls/users';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        message.success(response.message);
        navigate('/login');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='m-5'>
      <div className="flex items-center justify-between">
        <h1 className='text-2xl'>MERN WALLET</h1>
        <h1 className='text-sm underline' onClick={() => navigate("/login")}>
          Already a member, Log in
        </h1>
      </div>

      <hr />
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item 
              label="First Name" 
              name="firstname" 
              rules={[{ required: true, message: 'Please input your First Name!' }]}>
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item 
              label="Last Name" 
              name="lastname" 
              rules={[{ required: true, message: 'Please input your Last Name!' }]}>
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item 
              label="Email" 
              name="email" 
              rules={[{ required: true, message: 'Please input your Email!' }]}>
              <input type="email" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item 
              label="Mobile" 
              name="phone" 
              rules={[{ required: true, message: 'Please input your Mobile Number!' }]}>
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item 
              label="Identification Type" 
              name="identification" 
              rules={[{ required: true, message: 'Please select your Identification Type!' }]}>
              <select>
                <option value="">Select Identification Type</option>
                <option value="National ID">National ID</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item 
              label="Identification Number" 
              name="identificationNumber" 
              rules={[{ required: true, message: 'Please enter your Identification Number!' }]}>
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item 
              label="Address" 
              name="address" 
              rules={[{ required: true, message: 'Please enter your Address!' }]}>
              <textarea type="text" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item 
              label="Password" 
              name="password" 
              rules={[{ required: true, message: 'Please enter your Password!' }]}>
              <input type="password" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please enter your Confirm Password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <input type="password" />
            </Form.Item>
          </Col>

          <Col span={24} className="flex justify-end">
            <button type="submit" className="primary-contained-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Register;
