import React, { useEffect } from 'react';
import { Button, Input, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { PartyAddressDeleteID, PartyAddressDeleteIDSuccess } from '../../../../../store/Administrator/PartyRedux/action';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';

function AddressDetailsTable({ addressTable = [], setAddressTable }) {

    const dispatch = useDispatch();

    const {
        deleteMessage,
    } = useSelector((state) => ({
        deleteMessage: state.PartyMasterReducer.PartyAddressDelete,
    }));

    useEffect(() => {
        if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
            dispatch(PartyAddressDeleteIDSuccess({ Status: false }));
            if (!(deleteMessage.deleteId === 0)) {
                var fil = addressTable.filter((i) => {
                    return !(i.id === deleteMessage.deleteId);
                });
                setAddressTable(fil);
            }
            dispatch(
                customAlert({
                    Type: 1,
                    Status: true,
                    Message: deleteMessage.Message,

                })
            );
        } else if (deleteMessage.Status === true) {
            dispatch(PartyAddressDeleteIDSuccess({ Status: false }));
            dispatch(
                customAlert({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(deleteMessage.Message),
                })
            );
        }
    }, [deleteMessage]);

    const ondeleteHandeler = (ele) => {
        debugger
        if (ele.id === undefined) {
            if (!(ele.RowId === 0)) {
                var fil = addressTable.filter((i) => {
                    return !(i.RowId === ele.RowId);
                });
                setAddressTable(fil);
            }
        }
        else {
            dispatch(PartyAddressDeleteID({ deleteId: ele.id, btnId: `btn-delete-${ele.id}` }))
        }
    };

    function defaultChangeHandler(key) {

        const newtableData = addressTable.map((ele, k) => {
            ele.IsDefault = false;
            if (k === key) {
                ele.IsDefault = true;
            }
            return ele
        });
        setAddressTable(newtableData)
    }

    function myFunction(row) {

        var x = document.getElementById("add-img");

        if (x.style.display === "none") {
            x.src = row.fssaidocument
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    const tableRows = addressTable.map((info, key) => {

        return (
            <tr>
                <td>{info.Address}</td>
                <td>{info.FSSAINo}</td>
                <td>{info.FSSAIExipry}</td>
                <td>
                    <button
                        type='button'
                        onClick={() => { myFunction(info) }}
                        className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light">
                        Show Image
                    </button>
                </td>
                <td>{info.PIN}</td>
                < td><Input type="radio"
                    name="btnradio"
                    id={`radioButton${key}`}
                    defaultChecked={info.IsDefault ? true : false}
                    onClick={(e) => defaultChangeHandler(key)} />
                    {`${info.IsDefault}`}
                </td>

                <td>
                    <Button
                        className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
                        disabled={info.IsDefault === false ? false : true}
                        onClick={(e) =>
                            ondeleteHandeler(info)
                        }
                    >
                        <i className="mdi mdi-delete font-size-18"></i>
                    </Button>
                </td>

            </tr >
        );
    });

    return (
        <>
            <div>
                < img id='add-img' className='abc1' src={''} />
                {addressTable.length > 0 ?
                    <Table className="table table-bordered table-hover">
                        <Thead>
                            <tr>
                                <th className="col col-sm-3">Address</th>
                                <th className="col col-sm-3">FSSAINo</th>
                                <th className="col col-sm-3">FSSAIExipry</th>
                                <th className="col col-sm-3">FSSAI Document</th>
                                <th className="col col-sm-3">PIN</th>
                                <th className="col col-sm-3">IsDefault</th>
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

export default AddressDetailsTable;
