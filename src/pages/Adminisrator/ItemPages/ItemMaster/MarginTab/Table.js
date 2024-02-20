import React, { useEffect, useMemo, useState } from 'react';
import { Button, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteIdForMarginMaster, deleteIdForMarginMasterSuccess } from '../../../../../store/Administrator/MarginMasterRedux/action';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { alertMessages } from '../../../../../components/Common/CommonErrorMsg/alertMsg';

function MarginTable(props) {
  const dispatch = useDispatch();

  const {
    deleteMsg,
  } = useSelector((state) => ({
    deleteMsg: state.MarginMasterReducer.deleteId_For_MarginMaster,
  }));

  const onDeleteHandler = async(info) => {
    if (info.IsAdd) {
      var fil = props.tableData.filter((i) => {
        return !(i.id === info.id);
      });
      props.func(fil);
    }
    else {
      const permission = await customAlert({
        Type: 7,
        Message:alertMessages.deleteThis_Margin
      })
      if (permission) {
        dispatch(deleteIdForMarginMaster(info.id))
      }
    }
  };

  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteIdForMarginMasterSuccess({ Status: false }));

      var fil = props.tableData.filter((i) => {
        return !(i.id === deleteMsg.deletedId);
      });
      props.func(fil);


      customAlert({
        Type: 1,
        Message: deleteMsg.Message,
      })

    } else if (deleteMsg.Status === true) {
      dispatch(deleteIdForMarginMasterSuccess({ Status: false }));

      customAlert({
        Type: 3,
        Message: JSON.stringify(deleteMsg.Message),
      })

    }
  }, [deleteMsg]);


  const tableRows = useMemo(() => {
    return [...props.tableData].sort((a, b) => b.id - a.id)
      .map((info) => (
        <tr key={info.id} style={{ backgroundColor: info.IsAdd && "#9dadf09e" }}>
          <td>{info.PriceListName}</td>
          <td>{info.PartyName}</td>
          <td>{info.EffectiveDate}</td>
          <td>{info.Margin}</td>
          <td>
            <Button
              className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
              onClick={(e) => {
                onDeleteHandler(info);
              }}
            >
              <i className="mdi mdi-delete font-size-18"></i>
            </Button>
          </td>
        </tr>
      ));
  }, [props.tableData]);

  // const tableRows = sortedData

  return (
    <>
      <div>
        {props.tableData.length > 0 ?
          <Table className="table table-bordered ">
            <Thead>
              <tr>
                <th className="col col-sm-3">Price List</th>
                <th className="col col-sm-3">Party Name</th>
                <th className="col col-sm-3">EffectiveDate</th>
                <th className="col col-sm-3">Margin</th>
                <th className="col col-sm-3">{"Action"}</th>
              </tr>
            </Thead>
            <Tbody>{tableRows}</Tbody>
          </Table>
          : null}
      </div>
    </>
  );
}

export default React.memo(MarginTable);
