import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getControlTypes, getFieldValidations } from '../../../../store/actions';
import {
    Button,
    Col,
    Input,
    Row,
    Table,
} from "reactstrap";
import Select from "react-select";
import { Tbody, Th, Thead, Tr } from "react-super-responsive-table";
// import './css.css'
function PageFieldMaster_Tab(props) {

    const dispatch = useDispatch();

    const { pageFieldTabTable, setPageFieldTabTable } = props

    const {
        ControlTypes,
        FieldValidations,
    } = useSelector((state) => ({
        ControlTypes: state.H_Pages.ControlTypes,
        FieldValidations: state.H_Pages.FieldValidations,
    }));

    useEffect(() => {
        dispatch(getControlTypes());
    }, [dispatch]);

    const ControlTypes_DropdownOptions = ControlTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const FieldValidations_DropdownOptions = FieldValidations.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function PageField_Tab_AddRow_Handler() {

        var newarr1 = [...pageFieldTabTable, {
            ControlID: '',
            FieldLabel: '',
            ControlType: { label: "select...", value: 0 },
            FieldValidation: { label: "select...", value: 0 },
            InValidMsg: '',
            IsCompulsory: false,
            DefaultSort: 0,
            FieldSequence: '',
            ShowInListPage: false,
            Alignment:'',
            ListPageSeq: '',
            ShowInDownload: false,
            DownloadDefaultSelect: false,

        }]
        setPageFieldTabTable(newarr1)
    }

    function PageField_DeleteRow_Handler(key) {

        var removeElseArrray1 = pageFieldTabTable.filter((i, k) => {
            return !(k === key)
        })
        setPageFieldTabTable(removeElseArrray1)
    }

    function arrow_value(key) {
        if (pageFieldTabTable[key].DefaultSort = 2) {
            var x = document.getElementById("up");
            var y = document.getElementById("down");

            y.style.display = "block";
            x.style.display = "none";
        }
    }

    function arrow_value1(key) {
        if (pageFieldTabTable[key].DefaultSort = 1) {
            var x = document.getElementById("up");
            var y = document.getElementById("down");

            x.style.display = "block";
            y.style.display = "none";
        }
    }

    function PageField_onChange_Handler(event, type = '', key) {

        const newval = pageFieldTabTable.map((index, k) => {

            if (key === k) {
                if ((type === "ControlType")) {
                    index.ControlType = event
                    index.InValidMsg = (event.value === 4) ? '' : index.InValidMsg;
                    index.FieldValidation = "";
                }
                else if ((type === "DefaultSort")) {
                    index.DefaultSort = event ? 1 : 0;
                } else { index[type] = event }
            };

            if (type === "DefaultSort" && !(k === key)) {
                index["DefaultSort"] = 0
            }
            return index
        })

        setPageFieldTabTable(newval)
    }

    function ControlType_Dropdown_Handler(e, key) {
        dispatch(getFieldValidations(e.value))
        PageField_onChange_Handler(e, "ControlType", key)
    }

    function FieldValidation_Dropdown_Handler(e, key) {
        PageField_onChange_Handler(e, "FieldValidation", key);
    }

    return (
        <>
            <div className="table-rep-plugin  mx-n4 " >
                <div 
                    className=" table-responsive "
                    data-pattern="priority-columns "
                >
                    <Table className="table table-bordered ">
                        <Thead  >
                            <tr className="colorhead">
                                <th className="thsticky colorhead" >Control ID</th>
                                <th className="">Field Label</th>
                                <th className="">Control Type</th>
                                <th className="" >Field Validation</th>
                                <th className="" >InValid Msg</th>
                                <th className="">List Page Seq</th>
                                <th className="">Align</th>
                                <th >Is Compulsory</th>
                                <th>Default Sort</th>
                                <th>Show In List Page</th>
                                <th>Show In Download</th>
                                <th>Download Default Select</th>
                                <th className="col col-sm-1">Action</th>

                            </tr>
                        </Thead>

                        <Tbody>

                            {pageFieldTabTable.map((TableValue, key) => (
                                <tr  >
                                    <td className='thsticky ' style={{ zIndex: "1", }}>
                                        <div style={{ width: "150px", }}>
                                            <Input
                                                type="text"
                                                id={`ControlID${key}`}
                                                autoComplete="off"
                                                // defaultValue={EditData.ControlID}
                                                value={pageFieldTabTable[key].ControlID}
                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "ControlID", key)}>
                                            </Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }} className='sticky'>
                                            <Input
                                                className='sticky'
                                                type="text"
                                                id={`FieldLabel${key}`}
                                                autoComplete="off"
                                                // defaultValue={EditData.FieldLabel}
                                                value={pageFieldTabTable[key].FieldLabel}
                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "FieldLabel", key)}>
                                            </Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Select
                                                id={`ControlType-${key}`}
                                                value={pageFieldTabTable[key].ControlType}
                                                options={ControlTypes_DropdownOptions}
                                                onChange={(e) => { ControlType_Dropdown_Handler(e, key); }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Select
                                                id={`FieldValidation-${key}`}
                                                autoComplete="off"
                                                value={pageFieldTabTable[key].FieldValidation}
                                                options={FieldValidations_DropdownOptions}
                                                onChange={(e) => { FieldValidation_Dropdown_Handler(e, key); }}
                                            // onChange={(e) => { PageField_onChange_Handler(e, "FieldValidation", key); }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Input
                                                type="text"
                                                id={`InValidMsg${key}`}
                                                autoComplete="off"
                                                // defaultValue={EditData.InValidMsg}
                                                disabled={TableValue.ControlType.value === 4 ? true : false}
                                                value={pageFieldTabTable[key].InValidMsg}
                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "InValidMsg", key)}>
                                            </Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "70px" }}>
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                id={`ListPageSeq${key}`}
                                                // defaultValue={EditData.ListPageSeq}
                                                value={pageFieldTabTable[key].ListPageSeq}
                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "ListPageSeq", key)}>

                                            </Input>
                                        </div>
                                    </td>

                                    <td>
                                        <div style={{ width: "70px" }}>
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                id={`Alignment${key}`}
                                                // defaultValue={EditData.ListPageSeq}
                                                value={pageFieldTabTable[key].Alignment}
                                                onChange={(e) => PageField_onChange_Handler(e.target.value, "Alignment", key)}>

                                            </Input>
                                        </div>
                                    </td>
                                    <td>
                                        <Input
                                            type="checkbox"
                                            id={`IsCompulsory${key}`}
                                            disabled={TableValue.ControlType.value === 4 ? true : false}
                                            checked={(TableValue.ControlType.value === 4) ? pageFieldTabTable[key].IsCompulsory = false : pageFieldTabTable[key].IsCompulsory}
                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "IsCompulsory", key)}>

                                        </Input>
                                    </td>

                                    <td >
                                        <div className="d-flex">
                                            <div>
                                                <Input
                                                    type="radio"
                                                    name="btnradio"
                                                    value={`DefaultSort${key}`}
                                                    id={`DefaultSort${key}`}
                                                    checked={pageFieldTabTable[key].DefaultSort}
                                                    onChange={(e) => PageField_onChange_Handler(e.target.checked, "DefaultSort", key)}>
                                                </Input>
                                            </div>

                                            {pageFieldTabTable[key].DefaultSort > 0 ?
                                                <div >
                                                    <i
                                                        className=" bx bx-caret-up font-size-20 text-danger "
                                                        id="up"
                                                        style={{ display: pageFieldTabTable[key].DefaultSort === 1 ? "block" : "none" }}

                                                        onClick={(e) => arrow_value(key)}></i>

                                                    <i
                                                        className=" bx bx-caret-down font-size-20 text-danger "
                                                        style={{ display: pageFieldTabTable[key].DefaultSort === 2 ? "block" : "none" }}

                                                        id="down"
                                                        onClick={(e) => arrow_value1(key)}></i>
                                                </div>
                                                : null}
                                        </div>
                                    </td>

                                    <td>
                                        <Input
                                            type="checkbox"
                                            id={`ShowInListPage${key}`}
                                            checked={pageFieldTabTable[key].ShowInListPage}
                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInListPage", key)}>
                                        </Input>
                                    </td>

                                    <td>
                                        <Input
                                            type="checkbox"
                                            id={`ShowInDownload${key}`}
                                            defaultChecked={pageFieldTabTable[key].ShowInDownload}
                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInDownload", key)}>
                                        </Input>
                                    </td>

                                    <td>
                                        <Input
                                            type="checkbox"
                                            id={`DownloadDefaultSelect${key}`}
                                            disabled={TableValue.ShowInDownload === true ? false : true}
                                            checked={
                                                (TableValue.ShowInDownload === false)
                                                    ? pageFieldTabTable[key].DownloadDefaultSelect = false
                                                    : pageFieldTabTable[key].DownloadDefaultSelect}
                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "DownloadDefaultSelect", key)}>
                                        </Input>
                                    </td>

                                    <td>
                                        {(pageFieldTabTable.length === key + 1) ?
                                            <Row className="">
                                                <Col md={6} className=" mt-3">
                                                    {(pageFieldTabTable.length > 0) ? <>
                                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20"
                                                            onClick={() => {
                                                                PageField_DeleteRow_Handler(key)
                                                            }} >
                                                        </i>
                                                    </> : <Col md={6} ></Col>}

                                                </Col>

                                                <Col md={6} >

                                                    <div className="col border-end d-flex justify-content-center ">
                                                        <Button
                                                            className="btn btn-outline-light btn-sm  align-items-sm-center text-center mt-3"
                                                            type="button"
                                                            onClick={() => { PageField_Tab_AddRow_Handler(key) }}
                                                        >
                                                            <i className="dripicons-plus">

                                                            </i>
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            :

                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                PageField_DeleteRow_Handler(key)
                                            }} >
                                            </i>
                                        }

                                    </td>
                                </tr>
                            ))}

                        </Tbody>
                    </Table>
                    {
                        pageFieldTabTable.length === 0 ?
                            <div className="col border-end d-flex justify-content-center mt-5 ">
                                <Button type="button"
                                    onClick={() => { PageField_Tab_AddRow_Handler() }}
                                    className="button button-white button-animate ">Add New Row
                                    <i className="dripicons-plus"> </i>
                                </Button>
                            </div> : null
                    }
                </div>
            </div>
        </>
    )
}
export default PageFieldMaster_Tab;




