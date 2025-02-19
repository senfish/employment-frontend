import Card from "@/component/Card";
import TableFilter from "@/component/Filter";
import { Button, Divider, Input, InputNumber, Table } from "antd";
import { TableColumnProps } from "antd/lib";



const TaskList = () => {
  const onSearch = () => {

  }
  const onReset = () => {

  }
  const items = [{
    label: '任务名称',
    field: 'taskName',
    component: <Input />
  }];
  const columns: TableColumnProps<any>[] = [{
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
  }, {
    title: '填写人数',
    dataIndex: 'amount',
    key: 'amount',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '是否过期',
    dataIndex: 'isExpired',
    key: 'isExpired'
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: () => {
      return <>
        <a >编辑</a>
        <Divider type="vertical" />
        <a >删除</a>
        <Divider type="vertical" />
        <a >导出</a>
        <Divider type="vertical" />
        <a >录入地址</a>
      </>
    }
  }]
  return <>
    <Card >
      <TableFilter items={items} onSearch={onSearch} onReset={onReset} />
    </Card>
    <Card>
      <Button type='primary' style={{ marginBottom: 12 }}>新建任务</Button>
      <Table
        columns={columns}
        dataSource={[{ taskName: 'sens' }, { taskName: 'fdq' }]}
      />
    </Card>
  </>
}

export default TaskList;