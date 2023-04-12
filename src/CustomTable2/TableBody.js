import { useMemo } from "react";

const TableBody = ({ tableData, columns }) => {
  const heders= useMemo(()=>{return columns.filter(i=>(!i.hidden))
  },[columns])
  
  return (
    <tbody>
      {tableData.map((row, rowIndex) => {
        return (
          <tr key={row.id} >
            {heders.map(({
              dataField,
              formatter,
              style = () => ({}),
              attrs = () => ({}),
              classes = () => ({}) },
              colIndex) => {
              let tData = row[dataField] ? row[dataField] : "——";

              return <td key={dataField}
                {...attrs(dataField, row, rowIndex, colIndex)}
                style={style(dataField, row, rowIndex, colIndex)}
                className={classes(dataField, row, rowIndex, colIndex)}
              >
                {formatter ? formatter(row[dataField], row, rowIndex, colIndex, tableData) : tData}
              </td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