// Demo





// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getControlTypes, getFieldValidations } from '../../../../store/actions';
// import {
//     Button,
//     Col,
//     Input,
//     Row,
//     Table,
// } from "reactstrap";
// import Select from "react-select";
// import { Tbody, Thead } from "react-super-responsive-table";
// // import './css.css'
// function PageFieldMaster_Tab(props) {

//     const dispatch = useDispatch();

//     const { pageFieldTabTable, setPageFieldTabTable } = props

//     const {
//         ControlTypes,
//         FieldValidations,
//     } = useSelector((state) => ({
//         ControlTypes: state.H_Pages.ControlTypes,
//         FieldValidations: state.H_Pages.FieldValidations,
//     }));

//     useEffect(() => {
//         dispatch(getControlTypes());
//     }, [dispatch]);

//     const ControlTypes_DropdownOptions = ControlTypes.map((data) => ({
//         value: data.id,
//         label: data.Name
//     }));

//     const FieldValidations_DropdownOptions = FieldValidations.map((data) => ({
//         value: data.id,
//         label: data.Name
//     }));

//     function PageField_Tab_AddRow_Handler() {

//         var newarr1 = [...pageFieldTabTable, {
//             ControlID: '',
//             FieldLabel: '',
//             ControlType: { label: "select", value: 0 },
//             FieldValidation: { label: "select", value: 0 },
//             InValidMsg: '',
//             IsCompulsory: false,
//             DefaultSort: 0,
//             FieldSequence: '',
//             ShowInListPage: false,
//             ListPageSeq: '',
//             ShowInDownload: false,
//             DownloadDefaultSelect: false,

