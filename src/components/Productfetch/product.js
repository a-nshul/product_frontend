import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Switch, Space, Modal, Form, Select, Input, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/index'; // Import the API URLs

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch Products with Toggle Mapping
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URLS.PRODUCTS); // Use the API URL from the index.js
      if (response.data && response.data.products) {
        const updatedProducts = response.data.products.map(product => ({
          ...product,
          isRecommended: !!product.isRecommended,
          isBestseller: !!product.isBestseller,
        }));
        setProducts(updatedProducts);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (value, key, productId) => {
    try {
      await axios.patch(API_URLS.PRODUCT_BY_ID(productId), { [key]: value });
      setProducts(prevState =>
        prevState.map(product =>
          product._id === productId ? { ...product, [key]: value } : product
        )
      );
      message.success(`${key} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      message.error(`Failed to update ${key} ,plz click update icon for update toggle.`);
    }
  };

  const handleDelete = product => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(API_URLS.PRODUCT_BY_ID(selectedProduct._id));
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setIsModalVisible(false);
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product.');
    }
  };

  const Addpage = () => {
    navigate('/add-product');
  };

  const handleEdit = product => {
    setSelectedProduct(product);
    form.setFieldsValue({
      ...product,
      isRecommended: !!product.isRecommended,
      isBestseller: !!product.isBestseller,
    });
    setIsEditModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(API_URLS.PRODUCT_BY_ID(selectedProduct._id), values);
      setProducts(prevState =>
        prevState.map(product =>
          product._id === selectedProduct._id ? { ...product, ...values } : product
        )
      );
      setIsEditModalVisible(false);
      message.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product.');
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Recommended',
      key: 'isRecommended',
      render: (_, record) => (
        <Switch
          checked={record.isRecommended}
          onChange={checked => handleToggle(checked, 'isRecommended', record._id)}
        />
      ),
    },
    {
      title: 'Bestseller',
      key: 'isBestseller',
      render: (_, record) => (
        <Switch
          checked={record.isBestseller}
          onChange={checked => handleToggle(checked, 'isBestseller', record._id)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} />
          <DeleteOutlined onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product List</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={Addpage}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(products) ? products : []}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        Are you sure you want to delete {selectedProduct?.name}?
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Product"
        visible={isEditModalVisible}
        onOk={saveEdit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="out-of-stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isRecommended"
            label="Recommended"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="isBestseller"
            label="Bestseller"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
