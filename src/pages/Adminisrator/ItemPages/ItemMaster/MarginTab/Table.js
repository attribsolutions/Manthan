import React, { useEffect, useState } from 'react';
import { Button, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteID_In_MasterPage, deleteID_In_MasterPageSuccess } from '../../../../../store/Administrator/MRPMasterRedux/action';
import { AlertState } from '../../../../../store/actions';

function MarginTable(props) {
    const dispatch = useDispatch();

    const {
      deleteMsg,
    } = useSelector((state) => ({
      deleteMsg: state.MRPMasterReducer.deleteIdForMRPMaster,
    }));
  
    const onDeleteHandeler = (id) => {
  
      dispatch(
        AlertState({
          Type: 5,
          Status: true,
          Message: `Are you sure you want to delete this MRP"`,
          RedirectPath: false,
          PermissionAction: deleteID_In_MasterPage,
          ID: id,
        })
      );
    };
  
    useEffect(() => {
      if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
        dispatch(deleteID_In_MasterPageSuccess({ Status: false }));
  
        var fil = props.tableData.filter((i) => {
          return !(i.id === deleteMsg.deletedId);
        });
        props.func(fil);
  
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: deleteMsg.Message,
          })
        );
      } else if (deleteMsg.Status === true) {
        dispatch(deleteID_In_MasterPageSuccess({ Status: false }));
        dispatch(
          AlertState({
            Type: 3,
            Status: true,
            Message: JSON.stringify(deleteMsg.Message),
          })
        );
      }
    }, [deleteMsg]);

    const tableRows = props.tableData.map((info) => {
        
        return (
            <tr>
                {/* <td>{info.id}</td> */}
                <td>{info.PriceListName}</td>
                <td>{info.PartyName}</td>
                <td>{info.EffectiveDate}</td>
                <td>{info.Margin}</td>
                <td>
                    <Button
                        className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
                        onClick={(e) => {
                            onDeleteHandeler(info.id);
                        }}
                    >
                        <i className="mdi mdi-delete font-size-18"></i>
                    </Button>
                </td>
            </tr>
        );
    });

    return (
        <>
            <div>
                {props.tableData.length > 0 ?
                    <Table className="table table-bordered table-hover">
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

export default MarginTable;