//         }]
//         setPageFieldTabTable(newarr1)
//     }

//     function PageField_DeleteRow_Handler(key) {

//         var removeElseArrray1 = pageFieldTabTable.filter((i, k) => {
//             return !(k === key)
//         })
//         setPageFieldTabTable(removeElseArrray1)
//     }

//     function arrow_value(key) {
//         if (pageFieldTabTable[key].DefaultSort = 2) {
//             var x = document.getElementById("up");
//             var y = document.getElementById("down");

//             y.style.display = "block";
//             x.style.display = "none";
//         }
//     }

//     function arrow_value1(key) {
//         if (pageFieldTabTable[key].DefaultSort = 1) {
//             var x = document.getElementById("up");
//             var y = document.getElementById("down");

//             x.style.display = "block";
//             y.style.display = "none";
//         }
//     }

//     function PageField_onChange_Handler(event, type = '', key) {

//         const newval = pageFieldTabTable.map((index, k) => {

//             if (key === k) {
//                 if ((type === "ControlType")) {
//                     index.ControlType = event
//                     index.InValidMsg = (event.value === 4) ? '' : index.InValidMsg;
//                     index.FieldValidation = "";
//                 }
//                 else if ((type === "DefaultSort")) {
//                     index.DefaultSort = event ? 1 : 0;
//                 } else { index[type] = event }
//             };

