import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { Row, Col, Modal, Button, } from "reactstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName } from "../../store/Utilites/Breadcrumb/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import * as XLSX from 'xlsx';
import './breadcrumb.scss'
const BreadcrumbCopy = props => {
    const dispatch = useDispatch();
    const history = useHistory();

    // for Excel Download
    const [modal_scroll, setmodal_scroll] = useState(false);
    const [downListKey, setDownListKey] = useState([]);
    // const {
    //     newBtnView = false,
    //     excelBtnView = false,
    //     pageHeading = '',
    //     showCount = false,
    //     excelData = [],
    //     userAcc = {},
    //     pageField = {}
    // } = props;

    const {
        breadcrumbDetail = {}
    } = useSelector((state) => ({
        breadcrumbDetail: state.BreadcrumbReducer.breadcrumbDetail,
        // filterSize: state.BreadcrumbReducer.filterSize,
        // userAccess: state.Login.RoleAccessUpdateData,

    }));
    const {
        bredcrumbItemName = 'page Name',
        filterSize = "showCount Axtxtxtxtxtxtx 9524",
        userAccess = {},
        newBtnView = false,
        excelBtnView = false,
        pageHeading = '',
        showCount = false,
        excelData = [],
        userAcc = {},
        pageField = {},
        masterPage
    } = breadcrumbDetail;


    function tog_scroll() {
        setmodal_scroll(!modal_scroll);
        removeBodyCss();
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    // New Button Handller
    // const NewButtonHandeller = () => {



    //     // let pathName = history.location.pathname
    //     // let userAcc = userAccess.find((inx) => {
    //     //     return (`/${inx.ActualPagePath}` === pathName)
    //     // })
    //     // let listPagePath = userAccess.find((inx) => {
    //     //     return (inx.id === userAcc.RelatedPageID)
    //     // })
    //     // if (listPagePath === undefined) {
    //     //     return
    //     // }
    //     debugger
    //     history.push({
    //         pathname: masterPage,
    //     })
    // }

    // Onfocus Search Box
    useEffect(() => {
        // document.getElementById("search-bar-0").focus();
        if (!(props.IsSearchVissible === undefined)) {
        }
        history.listen(location => dispatch(Breadcrumb_inputName('')));
    }, [history])

    useEffect(() => {

        if (!(excelData === undefined)) {
            if ((excelData.length > 0)) {
                // object to array conversion
                const propertyNames = Object.keys(excelData[0]);
                setDownListKey(propertyNames)
            }
        }
    }, [excelData])

    const DownloadInExcelButtonHanler = (event, values) => {
        debugger
        var list = []
        var object1 = {}
        var selectedValues = Object.keys(values);
        var filteredValues = selectedValues.filter(function (selectedValues) {
            return values[selectedValues]
        });

        excelData.map((index1) => {
            filteredValues.map((index2) => {
                if (index1.hasOwnProperty(index2)) {
                    object1[index2] = index1[index2]
                }
            })
            list.push(object1)
            object1 = {}
        })
        const worksheet = XLSX.utils.json_to_sheet(list);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Excel File.xlsx");
        setmodal_scroll(false)
    }

    const handleChange = (e) => {
        debugger
        var chek = document.getElementById("checkAll")
        if (chek) {
            for (var i = 0; i < downListKey.length; i++) {
                document.getElementById(`chckbox${i}`).checked = true
            }
        }
        else {
            for (var i = 0; i < downListKey.length; i++) {
                document.getElementById(`chckbox${i}`).checked = false
            }
        }
    };

    const excelCheckBoxOnChange = (e) => {
        debugger
        // e.preventDefault();
        const check = e.target
        // var chek = document.getElementById("checkAll").checked

        if (check.id === "checkAll") {
            debugger
            if (check.checked) {
                for (var i = 0; i < downListKey.length; i++) {
                    const a = document.getElementById(`chckbox${i}`)
                    if (a) {
                        a.checked = true
                        // excelData[0][`$defSelect${downListKey[i]}`] = true
                    }
                }
            }
            else {
                for (var i = 0; i < downListKey.length; i++) {
                    const a = document.getElementById(`chckbox${i}`)
                    if (a) {
                        a.checked = false
                        // excelData[0][`$defSelect${downListKey[i]}`] = false
                    }
                }
            }
        }

    };

    function ExcelCheckBox() {

        const arrDiv = []
        downListKey.forEach((index, key) => {

            const match = index.slice(0, 1);
            if (!(match === "$")) {

                arrDiv.push(
                    <div className="row" >
                        <div className="col col-12"  >
                            <Row>
                                <div className="col col-12 " >
                                    <AvInput
                                        className=" text-black checkbox-border-red"
                                        type="checkbox"
                                        id={`chckbox${key}`}
                                        name={index}
                                        defaultValue={(excelData[0][`$defSelect${index}`]) ? true : false}
                                    />&nbsp;&nbsp;&nbsp;
                                    <label className="form-label text-black"> {index} </label>
                                </div>
                            </Row>
                        </div>
                    </div>
                )
            }
        })
        return arrDiv
    }

    return (
        <React.Fragment>
            <div className='page-breadcrumb'>
                <div className=""
                >
                   
                </div></div>
        </React.Fragment>
    )
}
// Breadcrumb.propTypes = {
//     breadcrumbItem: PropTypes.string,
//     title: PropTypes.string
// }
export default BreadcrumbCopy;
