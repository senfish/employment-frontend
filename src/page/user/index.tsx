import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { Button, Form, Input, InputNumber, Spin, Upload, } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { filterEmpty } from '@/utils/filterEmpty';
import useRequest from '@/hooks/useRequest';

const User = () => {
  const [form] = Form.useForm();
  const [idCard, setIDCard] = useState<string | null>();
  const [bankCard, setBankCard] = useState<string | null>();

  // const {run, } = useRequest({
  //   request: 
  // })
  useEffect(() => {
    // 这个页面应该是带有路由id才能进来，拿id取后端请求是否过期
    // 过期的话，不让填写

  }, []);
  const handleUpload = async ({ file }, type: 'ID' | 'BANK') => {
    console.log('type: ', type);
    const formData = new FormData();
    formData.append('file', file)
    formData.append('type', type)
    if (type === 'ID') {
      const { data } = await axios.post(`http://${import.meta.env.PUBLIC_HOST}:3030/upload/id-card`, formData)
      setIDCard(() => filterEmpty(data?.number))
      form.setFieldsValue({
        id: filterEmpty(data?.number),
        name: filterEmpty(data?.name),
      })
    } else {
      const { data } = await axios.post(`http://${import.meta.env.PUBLIC_HOST}:3030/upload/bank`, formData);
      form.setFieldsValue({
        bank: filterEmpty(data?.result?.bank_card_number),
      })
      // setBankCard(() => filterEmpty(data?.result?.bank_card_number));
    }

  }
  const onChangeCard = (value: number | null, type: 'ID' | 'BANK') => {
    if (type === 'ID') {
      setIDCard(value)
    } else {
      setBankCard(value)
    }
  }
  const onSubmit = async () => {
    // 提交数据也要校验任务ID，任务ID过期不允许提交
    const info = await form.validateFields();
    console.log('form values: ', info);
  }
  return <div className="user">
    <div className='user-header'>员工信息录入</div>
    {/* <input type="file" accept="image/*" capture="user"></input> */}
    <Spin spinning={false}>
      <Form layout='vertical' form={form}>
        <Form.Item
          label='身份证号'
          name='id'
          style={{ display: 'inline-block', width: '100%', marginBottom: 0 }}
          rules={[{
            required: true,
            message: '请输入身份证号或者上传身份证正面照片',
          }]}
        >
          <InputNumber
            placeholder='请输入身份证或者上传身份证正面照片'
            style={{ width: '100%' }}
            value={idCard}
            onChange={(value) => onChangeCard(value, 'ID')}
            precision={0}
          />
        </Form.Item>
        <Form.Item style={{ display: 'inline-block', marginTop: '12px', }}>
          <Upload
            showUploadList={false}
            maxCount={1}
            customRequest={(options) => handleUpload(options, 'ID')}
          >
            <Button icon={<PlusOutlined />}>身份证正面上传</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label='姓名'
          name='name'
          rules={[{
            required: true,
            message: '请输入姓名',
          }]}>
          <Input placeholder='请输入姓名' />
        </Form.Item>
        <Form.Item
          label='银行卡号'
          name='bank'
          style={{ display: 'inline-block', width: '100%', marginBottom: 0 }}
          rules={[{
            required: true,
            message: '请输入姓名',
          }]}
        >
          <InputNumber
            placeholder='请输入银行卡号或者上传银行卡照片'
            style={{ width: '100%' }}
            value={bankCard}
            onChange={(value) => onChangeCard(value, 'BANK')}
            precision={0}
          />
        </Form.Item>
        <Form.Item style={{ display: 'inline-block', marginTop: '12px' }}>
          <Upload
            showUploadList={false}
            maxCount={1}
            customRequest={(options) => handleUpload(options, 'BANK')}
          >
            <Button icon={<PlusOutlined />}>银行卡上传</Button>
          </Upload>
        </Form.Item>
        <Form.Item label='开户地' name='bank-location' rules={[{ required: true, message: '请输入开户地' }]}>
          <Input placeholder='请输入开户地' />
        </Form.Item>
        <Form.Item label='开户支行' name='bank-branch' rules={[{ required: true, message: '请输入开户支行' }]}>
          <Input placeholder='请输入开户支行' />
        </Form.Item>
        <Form.Item label='手机号' name='phone' rules={[{ required: true, message: '请输入手机号' }]}>
          <Input placeholder='请输入手机号' />
        </Form.Item>
      </Form>
      <div className='footer'><Button type='primary' onClick={onSubmit}>提交</Button></div>
    </Spin>
  </div>
}

export default User;