//             if (type === "DefaultSort" && !(k === key)) {
//                 index["DefaultSort"] = 0
//             }
//             return index
//         })

//         setPageFieldTabTable(newval)
//     }

//     function ControlType_Dropdown_Handler(e, key) {
//         dispatch(getFieldValidations(e.value))
//         PageField_onChange_Handler(e, "ControlType", key)
//     }

//     function FieldValidation_Dropdown_Handler(e, key) {
//         PageField_onChange_Handler(e, "FieldValidation", key);
//     }

//     return (
//         <>

//             <div className='table-responsive Scroll_div'>
//                 <table className="  table table-bordered ">
//                     <thead className='sticky'>
//                         <tr className="colorhead">
//                             <th className=" " >Control ID</th>
//                             <th className="">Field Label</th>
//                             <th className="">Control Type</th>
//                             <th className="" >Field Validation</th>
//                             <th className="" >InValid Msg</th>
//                             <th className="">List Page Seq</th>
//                             <th >Is Compulsory</th>
//                             <th>Default Sort</th>
//                             <th>Show In List Page</th>
//                             <th>Show In Download</th>
//                             <th>Download Default Select</th>
//                             <th className="col col-sm-1">Action</th>

//                         </tr>
//                     </thead>
//                     <tbody className='Scroll_div'>
//                         {pageFieldTabTable.map((TableValue, key) => (
//                             <tr  >
//                                 <td className='thsticky ' style={{ zIndex: "1", }}>
//                                     <div style={{ width: "150px", }}>
//                                         <Input
//                                             type="text"
//                                             id={`ControlID${key}`}
//                                             autoComplete="off"
//                                             // defaultValue={EditData.ControlID}
//                                             value={pageFieldTabTable[key].ControlID}
//                                             onChange={(e) => PageField_onChange_Handler(e.target.value, "ControlID", key)}>
//                                         </Input>
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <div style={{ width: "150px" }}>
//                                         <Input
//                                             type="text"
//                                             id={`FieldLabel${key}`}
//                                             autoComplete="off"
//                                             // defaultValue={EditData.FieldLabel}
//                                             value={pageFieldTabTable[key].FieldLabel}
//                                             onChange={(e) => PageField_onChange_Handler(e.target.value, "FieldLabel", key)}>
//                                         </Input>
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <div style={{ width: "150px" }}>
//                                         <Select
//                                             id={`ControlType-${key}`}
//                                             value={pageFieldTabTable[key].ControlType}
//                                             options={ControlTypes_DropdownOptions}
//                                             onChange={(e) => { ControlType_Dropdown_Handler(e, key); }}
//                                         />
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <div style={{ width: "150px" }}>
//                                         <Select
//                                             id={`FieldValidation-${key}`}
//                                             autoComplete="off"
//                                             value={pageFieldTabTable[key].FieldValidation}
//                                             options={FieldValidations_DropdownOptions}
//                                             onChange={(e) => { FieldValidation_Dropdown_Handler(e, key); }}
//                                         // onChange={(e) => { PageField_onChange_Handler(e, "FieldValidation", key); }}
//                                         />
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <div style={{ width: "150px" }}>
//                                         <Input
//                                             type="text"
//                                             id={`InValidMsg${key}`}
//                                             autoComplete="off"
//                                             // defaultValue={EditData.InValidMsg}
//                                             disabled={TableValue.ControlType.value === 4 ? true : false}
//                                             value={pageFieldTabTable[key].InValidMsg}
//                                             onChange={(e) => PageField_onChange_Handler(e.target.value, "InValidMsg", key)}>
//                                         </Input>
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <div style={{ width: "70px" }}>
//                                         <Input
//                                             autoComplete="off"
//                                             type="text"
//                                             id={`ListPageSeq${key}`}
//                                             // defaultValue={EditData.ListPageSeq}
//                                             value={pageFieldTabTable[key].ListPageSeq}
//                                             onChange={(e) => PageField_onChange_Handler(e.target.value, "ListPageSeq", key)}>

