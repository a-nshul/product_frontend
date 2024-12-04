import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async values => {
    try {
      setLoading(true);

      // Submit the form data
      await axios.post('http://localhost:3000/api/products', values);
      message.success('Product added successfully!');
      form.resetFields(); // Clear the form
      navigate('/'); // Navigate to the product list page
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response && error.response.data) {
        // Display error message from API response
        message.error(error.response.data.message || 'Failed to add product.');
      } else {
        // Generic error message
        message.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Product</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          validateTrigger="onBlur"
          className="space-y-4"
        >
          {/* Product Name */}
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: 'Please enter the product name' },
              { max: 50, message: 'Product name cannot exceed 50 characters' },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter the description' },
              { min: 10, message: 'Description must be at least 10 characters long' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter the price' },
              { type: 'number', min: 1, message: 'Price must be greater than zero' },
            ]}
          >
            <InputNumber
              min={0}
              prefix="₹"
              placeholder="Enter price"
              className="w-full"
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Select placeholder="Select status">
              <Option value="available">available</Option>
              <Option value="out-of-stock">out-of-stock</Option>
            </Select>
          </Form.Item>

          {/* Form Buttons */}
          <div className="flex justify-between items-center space-x-4">
            <Button
              type="default"
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
