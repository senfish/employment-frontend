import { PlusOutlined } from '@ant-design/icons';
import './index.less';
import { Button, Form, Input, InputNumber, message, Spin, Upload, } from 'antd';
import { useEffect, useState } from 'react';
import { filterEmpty } from '@/utils/filterEmpty';
import useRequest from '@/hooks/useRequest';
import { CreateEmployment, submitDispatch, uploadBankCardDispatch, uploadIDCardDispatch } from './service';

const User = () => {
  const [form] = Form.useForm();

  const { run, loading } = useRequest<{ body: CreateEmployment }, null>({
    request: submitDispatch
  }, {
    onSucess: () => {
      message.success('提交成功');
      form.resetFields();
    }
  });
  const { run: uploadIDCard, loading: uploadIDLoading } = useRequest<{
    body: FormData,
  }, {
    idCard: string,
    name: string
  }>({
    request: uploadIDCardDispatch
  }, {
    onSucess: (data) => {
      form.setFieldsValue({
        idCard: filterEmpty(data?.idCard),
        name: filterEmpty(data?.name),
      })
    }
  })
  const { run: uploadBankCard, loading: uploadBankLoading } = useRequest<{
    body: FormData,
  }, {
    bank: string
    bankCardType: number
    bankName: string
  }>({
    request: uploadBankCardDispatch
  }, {
    onSucess: (data) => {
      form.setFieldsValue({
        bank: filterEmpty(data?.bank),
      })
    }
  })
  useEffect(() => {
    // 这个页面应该是带有路由id才能进来，拿id取后端请求是否过期
    // 过期的话，不让填写

  }, []);
  const handleUpload = async ({ file }, type: 'ID' | 'BANK') => {
    const formData = new FormData();
    formData.append('file', file)
    if (type === 'ID') {
      uploadIDCard({
        body: formData,
      })
    } else {
      uploadBankCard({
        body: formData,
      })
    }
  }

  const onSubmit = async () => {
    // 提交数据也要校验任务ID，任务ID过期不允许提交
    const info = await form.validateFields();
    run({
      body: {
        ...info,
      }
    })
  }
  return <div className="user">
    <div className='user-header'>员工信息录入</div>
    {/* <input type="file" accept="image/*" capture="user"></input> */}
    <Spin spinning={loading || uploadIDLoading || uploadBankLoading}>
      <Form layout='vertical' form={form}>
        <Form.Item
          label='身份证号'
          name='idCard'
          style={{ display: 'inline-block', width: '100%', marginBottom: 0 }}
          rules={[{
            required: true,
            message: '请输入身份证号或者上传身份证正面照片',
          }]}
        >
          <Input
            placeholder='请输入身份证或者上传身份证正面照片'
            style={{ width: '100%' }}
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
          <Input
            placeholder='请输入银行卡号或者上传银行卡照片'
            style={{ width: '100%' }}
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
        <Form.Item label='开户地' name='bankLocation' rules={[{ required: true, message: '请输入开户地' }]}>
          <Input placeholder='请输入开户地' />
        </Form.Item>
        <Form.Item label='开户支行' name='bankBranch' rules={[{ required: true, message: '请输入开户支行' }]}>
          <Input placeholder='请输入开户支行' />
        </Form.Item>
        <Form.Item
          label='手机号'
          name='phone'
          rules={[{
            required: true, validator: (rule, value) => {
              const regex = /^1[3-9]\d{9}$/;
              if (!regex.test(value)) {
                return Promise.reject('请输入正确的手机号');
              }
              return Promise.resolve();
            }
          }]}>
          <InputNumber style={{ width: '100%' }} placeholder='请输入手机号' />
        </Form.Item>
      </Form>
      <div className='footer'><Button type='primary' onClick={onSubmit}>提交</Button></div>
    </Spin>
  </div>
}

export default User;