//                                         </Input>
//                                     </div>
//                                 </td>
//                                 <td>
//                                     <Input
//                                         type="checkbox"
//                                         id={`IsCompulsory${key}`}
//                                         disabled={TableValue.ControlType.value === 4 ? true : false}
//                                         checked={(TableValue.ControlType.value === 4) ? pageFieldTabTable[key].IsCompulsory = false : pageFieldTabTable[key].IsCompulsory}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.checked, "IsCompulsory", key)}>

//                                     </Input>
//                                 </td>

//                                 <td >
//                                     <div className="d-flex">
//                                         <div>
//                                             <Input
//                                                 type="radio"
//                                                 name="btnradio"
//                                                 value={`DefaultSort${key}`}
//                                                 id={`DefaultSort${key}`}
//                                                 checked={pageFieldTabTable[key].DefaultSort}
//                                                 onChange={(e) => PageField_onChange_Handler(e.target.checked, "DefaultSort", key)}>
//                                             </Input>
//                                         </div>

//                                         {pageFieldTabTable[key].DefaultSort > 0 ?
//                                             <div >
//                                                 <i
//                                                     className=" bx bx-caret-up font-size-20 text-danger "
//                                                     id="up"
//                                                     style={{ display: pageFieldTabTable[key].DefaultSort === 1 ? "block" : "none" }}

//                                                     onClick={(e) => arrow_value(key)}></i>

//                                                 <i
//                                                     className=" bx bx-caret-down font-size-20 text-danger "
//                                                     style={{ display: pageFieldTabTable[key].DefaultSort === 2 ? "block" : "none" }}

//                                                     id="down"
//                                                     onClick={(e) => arrow_value1(key)}></i>
//                                             </div>
//                                             : null}
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <Input
//                                         type="checkbox"
//                                         id={`ShowInListPage${key}`}
//                                         checked={pageFieldTabTable[key].ShowInListPage}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInListPage", key)}>
//                                     </Input>
//                                 </td>

//                                 <td>
//                                     <Input
//                                         type="checkbox"
//                                         id={`ShowInDownload${key}`}
//                                         defaultChecked={pageFieldTabTable[key].ShowInDownload}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInDownload", key)}>
//                                     </Input>
//                                 </td>

//                                 <td>
//                                     <Input
//                                         type="checkbox"
//                                         id={`DownloadDefaultSelect${key}`}
//                                         disabled={TableValue.ShowInDownload === true ? false : true}
//                                         checked={
//                                             (TableValue.ShowInDownload === false)
//                                                 ? pageFieldTabTable[key].DownloadDefaultSelect = false
//                                                 : pageFieldTabTable[key].DownloadDefaultSelect}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.checked, "DownloadDefaultSelect", key)}>
//                                     </Input>
//                                 </td>

//                                 <td>
//                                     {(pageFieldTabTable.length === key + 1) ?
//                                         <Row className="">
//                                             <Col md={6} className=" mt-3">
//                                                 {(pageFieldTabTable.length > 0) ? <>
//                                                     < i className="mdi mdi-trash-can d-block text-danger font-size-20"
//                                                         onClick={() => {
//                                                             PageField_DeleteRow_Handler(key)
//                                                         }} >
//                                                     </i>
//                                                 </> : <Col md={6} ></Col>}

//                                             </Col>

//                                             <Col md={6} >

//                                                 <div className="col border-end d-flex justify-content-center ">
//                                                     <Button
//                                                         className="btn btn-outline-light btn-sm  align-items-sm-center text-center mt-3"
//                                                         type="button"
//                                                         onClick={() => { PageField_Tab_AddRow_Handler(key) }}
//                                                     >
//                                                         <i className="dripicons-plus">

//                                                         </i>
//                                                     </Button>
//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                         :

