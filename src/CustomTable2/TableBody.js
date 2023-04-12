const TableBody = ({ tableData, columns }) => {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id}>
            {columns.map(({ dataField, formatter }) => {
              let tData = data[dataField] ? data[dataField] : "——";
              return <td key={dataField}>{formatter ? formatter(data[dataField], data, tableData) : tData}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
