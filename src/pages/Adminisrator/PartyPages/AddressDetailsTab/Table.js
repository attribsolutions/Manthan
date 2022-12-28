import React, { useState } from 'react';
import { Button, Input, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';

function AddressDetailsTable(props) {

    const ondeleteHandeler = (ele) => {

        if (!(ele === 0)) {
            var fil = props.tableData.filter((i) => {
                return !(i.id === ele);
            });
            props.func(fil);
        }
    };

    function defaultChangeHandler(key) {

        const newtableData = props.tableData.map((ele, k) => {
            ele.IsDefault = false;
            if (k === key) {
                ele.IsDefault = true;
            }
            return ele
        });
        props.func(newtableData)
    }

    // var modal = document.getElementById("myModal");
    // // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");
    // img.onclick = function () {
    //     modal.style.display = "block";
    //     modalImg.src = this.src;
    //     captionText.innerHTML = this.alt;
    // }
    // // Get the <span> element that closes the modal
    // var span = document.getElementsByClassName("close")[0];

    // // When the user clicks on <span> (x), close the modal
    // span.onclick = function () {
    //     modal.style.display = "none";
    // }
    // // const myFunction = () => {
    // //     document.getElementById("add-img").style.display ='block';
      
    // //   }
    const tableRows = props.tableData.map((info, key) => {

        return (
            <tr>
                <td>{info.Address}</td>
                <td>{info.FSSAINo}</td>
                <td>{info.FSSAIExipry}</td>
                <td>
                    {/* {info.fssaidocument} */}
                <button
                type='button'
                // id='myImg'
                // onClick={myFunction}
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
                        onClick={(e) => {
                            ondeleteHandeler(info.id);
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