//                                         < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
//                                             PageField_DeleteRow_Handler(key)
//                                         }} >
//                                         </i>
//                                     }

//                                 </td>
//                             </tr>
//                         ))}

//                     </tbody>
//                 </table>
//             </div>






















//             {/* <Table className="table table-bordered table-responsive ">
//                 <Thead  >
//                     <tr className="colorhead">
//                         <th className="thsticky colorhead" >Control ID</th>
//                         <th className="">Field Label</th>
//                         <th className="">Control Type</th>
//                         <th className="" >Field Validation</th>
//                         <th className="" >InValid Msg</th>
//                         <th className="">List Page Seq</th>
//                         <th >Is Compulsory</th>
//                         <th>Default Sort</th>
//                         <th>Show In List Page</th>
//                         <th>Show In Download</th>
//                         <th>Download Default Select</th>
//                         <th className="col col-sm-1">Action</th>

//                     </tr>
//                 </Thead>

//                 <Tbody>

//                     {pageFieldTabTable.map((TableValue, key) => (
//                         <tr  >
//                             <td className='thsticky ' style={{ zIndex: "1", }}>
//                                 <div style={{ width: "150px", }}>
//                                     <Input
//                                         type="text"
//                                         id={`ControlID${key}`}
//                                         autoComplete="off"
//                                         // defaultValue={EditData.ControlID}
//                                         value={pageFieldTabTable[key].ControlID}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.value, "ControlID", key)}>
//                                     </Input>
//                                 </div>
//                             </td>
//                             <td>
//                                 <div style={{ width: "150px" }}>
//                                     <Input
//                                         type="text"
//                                         id={`FieldLabel${key}`}
//                                         autoComplete="off"
//                                         // defaultValue={EditData.FieldLabel}
//                                         value={pageFieldTabTable[key].FieldLabel}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.value, "FieldLabel", key)}>
//                                     </Input>
//                                 </div>
//                             </td>
//                             <td>
//                                 <div style={{ width: "150px" }}>
//                                     <Select
//                                         id={`ControlType-${key}`}
//                                         value={pageFieldTabTable[key].ControlType}
//                                         options={ControlTypes_DropdownOptions}
//                                         onChange={(e) => { ControlType_Dropdown_Handler(e, key); }}
//                                     />
//                                 </div>
//                             </td>
//                             <td>
//                                 <div style={{ width: "150px" }}>
//                                     <Select
//                                         id={`FieldValidation-${key}`}
//                                         autoComplete="off"
//                                         value={pageFieldTabTable[key].FieldValidation}
//                                         options={FieldValidations_DropdownOptions}
//                                         onChange={(e) => { FieldValidation_Dropdown_Handler(e, key); }}
//                                     // onChange={(e) => { PageField_onChange_Handler(e, "FieldValidation", key); }}
//                                     />
//                                 </div>
//                             </td>
//                             <td>
//                                 <div style={{ width: "150px" }}>
//                                     <Input
//                                         type="text"
//                                         id={`InValidMsg${key}`}
//                                         autoComplete="off"
//                                         // defaultValue={EditData.InValidMsg}
//                                         disabled={TableValue.ControlType.value === 4 ? true : false}
//                                         value={pageFieldTabTable[key].InValidMsg}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.value, "InValidMsg", key)}>
//                                     </Input>
//                                 </div>
//                             </td>
//                             <td>
//                                 <div style={{ width: "70px" }}>
//                                     <Input
//                                         autoComplete="off"
//                                         type="text"
//                                         id={`ListPageSeq${key}`}
//                                         // defaultValue={EditData.ListPageSeq}
//                                         value={pageFieldTabTable[key].ListPageSeq}
//                                         onChange={(e) => PageField_onChange_Handler(e.target.value, "ListPageSeq", key)}>

//                                     </Input>
//                                 </div>
//                             </td>
//                             <td>
//                                 <Input
//                                     type="checkbox"
//                                     id={`IsCompulsory${key}`}
//                                     disabled={TableValue.ControlType.value === 4 ? true : false}
//                                     checked={(TableValue.ControlType.value === 4) ? pageFieldTabTable[key].IsCompulsory = false : pageFieldTabTable[key].IsCompulsory}
//                                     onChange={(e) => PageField_onChange_Handler(e.target.checked, "IsCompulsory", key)}>

