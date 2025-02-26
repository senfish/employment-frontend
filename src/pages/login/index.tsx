import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import smartphone from '@/assets/smartphone.png'
import lock from '@/assets/lock.png'
import './index.less';
import useRequest from '@/hooks/useRequest';
import { loginDispatch } from './service';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { run } = useRequest<{ body: { username: string, password: string } }, { token: string }>({
    request: loginDispatch
  }, {
    onSucess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/employment')
    }
  })
  const login = async () => {
    const info = await form.validateFields();
    run({
      body: {
        username: info.phone,
        password: info.password
      }
    })
  }
  return <div className='login'>
    <div className='login-wrapper' >
      <div className='login-content-left'>
        <div className='login-content-left-wrapper'>
          <div className='title'>LOGO</div>
          <div className='hello'>Hello</div>
          <div className='welcome'>welcome!</div>
          <div className='footer'>欢迎登录管理系统</div>
        </div>
      </div>
      <div className='login-content-right'>
        <div className='login-title'>用户登录</div>
        <div className='login-form'>
          <Form form={form} layout='vertical'>
            <Form.Item label='手机号' name='phone' rules={[{ required: true, message: '请输入手机号' }]}>
              <Input prefix={<img src={smartphone} width={24} height={24} />} placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item
              label='登录密码'
              name='password'
            >
              <Input.Password prefix={<img src={lock} width={24} height={24} />} />
            </Form.Item>
          </Form>
        </div>
        <Button size='large' className='login-btn' type='primary' onClick={login}>登录</Button>
      </div>
    </div >
  </div >
}


export default Login;