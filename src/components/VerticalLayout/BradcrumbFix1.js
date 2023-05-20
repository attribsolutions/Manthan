import React, { useEffect, useState } from "react"
import { Row, Col, Modal, Button, } from "reactstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb_inputName } from "../../store/Utilites/Breadcrumb/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import * as XLSX from 'xlsx';
import * as urlRalations from "../../routes/urlRalations"


export const initialstate = {
  breadShow: false,
  bredcrumbItemName: '',
  showCountlabel: "",
  userAccess: {},
  newBtnView: false,
  excelBtnView: false,
  pageHeading: '',
  showCount: false,
  excelData: [],
  userAcc: {},
  pageField: {},
  masterPage: ''
}
const BreadcrumbFix1 = props => {

  const history = useHistory();
  const dispatch = useDispatch();
  // for Excel Download
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [downListKey, setDownListKey] = useState([]);
  const [breadcrumbDetail, setbreadcrumbDetail] = useState({});

  const { userAccess = [], downBtnData = [] } = useSelector((state) => ({
    userAccess: state.Login.RoleAccessUpdateData,
    downBtnData: state.BreadcrumbReducer.downBtnData,
  }));
  // 
  let { showCountlabel = '', bredcrumbItemName = '' } = useSelector((state) => ({
    showCountlabel: state.BreadcrumbReducer.showCountlabel,
    bredcrumbItemName: state.BreadcrumbReducer.bredcrumbItemName,

  }));

  // Onfocus Search Box
  // useEffect(() => {
  //   history.listen(location => {
  //     // dispatch(CommonBreadcrumbDetails(initialstate));
  //     setbreadcrumbDetail(initialstate)
  //     
  //   });
  // }, [history])

  // useEffect(() => {

  //   const reducerstate = redux.breadcrumbDetail
  //   let initial = { ...breadcrumbDetail }
  //   let selectedValues = Object.keys(reducerstate);
  //   selectedValues.forEach((i) => {

  //     initial[`${i}`] = reducerstate[`${i}`]
  //   })
  //   setbreadcrumbDetail(initial)

  // }, [])

  const {
    breadShow = true,
    newBtnView = false,
    excelBtnView = false,
    pageHeading = '',
    CountLabel = true,
    // excelData = [],
    masterPage
  } = breadcrumbDetail;

  var aaaa = ((CountLabel) && (showCountlabel.length > 0))
  
  useEffect(() => {

    const locationPath = history.location.pathname
    let userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {

      showCountlabel = '';
      bredcrumbItemName = '';
      const isnewBtnView = ((userAcc.PageType === 2) && (userAcc.RoleAccess_IsSave));
      const isCountLabel = (userAcc.CountLabel);
      const isexcelBtnView = (!(userAcc.PageType === 1) && (userAcc.RoleAccess_Exceldownload));
      dispatch(Breadcrumb_inputName(''))
      setbreadcrumbDetail({
        newBtnView: isnewBtnView,
        excelBtnView: isexcelBtnView,
        pageHeading: userAcc.PageHeading,
        CountLabel: isCountLabel,
        masterPage: urlRalations[userAcc.ActualPagePath],
      })

    }
  }, [history, userAccess])

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  // New Button Handller
  // const NewButtonHandeller = () => {



  //   // let pathName = history.location.pathname
  //   // let userAcc = userAccess.find((inx) => {
  //   //     return (`/${inx.ActualPagePath}` === pathName)
  //   // })
  //   // let listPagePath = userAccess.find((inx) => {
  //   //     return (inx.id === userAcc.RelatedPageID)
  //   // })
  //   // if (listPagePath === undefined) {
  //   //     return
  //   // }
  //   // 
  //   history.push({
  //     pathname: masterPage,
  //   })
  // }

  useEffect(() => {

    if (!(downBtnData === undefined)) {
      if ((downBtnData.length > 0)) {
        // object to array conversion
        const propertyNames = Object.keys(downBtnData[0]);
        setDownListKey(propertyNames)
      }
    }
  }, [downBtnData])

  const DownloadInExcelButtonHanler = (event, values) => {
    
    var list = []
    var object1 = {}
    var selectedValues = Object.keys(values);
    var filteredValues = selectedValues.filter(function (selectedValues) {
      return values[selectedValues]
    });

    downBtnData.map((index1) => {
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

    // e.preventDefault();
    const check = e.target
    // var chek = document.getElementById("checkAll").checked

    if (check.id === "checkAll") {
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
                    defaultValue={(downBtnData[0][`$defSelect${index}`]) ? true : false}
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

  if (breadShow) {
    return (
      // <React.Fragment>
      //   <header id="page-topbar" style={{ marginTop: "56px", backgroundColor: 'white', zIndex: "1" }} >
      //     <div className="navbar-header" style={{ paddingRight: "-10px" }}>
      //       <div className="d-flex" >
      //         <div className="navbar-brand-box" ></div>
      //         <div style={{ paddingLeft: "7px" }}>
      //           {
      //             newBtnView ?
      //               <div >
      //                 <button type="button" className="btn btn-success"
      //                   data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
      //                   onClick={NewButtonHandeller}>
      //                   New
      //                 </button>
      //                 <label className="font-size-18 form-label text-black " style={{ paddingLeft: "7px", }} >{pageHeading}</label>

      //               </div>
      //               :
      //               <div>
      //                 <label className="font-size-18  col-ls-6 col-form-label text-black" style={{ marginLeft: "6px" }}>
      //                   {pageHeading}</label>
      //                 {(bredcrumbItemName.length > 0) ?
      //                   <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary"
      //                     style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbItemName}</label>
      //                   : null
      //                 }
      //               </div>
      //           }
      //         </div>
      //       </div>

      //       <div className=" d-flex  justify-content-end"  >
      //         {excelBtnView ?
      //           <div className="px-2 " style={{ marginTop: "7px" }}>
      //             <Button
      //               type="button"
      //               title="Download List"
      //               color="btn btn-sm btn-outline-primary "
      //               onClick={() => { tog_scroll(); }}
      //               data-toggle="modal"
      //             >
      //               <i className="bx bx-download font-size-14" ></i>
      //             </Button>
      //           </div>
      //           : null}
      //         {
      //           (((CountLabel) && (showCountlabel.length > 0))) ?
      //             <div className="bg-dark text-center text-light external-event col-form-label  border border-Success rounded-2"
      //               style={{ width: "100%" }}>
      //               <samp className="px-2 ">{showCountlabel}</samp>
      //             </div>
      //             :
      //             null
      //         }
      //       </div>


      //     </div>
      //   </header>
      //   <Modal
      //     isOpen={modal_scroll}
      //     toggle={() => {
      //       tog_scroll();
      //     }}
      //     scrollable={true}
      //   >
      //     <div className="modal-header">
      //       <h5 className="modal-title mt-0">List</h5>

      //       <button
      //         type="button"
      //         onClick={() => setmodal_scroll(false)}
      //         className="close"
      //         data-dismiss="modal"
      //         aria-label="Close"
      //       >
      //         <span aria-hidden="true">&times;</span>
      //       </button>
      //     </div>
      //     <div className="modal-body">
      //       <AvForm onValidSubmit={(e, v) => { DownloadInExcelButtonHanler(e, v); }}>
      //         <div className="form-check">
      //           <input
      //             id="checkAll"
      //             type="checkbox"
      //             className="form-check-input"
      //             onChange={excelCheckBoxOnChange}
      //           />
      //           <label className="form-label text-black">All Select</label>
      //         </div>
      //         <ExcelCheckBox />

      //         <div className="modal-body">
      //           <div className="modal-footer">
      //             <button
      //               type="button"
      //               className="btn btn-secondary"
      //               onClick={() => setmodal_scroll(false)}
      //             >
      //               Cancel
      //             </button>
      //             <button type="submit" className="btn btn-primary" >
      //               Download in Excel
      //             </button>
      //           </div>
      //         </div>
      //       </AvForm>
      //     </div>
      //   </Modal>
      // </React.Fragment>
      <></>
    )
  } else {
    return (<></>)
  }
}


export default BreadcrumbFix
