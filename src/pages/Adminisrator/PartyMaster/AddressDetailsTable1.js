import React from 'react';
import { Table, Button } from 'reactstrap';

const AddressDetailsTable1 = ({ addressTable, onEdit, setAddressTable }) => {
  
  const handleDelete = (rowIdToDelete) => {
    const updated = addressTable.filter(row => row.RowId !== rowIdToDelete);
    setAddressTable(updated);
  };

  
  return (
    <Table bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>id</th>
          <th>Party Address</th>
          <th>PIN</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {addressTable.length > 0 ? (
          addressTable.map((row, index) => (
            <tr key={row.RowId || index}>
              <td>{index + 1}</td>
              <td>{row.Address}</td>
              <td>{row.PIN}</td>
              <td>
                <Button
                  color="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(row)}
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(row.RowId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">No records found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AddressDetailsTable1;
