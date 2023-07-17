
import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, CommonBreadcrumbDetails } from "../../store/actions";
import { breadcrumbReturnFunc, metaTagLabel, }
  from "./CommonFunction";
import { defaultSearch, mySearchProps } from "./SearchBox/MySearch";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { listPageActionsButtonFunc } from "./ListActionsButtons";
import DynamicColumnHook from "./TableCommonFunc";
import CustomTable from "../../CustomTable2/Custom/index";


let sortType = "asc"
let searchCount = 0

let searchProps = {
  onClear: function onClear() { },
  onSearch: function onSearch() { },
  searchText: ""
}

// export const countlabelFunc = (toolkitProps, paginationProps, dispatch, ButtonMsgLable) => {

//   let iscall = 0
//   if (paginationProps.dataSize) {
//     iscall = paginationProps.dataSize
//   }

//   if (!(iscall === searchCount)) {
//     dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${iscall}`))
//     searchCount = paginationProps.dataSize
//   }
//   searchProps = toolkitProps.searchProps
// }
export const countlabelFunc = (toolkitProps, paginationProps, dispatch, ButtonMsgLable) => {
  let iscall = 0;
  if (paginationProps.dataSize) {
    iscall = paginationProps.dataSize;
  }

  // Reset pagination to first page when a search is performed
  if (searchProps.searchText !== toolkitProps.searchProps.searchText) {
    paginationProps.onPageChange(1);
  }

  if (iscall !== searchCount) {
    dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count:${iscall}`));
    searchCount = iscall;
  }
  searchProps = toolkitProps.searchProps;
};

const CommonListPage = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userAccState, setUserAccState] = useState('');
  const [modal_edit, setmodal_edit] = useState(false);


  const {
    tableList,
    editData,
    updateMsg,
    deleteMsg,
    userAccess,
    postMsg,
    pageField,

  } = props.reducers;

  const {
    getList,
    editId,
    deleteId,
    postSucc,
    updateSucc,
    deleteSucc

  } = props.action

  const {
    getListbodyFunc = () => { },
    MasterModal,
    ButtonMsgLable,
    masterPath,

  } = props;

  const { PageFieldMaster = [] } = { ...pageField };

  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserAccState(userAcc);
      breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath: masterPath });
    }
  }, [userAccess]);


  useEffect(() => {

    let downList = [];
    let defaultDownList2 = [];
    let listObj = {};
    let listObj2 = {};

    tableList.forEach((index1) => {

      PageFieldMaster.forEach((index2) => {

        if (index2.ShowInDownload) {
          listObj2[index2.ControlID] = index2.ShownloadDefaultSelect
          listObj[index2.ControlID] = index1[index2.ControlID]
        }
      })

      downList.push(listObj)
      defaultDownList2.push(listObj2)
      listObj = {}
    })
    dispatch(CommonBreadcrumbDetails({ downBtnData: downList, defaultDownBtnData: listObj2 }))
  }, [tableList])

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(async () => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
      dispatch(updateSucc({ Status: false }));
      dispatch(getList(getListbodyFunc()));
      customAlert({
        Type: 1,
        Message: JSON.stringify(updateMsg.Message),
      })
      tog_center();
    } else if (updateMsg.Status === true) {
      dispatch(updateSucc({ Status: false }));
      customAlert({
        Type: 3,
        Message: JSON.stringify(updateMsg.Message),
      })

    }
  }, [updateMsg]);


  useEffect(async () => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteSucc({ Status: false }));

      const promise = await customAlert({
        Type: 1,
        Message: deleteMsg.Message,
      })
      dispatch(getList(getListbodyFunc()));
    } else if (deleteMsg.Status === true) {
      dispatch(deleteSucc({ Status: false }));
      customAlert({
        Type: 3,
        Message: JSON.stringify(deleteMsg.Message),
      })
    }
  }, [deleteMsg]);


  useEffect(async () => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(postSucc({ Status: false }))
      const promise = await customAlert({
        Type: 1,
        Message: postMsg.Message
      })
      dispatch(getList(getListbodyFunc()));
      tog_center();

    }

    else if ((postMsg.Status === true)) {
      dispatch(postSucc({ Status: false }))
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      })
    }


  }, [postMsg])

  // Edit Modal Show When Edit Data is true
  useEffect(() => {

    if (editData.Status === true) {
      if (pageField.IsEditPopuporComponent) {
        history.push({
          pathname: masterPath,
          editValue: editData.Data,
          pageMode: editData.pageMode,

        })
      }
      else {
        setmodal_edit(true)
      }
    }
  }, [editData]);

  function tog_center() {
    if (modal_edit) {
      breadcrumbReturnFunc({ dispatch, userAcc: userAccState, newBtnPath: masterPath });
    }
    setmodal_edit(false)
  }


  const lastColumn = () => {
    return listPageActionsButtonFunc({
      ...props, dispatch, history, userAccState,
      editActionFun: editId,
      deleteActionFun: deleteId,
    })
  }
  const [tableColumns, defaultSorted, pageOptions] = DynamicColumnHook({
    pageField,
    lastColumn,
    userAccState,
    reducers: props.reducers,
  })

  if (!(userAccState === '')) {
    return (
      <React.Fragment>
        <MetaTags> {metaTagLabel(userAccState)}</MetaTags>
        <div className="page-content">

          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={tableList}
                columns={tableColumns}
                // search={defaultSearch(pageField.id)}
              >
                {(toolkitProps, a) => (
                  <React.Fragment>
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive" >
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            defaultSorted={defaultSorted}
                            striped={true}
                            classes={"table table-bordered table-hover"}
                            noDataIndication={<div className="text-danger text-center table-cursor-pointer"  >Data Not available</div>}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>

                      {countlabelFunc(toolkitProps, paginationProps, dispatch, ButtonMsgLable)}
                      {mySearchProps(toolkitProps.searchProps, pageField.id)}
                    </Row>
                    <Row className="align-items-md-center mt-30">
                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                        <PaginationListStandalone {...paginationProps} />
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>


          <Modal isOpen={modal_edit} toggle={() => { tog_center() }} size="xl">
            <MasterModal editValue={editData.Data} masterPath={masterPath} pageMode={editData.pageMode} pageHeading={userAccess.pageHeading} />
          </Modal>
        </div>

      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}

export default CommonListPage;
