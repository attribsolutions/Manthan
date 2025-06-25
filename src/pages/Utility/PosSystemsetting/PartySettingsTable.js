import React from 'react';
import { Table, Input, Button } from 'reactstrap';
import Switch from "react-switch";

const PartySettingsTable = ({ tableData, setTableData }) => {

  const handleToggle = (index) => {
    const updated = [...tableData];
    updated[index].isDisable = !updated[index].isDisable;
    setTableData(updated);
  };

  const handleSettingChange = (index, value) => {
    const updated = [...tableData];
    updated[index].SettingValue = value;
    setTableData(updated);
  };

  const handleDelete = (rowId) => {
    const updated = tableData.filter(row => row.RowId !== rowId);
    setTableData(updated);
  };

  return (
    <Table bordered responsive className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Party</th>
          <th>Is Disable</th>
          <th>Setting Value</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={row.RowId}>
            <td>{index + 1}</td>
            <td>{row.Party.label}</td>
            <td>
              <Switch
                checked={row.isDisable}
                onChange={() => handleToggle(index)}
                height={20}
                width={40}
                onColor="#4C51BF"           // Blue background when ON
                offColor="#ccc"             // Light grey when OFF
                onHandleColor="#fff"        // White circle when ON
                offHandleColor="#999"       // Grey circle when OFF
              />

            </td>
            <td>
              <Input
                type="text"
                value={row.SettingValue}
                onChange={(e) => handleSettingChange(index, e.target.value)}
              />
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDelete(row.RowId)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PartySettingsTable;
