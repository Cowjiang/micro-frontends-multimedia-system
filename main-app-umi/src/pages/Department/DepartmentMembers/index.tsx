import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { useNavigate, useParams } from '@@/exports';
import { departmentApi } from '@/services/api';
import { Department } from '@/services/api/modules/department/typings';
import { Button, Table, Tag, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import { useSize } from 'ahooks';

const {Title, Text} = Typography;

interface DataType {
  key: React.Key;
  id: number;
  username: string;
  role: string[];
  department: string;
  position: string;
  phone: number;
  email: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '编号',
    width: 80,
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    sorter: (a, b) => a.id - b.id
  },
  {
    title: '成员',
    width: 120,
    dataIndex: 'username',
    key: 'username',
    fixed: 'left'
  },
  {
    title: '角色',
    width: 200,
    dataIndex: 'role',
    key: 'role',
    render: (roles: string[]) => (
      <div>
        {roles.map((role) => {
          let color = 'orange';
          return (
            <Tag color={color} key={role}>
              {role}
            </Tag>
          );
        })}
      </div>
    ),
    filters: [
      {
        text: '管理员',
        value: '管理员'
      },
      {
        text: '负责人',
        value: '负责人'
      },
      {
        text: '普通成员',
        value: '普通成员'
      }
    ],
    onFilter: (value, record) => record.role.findIndex(role => role === value) !== -1
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 180
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: 180
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 180
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    key: 'email',
    width: 200
  },
  {
    title: '',
    key: 'operation',
    fixed: 'right',
    width: 60,
    render: () => <Button type="text"><i className="fi fi-bs-menu-dots" /></Button>
  }
];

const DepartmentMembersPage: React.FC = () => {
  const navigate = useNavigate();

  const tableContainerRef = useRef(null);
  const tableContainerSize = useSize(tableContainerRef);
  const bodySize = useSize(document.body);
  const [tableContainerHeight, setTableContainerHeight] = useState(0);
  useEffect(() => {
    if (tableContainerSize?.height) {
      setTableContainerHeight(tableContainerSize.height - 130);
    }
  }, [tableContainerSize, bodySize]);

  const [tableData, setTableData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const {id: departmentId} = useParams();
  const [departmentInfo, setDepartmentInfo] = useState<Department>({});
  let departmentName: string;
  useEffect(() => {
    if (departmentId) {
      departmentApi.getDepartmentDetail(departmentId).then(res => {
        if (res.data) {
          setDepartmentInfo(res.data);
          departmentName = res.data.name ?? '';
          getTableData();
        }
      }).catch(e => {
        console.error(e);
      });
    }
  }, []);
  useSetDocTitle(`部门成员${departmentInfo.name ? ' - ' + departmentInfo.name : ''}`);

  // 获取表格数据
  const getTableData = () => {
    if (departmentId) {
      setTableLoading(true);
      const data = [...tableData];
      for (let i = 1; i <= 500; i++) {
        data.push({
          key: i,
          id: i,
          username: `破壁机 ${i}`,
          role: i % 2 ? ['管理员', '负责人'] : ['普通成员'],
          department: departmentName ?? '',
          position: '/',
          phone: 13711401096,
          email: 'cowjiang@163.com'
        });
      }
      departmentApi.getDepartmentUser(departmentId).then(res => {
        console.log(res.data);
      });
      setTimeout(() => {
        setTableData(data);
        setSelectedRowKeys([]);
        setTableLoading(false);
      }, 500);
    }
  };

  // 表格行多选更改事件
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(selectedRows);
  };

  return (
    <div className="department-members-page w-full h-full px-12 flex flex-col">
      <div className="w-full mt-2 flex flex-shrink-0">
        <div className="w-full max-w-[70%] flex flex-col">
          <Title level={3}>{departmentInfo.name ?? ''}(10人)</Title>
          <Text ellipsis={true}>部门简介：{departmentInfo.description ?? ''}</Text>
        </div>
        <div className="h-full ml-auto flex flex-shrink-0 items-end">
          <Button ghost type="primary" onClick={() => navigate(`/department/${departmentId}/detail`)}>
            部门详情
          </Button>
          <Button className="ml-4" type="primary">
            编辑人员
          </Button>
        </div>
      </div>
      <div className="w-full h-[30px] flex-shrink-0"></div>
      <div className="w-full min-h-[400px] flex-grow" ref={tableContainerRef}>
        <Table
          columns={columns}
          dataSource={tableData}
          scroll={{x: 1500, y: tableContainerHeight ?? 800}}
          loading={{
            size: 'large',
            spinning: tableLoading
          }}
          // size="small"
          pagination={{
            pageSize: 20,
            showSizeChanger: false
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange
          }}
          // bordered
        />
      </div>
      {/*<div className="w-full h-[100px] flex-shrink-0"></div>*/}
    </div>
  );
};

export default DepartmentMembersPage;
