import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({ row, selectedRows, handleRowSelect }) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.includes(row.keyField)}
          onChange={() => handleRowSelect(row.keyField)}
        />
      </td>
      {row.cells.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
    </tr>
  );
};

TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleRowSelect: PropTypes.func.isRequired,
};

export default TableRow;