//                                 </Input>
//                             </td>

//                             <td >
//                                 <div className="d-flex">
//                                     <div>
//                                         <Input
//                                             type="radio"
//                                             name="btnradio"
//                                             value={`DefaultSort${key}`}
//                                             id={`DefaultSort${key}`}
//                                             checked={pageFieldTabTable[key].DefaultSort}
//                                             onChange={(e) => PageField_onChange_Handler(e.target.checked, "DefaultSort", key)}>
//                                         </Input>
//                                     </div>

//                                     {pageFieldTabTable[key].DefaultSort > 0 ?
//                                         <div >
//                                             <i
//                                                 className=" bx bx-caret-up font-size-20 text-danger "
//                                                 id="up"
//                                                 style={{ display: pageFieldTabTable[key].DefaultSort === 1 ? "block" : "none" }}

//                                                 onClick={(e) => arrow_value(key)}></i>

//                                             <i
//                                                 className=" bx bx-caret-down font-size-20 text-danger "
//                                                 style={{ display: pageFieldTabTable[key].DefaultSort === 2 ? "block" : "none" }}

//                                                 id="down"
//                                                 onClick={(e) => arrow_value1(key)}></i>
//                                         </div>
//                                         : null}
//                                 </div>
//                             </td>

//                             <td>
//                                 <Input
//                                     type="checkbox"
//                                     id={`ShowInListPage${key}`}
//                                     checked={pageFieldTabTable[key].ShowInListPage}
//                                     onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInListPage", key)}>
//                                 </Input>
//                             </td>

//                             <td>
//                                 <Input
//                                     type="checkbox"
//                                     id={`ShowInDownload${key}`}
//                                     defaultChecked={pageFieldTabTable[key].ShowInDownload}
//                                     onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInDownload", key)}>
//                                 </Input>
//                             </td>

//                             <td>
//                                 <Input
//                                     type="checkbox"
//                                     id={`DownloadDefaultSelect${key}`}
//                                     disabled={TableValue.ShowInDownload === true ? false : true}
//                                     checked={
//                                         (TableValue.ShowInDownload === false)
//                                             ? pageFieldTabTable[key].DownloadDefaultSelect = false
//                                             : pageFieldTabTable[key].DownloadDefaultSelect}
//                                     onChange={(e) => PageField_onChange_Handler(e.target.checked, "DownloadDefaultSelect", key)}>
//                                 </Input>
//                             </td>

//                             <td>
//                                 {(pageFieldTabTable.length === key + 1) ?
//                                     <Row className="">
//                                         <Col md={6} className=" mt-3">
//                                             {(pageFieldTabTable.length > 0) ? <>
//                                                 < i className="mdi mdi-trash-can d-block text-danger font-size-20"
//                                                     onClick={() => {
//                                                         PageField_DeleteRow_Handler(key)
//                                                     }} >
//                                                 </i>
//                                             </> : <Col md={6} ></Col>}

//                                         </Col>

//                                         <Col md={6} >

//                                             <div className="col border-end d-flex justify-content-center ">
//                                                 <Button
//                                                     className="btn btn-outline-light btn-sm  align-items-sm-center text-center mt-3"
//                                                     type="button"
//                                                     onClick={() => { PageField_Tab_AddRow_Handler(key) }}
//                                                 >
//                                                     <i className="dripicons-plus">

//                                                     </i>
//                                                 </Button>
//                                             </div>
//                                         </Col>
//                                     </Row>
//                                     :

//                                     < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
//                                         PageField_DeleteRow_Handler(key)
//                                     }} >
//                                     </i>
//                                 }

//                             </td>
//                         </tr>
//                     ))}

//                 </Tbody>
//             </Table> */}
//             {
//                 pageFieldTabTable.length === 0 ?
//                     <div className="col border-end d-flex justify-content-center mt-5 ">
//                         <Button type="button"
//                             onClick={() => { PageField_Tab_AddRow_Handler() }}
//                             className="button button-white button-animate ">Add New Row
//                             <i className="dripicons-plus"> </i>
//                         </Button>
//                     </div> : null
//             }

//         </>
//     )
// }
// export default PageFieldMaster_Tab;








