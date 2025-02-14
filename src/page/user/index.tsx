import './index.less';
import { Button, InputNumber, Upload, } from 'antd';
import axios from 'axios';
import { useState } from 'react';

const User = () => {
  console.log('import.meta.env', import.meta.env.PUBLIC_HOST);
  const [idCard, setIDCard] = useState<number | null>();
  const [bankCard, setBankCard] = useState<number | null>();
  const handleUpload = async ({ file }, type: 'ID' | 'BANK') => {
    console.log('type: ', type);
    const formData = new FormData();
    formData.append('file', file)
    formData.append('type', type)
    if (type === 'ID') {
      const { data } = await axios.post(`http://${import.meta.env.PUBLIC_HOST}:3030/upload/id-card`, formData)
      setIDCard(() => data?.number)
    } else {
      const { data } = await axios.post(`http://${import.meta.env.PUBLIC_HOST}:3030/upload/bank`, formData)
      setBankCard(() => data?.result?.bank_card_number);
    }

  }
  const onChangeCard = (value: number | null, type: 'ID' | 'BANK') => {
    if (type === 'ID') {
      setIDCard(value)
    } else {
      setBankCard(value)
    }
  }

  return <div className="user">
    <InputNumber style={{ width: '400px' }} value={idCard} onChange={(value) => onChangeCard(value, 'ID')} precision={0} />
    <Upload
      showUploadList={false}
      maxCount={1}
      customRequest={(options) => handleUpload(options, 'ID')}
    >
      <Button>身份证上传</Button>
    </Upload>
    <InputNumber style={{ width: '400px' }} value={bankCard} onChange={(value) => onChangeCard(value, 'BANK')} precision={0} />
    <Upload
      showUploadList={false}
      maxCount={1}
      customRequest={(options) => handleUpload(options, 'BANK')}
    >
      <Button>银行卡上传</Button>
    </Upload>
  </div>
}

export default User;