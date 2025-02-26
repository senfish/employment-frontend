import { UseDialogProps } from "@/hooks/useDialog"
import { Popup, } from "antd-mobile"
import { Button, Form, Input, Drawer, message, Spin, Upload, InputNumber, } from 'antd';
import { EmploymentListItem } from "../service"
import './index.less';
import { LeftOutline, UploadOutline } from "antd-mobile-icons";
import { useEffect } from "react";
import { filterEmpty } from '@/utils/filterEmpty';
import useRequest from "@/hooks/useRequest";
import { CreateEmployment, submitDispatch, uploadBankCardDispatch, uploadIDCardDispatch } from "@/pages/user/service";
// import { Upload } from "antd";


interface EditEmploymentDrawer extends UseDialogProps {
  record: EmploymentListItem
  getList: () => void
}
const EditPopup = (props: EditEmploymentDrawer) => {
  const { visible, closeDialog, record, getList } = props;
  const [form] = Form.useForm();
  const { run, loading } = useRequest<{ body: CreateEmployment }, null>({
    request: submitDispatch
  }, {
    onSucess: () => {
      // message.success('提交成功');
      closeDialog();
      getList();
      // form.resetFields();
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
    if (record) {
      form.setFieldsValue({
        ...record,
      })
    }
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

  return <Popup
    visible={visible}
    className="edit-popup"
    position='right'
    onMaskClick={() => {
      // setVisible1(false)
    }}
    style={{ width: '200px' }}
    onClose={() => {
      // setVisible1(false)
    }}
  // bodyStyle={{ height: '40vh' }}
  >
    <div className="edit-employment-wrapper">
      <div className="back" onClick={closeDialog}>
        <LeftOutline />
      </div>
      <div className="form-content">
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
              {/* ImageUploader */}
              <Upload
                showUploadList={false}
                maxCount={1}
                customRequest={(options) => handleUpload(options, 'ID')}
              >
                <Button><UploadOutline />身份证正面上传</Button>
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
                <Button ><UploadOutline />银行卡上传</Button>
              </Upload>
            </Form.Item>
            <Form.Item label='开户地' name='bankLocation' rules={[{ required: true, message: '请输入开户地' }]}>
              <Input placeholder='请输入开户地' />
            </Form.Item>
            <Form.Item label='开户支行' name='bankBranch' rules={[{ required: true, message: '请输入开户支行' }]}>
              <Input placeholder='请输入开户支行' />
            </Form.Item>
            <Form.Item label='金额' name='money' >
              <Input
                style={{ width: '100%' }}
                placeholder='请输入金额'
              // precision={2}
              // min={0}
              // max={100 * 10000}
              />
            </Form.Item>
            <Form.Item label='手机号' name='phone' rules={[{ required: true, message: '请输入手机号' }]}>
              <Input placeholder='请输入手机号' />
            </Form.Item>
          </Form>
        </Spin>
      </div>
      <div className="footer">
        <Button type='primary' onClick={onSubmit} loading={loading}>提交</Button>
      </div>
    </div>

  </Popup>
}


export default EditPopup