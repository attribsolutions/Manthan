import React, { useEffect, useState } from "react"
import { Modal, Button, Input, Label, } from "reactstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BreadcrumbDeleteButton,
  BreadcrumbNonDeleteButton,
  BreadcrumbReset
} from "../../store/Utilites/Breadcrumb/actions";
import { AvForm } from "availity-reactstrap-validation";
import { ExcelReportComponent } from "./ReportCommonFunc/ExcelDownloadWithCSS";
import { url } from "../../routes";
import { edit_PageListID_Action, edit_PageListID_Success, } from "../../store/actions";
import { loginRoleID, } from "./CommonFunction";

const BreadcrumbNew = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const roleId = loginRoleID();
  const [opacity, setOpacity] = useState(1);

  const [modal_scroll, setmodal_scroll] = useState(false);

  const [downListKey, setDownListKey] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [listPagePath, setListPagePath] = useState("");
  const [relatedPageId, setRelatedPageId] = useState(0);

  let {
    showCountlabel = '',
    bredcrumbItemName = '',
    breadcrumbDetail,
    IsRadioButtonView,
    radioButtonNonDelete,
    radioButtonDelete,
    editData,

  } = useSelector((state) => ({
    showCountlabel: state.BreadcrumbReducer.showCountlabel,
    bredcrumbItemName: state.BreadcrumbReducer.bredcrumbItemName,
    breadcrumbDetail: state.BreadcrumbReducer.breadcrumbDetail,
    IsRadioButtonView: state.BreadcrumbReducer.IsRadioButtonView,
    radioButtonNonDelete: state.BreadcrumbReducer.radioButtonNonDelete,
    radioButtonDelete: state.BreadcrumbReducer.radioButtonDelete,

    editData: state.H_Pages.editData,
    updateMsg: state.H_Pages.updateMessage,
  }));

  const {
    newBtnView = true,
    excelBtnView = true,
    pageHeading = '',
    CountLabel = true,
    newBtnPath = "",
    pageMode = "",
    downBtnData = [],
    defaultDownBtnData = {},
    pageField = {},
    userAcc,

  } = breadcrumbDetail;

  useEffect(() => {

    if (userAcc) {
      if ((userAcc.PageType === 1) || (userAcc.PageType === 3)) {
        setRelatedPageId(userAcc.id);
      }
      else {
        setRelatedPageId(userAcc.RelatedPageID);
      }
      setListPagePath(userAcc.ActualPagePath)
    }
  }, [userAcc]);


  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const NewButtonHandeller = () => {
    history.push({
      pathname: newBtnPath,
      pageMode: pageMode
    })
  }

  useEffect(() => {
    dispatch(BreadcrumbReset())
    return () => {
      dispatch(BreadcrumbNonDeleteButton(true));
      dispatch(BreadcrumbDeleteButton(false));
      setSelectAll(false);
    }
  }, [history.location.pathname]);

  useEffect(() => {

    if (defaultDownBtnData && Object.keys(defaultDownBtnData).length > 0) {
      const defaultDownBtnArray = Object.entries(defaultDownBtnData).map(([key, value]) => ({ [key]: value }));
      setDownListKey(defaultDownBtnArray);
      const allValuesTrue = defaultDownBtnArray.every((item) => Object.values(item)[0] === true);
      setSelectAll(allValuesTrue);

    }
  }, [defaultDownBtnData]);

  useEffect(() => {
    const handleScroll = () => {
      const newOpacity = 1 - window.scrollY * 0.01;
      setOpacity(newOpacity > 0 ? newOpacity : 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const nondeleteHandler = (event) => {
    let CheckedValue = event.target.checked
    if (!CheckedValue && !radioButtonDelete) {
      event.target.checked = true
      return;
    }
    dispatch(BreadcrumbNonDeleteButton(CheckedValue))
  }

  const deleteHandler = (event) => {
    let CheckedValue = event.target.checked
    if (!CheckedValue && !radioButtonNonDelete) {
      event.target.checked = true
      return;
    }
    dispatch(BreadcrumbDeleteButton(CheckedValue))
  }

  const DownloadInExcelButtonHanler = (event, values) => {
    let tableData = []
    let object1 = {}

    const filteredValues = downListKey
      .filter(obj => obj[Object.keys(obj)[0]]) // Filter objects with true values
      .map(obj => Object.keys(obj)[0]); // Extract keys

    downBtnData.map((index1) => {
      filteredValues.map((index2) => {
        if (index1.hasOwnProperty(index2)) {
          object1[index2] = index1[index2]
        }
      })
      tableData.push(object1)
      object1 = {}
    })
    ExcelReportComponent({
      pageField,
      excelTableData: tableData,
      excelFileName: pageHeading,
      listExcelDownload: filteredValues,
    });
    setmodal_scroll(false)
  }

  const handleCheckboxChange = (index) => {
    setDownListKey((prevListKey) => {
      const updatedList = [...prevListKey];
      const key = Object.keys(updatedList[index])[0];
      updatedList[index][key] = !updatedList[index][key];

      // Check if all checkboxes are selected
      const allValuesTrue = updatedList.every((item) => Object.values(item)[0] === true);
      setSelectAll(allValuesTrue);

      return updatedList;
    });
  };

  function handleSelectAllChange(e) {
    setSelectAll((prevSelectAll) => !prevSelectAll);

    if (e.target.checked) {
      setDownListKey((prevListKey) => {
        const updatedList = prevListKey.map((item) => {
          const key = Object.keys(item)[0];
          return {
            [key]: true,
          };
        });
        return updatedList;
      });
    } else {
      setDownListKey((prevListKey) => {
        const updatedList = prevListKey.map((item) => {
          const key = Object.keys(item)[0];
          return {
            [key]: false,
          };
        });
        return updatedList;
      });
    }
  }

  const ExcelCheckBox = React.memo(() => {
    const trueValues = downListKey.filter(item => Object.values(item)[0]);
    return (
      <div className="row">

        <div className="col col-12">
          <div className="row">
            <div className="col col-12">
              <Input
                className="text-black checkbox-border-red"
                type="checkbox"
                id={`selectAllCheckbox`}
                checked={selectAll}
                onChange={(e) => handleSelectAllChange(e)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label className="form-label text-black" style={{ fontSize: '15px', color: 'black', fontWeight: 'bold' }}> Select All</Label>
            </div>
          </div>
        </div>
        <>
          {downListKey.map((item, index) => (
            <div className="row" key={index}>
              <div className="col col-12">
                <div className="row">
                  <div className="col col-12">
                    <Input
                      className="text-black checkbox-border-red"
                      type="checkbox"
                      id={`chckbox${index}`}
                      defaultChecked={trueValues.includes(item)}
                      onChange={() => handleCheckboxChange(index)}
                      name={index}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Label className="form-label text-black"> {Object.keys(item)[0]} </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    );
  });

  useEffect(() => {
    if (editData.Status === true) {
      dispatch(edit_PageListID_Success({ ...editData, Status: false }));
      history.push({
        pathname: url.PAGE,  // The target URL
        editValue: editData.Data,
        pageMode: "edit",
        actualPagePath: listPagePath
      });
    }
  }, [editData]);

  function NavigateHandler() {
    dispatch(edit_PageListID_Action({ editId: relatedPageId, }))
  }

  return (

    <React.Fragment>
      <header id="page-topbar1" style={{ zIndex: "1", opacity }}  >
        <div className="navbar-header blur1" style={{ paddingRight: "-10px", zIndex: "-1" }}>
          <div className="d-flex" >
            <div className="navbar-brand-box d-none d-lg-block" style={{ backgroundColor: "white" }} ></div>
            <div style={{ paddingLeft: "7px" }} >

              {
                newBtnView ?
                  <div  >
                    <button type="button" className="btn btn-success "
                      style={{
                        padding: "2px", paddingInline: "5px", color: "white",
                        // border: "solid",
                        // borderColor: "green",
                        // backgroundColor: "hsla(0,0%,100%,.5)"
                      }}
                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Create New"
                      onClick={NewButtonHandeller}>
                      New
                    </button>
                    <label onClick={() => roleId === 13 && NavigateHandler()}
                      className="font-size-16 form-label text-black " style={{ paddingLeft: "7px", }} >{pageHeading}</label>
                  </div>
                  :
                  <div onClick={() => roleId === 13 && NavigateHandler()}>
                    <label className="font-size-16  col-ls-6 col-form-label text-black"
                      style={{ marginLeft: "6px" }}
                    >
                      {pageHeading}</label>
                    {(bredcrumbItemName.length > 0) ?
                      <label className="font-size-21 form-label  text-nowrap bd-highlight text-primary"
                        style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbItemName}</label>
                      : null
                    }
                  </div>
              }
            </div>
          </div>

          <div className=" d-flex gap-2 justify-content-end"  >

            {(excelBtnView && !(downBtnData.length === 0)) ?
              <div className="px-2 ">
                <Button
                  type="button"
                  title="Download List"
                  style={{padding: "2px" ,paddingInline:"5px"}}
                  color="btn btn-sm btn-outline-primary "
                  onClick={() => { tog_scroll(); }}
                  data-toggle="modal"
                >
                  <i className="bx bx-download font-size-14" ></i>
                </Button>
              </div>
              : null}
            {IsRadioButtonView ?
              <div >
                <div className="btn-group mt-1"
                  role="group" aria-label="Basic checkbox toggle button group">

                  <input type="checkbox"
                    id='btncheckNonDeleted'
                    className="btn-check" autoComplete="off"
                    checked={radioButtonNonDelete}
                    onChange={nondeleteHandler}
                  />
                  <label className="btn btn-outline-secondary" htmlFor="btncheckNonDeleted">NonDeleted</label>

                  <input type="checkbox" className="btn-check"
                    id='btncheckDeleted'
                    autoComplete="off"
                    checked={radioButtonDelete}
                    onChange={deleteHandler} />
                  <label className="btn btn-outline-secondary" htmlFor="btncheckDeleted" > Deleted</label>

                </div>
              </div>
              : null}
            {
              (((CountLabel) && (showCountlabel.length > 0))) ?
                <div className="bg-dark text-center text-light external-event col-form-label border border-Success rounded-2"
                  style={{ width: "100%", padding: "3px" }}>
                  <samp className="px-1  ">{showCountlabel}</samp>
                </div>
                :
                null
            }
          </div>
        </div>
      </header>

      <Modal
        isOpen={modal_scroll}
        toggle={() => {
          tog_scroll();
        }}
        scrollable={true}
      >
        <div className="modal-header" style={{ backgroundColor: '#cce6f6' }}>
          <h5 className="modal-title mt-0" >
            {pageHeading}
          </h5>

          <button
            type="button"
            onClick={() => setmodal_scroll(false)}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{ color: 'black', fontWeight: 'bold', }} // Added a background color for visibility
          >
          </button>
        </div>
        <div className="modal-body">
          <AvForm onValidSubmit={(event, values) => { DownloadInExcelButtonHanler(event, values); }}>
            <ExcelCheckBox />

            <div className="modal-body">
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setmodal_scroll(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" >
                  Download in Excel
                </button>
              </div>
            </div>

          </AvForm>
        </div>
      </Modal>
    </React.Fragment >
  )

}


export default BreadcrumbNew;
