import Card from "@/component/Card"
import TableFilter from "@/component/Filter"
import useRequest from "@/hooks/useRequest"
import { Button, Divider, Input, message, Table, TableColumnProps, Popconfirm } from "antd"
import { EmploymentListItem, employmentListDispatch, EmploymentListInfo, deleteEmploymentDispatch, exportEmploymentDispatch } from "./service"
import { EmploymentListQuery, useChange } from "./store"
import { useEffect } from "react"
import EditEmploymentDrawer from "./editDrawer"
import { useDialog } from "@/hooks/useDialog"



const EmploymentList = () => {
  const { open, holder } = useDialog(EditEmploymentDrawer);
  const { filter, onChangeFilter, onResetFilter } = useChange();

  const { run, data, loading } = useRequest<{ query: EmploymentListQuery }, EmploymentListInfo>({
    request: employmentListDispatch,
  });
  const { run: exportEmployment } = useRequest({
    request: exportEmploymentDispatch,
  }, {
    onSucess: (response) => {
      // console.log('response: ', response);
      // const url = window.URL.createObjectURL(
      //   new Blob([response.data])
      // );
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", "data.xls"); // 设置下载文件名
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);

    }
  })
  const initList = () => {
    run({
      query: {
        ...filter,
        page: 1,
      }
    })
  }
  const { run: deleteEmployment } = useRequest<{ body: { id: number } }, null>({
    request: deleteEmploymentDispatch,
  }, {
    onSucess() {
      message.success('删除成功')
      initList()
    }
  })
  useEffect(() => {
    run({
      query: {
        ...filter
      }
    });
  }, [filter.page, filter.pageSize]);

  const onSearch = () => {
    initList()
  }
  const onReset = () => {
    const initFilter = onResetFilter();
    run({
      query: {
        ...initFilter,
      }
    })
  }
  const delEmployment = (record: EmploymentListItem) => {
    deleteEmployment({
      body: {
        id: record.id
      }
    })
  }
  const exportFile = () => {
    // message.success('导出成功')
    // exportEmployment()
    const link = document.createElement("a");
    link.href = `http://${import.meta.env.PUBLIC_HOST}:${import.meta.env.PUBLIC_PORT}/employment/export`;
    link.setAttribute("download", "data.xls"); // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const onEdit = (record: EmploymentListItem) => {
    open({
      record,
      getList: initList
    })
  }
  const items = [{
    label: '姓名',
    field: 'name',
    component: <Input onChange={(e) => onChangeFilter('name')(e.target.value?.trim())} />
  }];
  const columns: TableColumnProps<EmploymentListItem>[] = [{
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
  }, {
    title: '银行卡号',
    dataIndex: 'bank',
    key: 'bank',
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '开户地',
    dataIndex: 'bankLocation',
    key: 'bankLocation'
  }, {
    title: '开户支行',
    dataIndex: 'bankBranch',
    key: 'bankBranch'
  }, {
    title: '金额',
    dataIndex: 'money',
    key: 'money'
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => {
      return <>
        <a onClick={() => onEdit(record)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm
          title={`确定删除【${record.name}】的信息吗`}
          onConfirm={() => delEmployment(record)}
        >
          <a >删除</a>
        </Popconfirm>
      </>
    }
  }]
  return <>
    {holder}
    <Card >
      <TableFilter items={items} onSearch={onSearch} onReset={onReset} />
    </Card>
    <Card>
      <Button type='primary' style={{ marginBottom: 12 }} onClick={exportFile}>导出</Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.data}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: filter.pageSize,
          current: filter.page,
          total: data?.total,
          showTotal: (total) => `共${total}条`,
          onChange: (page, pageSize) => {
            onChangeFilter('page')(page);
            onChangeFilter('pageSize')(pageSize);
          }
        }}
      />
    </Card >
  </>
}
export default EmploymentList;