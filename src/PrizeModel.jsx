import { Table } from 'antd';

const columns = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Chi tiết sản phẩm ',
    dataIndex: 'age',
    width: 150,
  },
];

const PrizeModel = ({ prizes }) => {
  
  const dataSource = prizes.map((prize, index) => ({
    key: index, 
    name: prize.name,
    age: prize.author,
  }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: 50,
      }}
      scroll={{
        y: 240,
      }}
    />
  );
};

export default PrizeModel;
