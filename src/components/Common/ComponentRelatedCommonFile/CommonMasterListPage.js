
import React, { useEffect,  useState } from "react";
import { Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { AlertState, BreadcrumbShowCountlabel, CommonBreadcrumbDetails } from "../../../store/actions";
import { breadcrumbReturn,  listPageCommonButtonFunction, saveDissable }
  from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { defaultSearch, mySearchProps } from "./MySearch";


let sortType = "asc"
let searchCount = 0

let searchProps = {
  onClear: function onClear() { },
  onSearch: function onSearch() { },
  searchText: ""
}

export const countlabelFunc = (toolkitProps, paginationProps, dispatch, ButtonMsgLable) => {

  let iscall = 0
  if (paginationProps.dataSize) {
    iscall = paginationProps.dataSize
  }

  if (!(iscall === searchCount)) {
    dispatch(BreadcrumbShowCountlabel(`${ButtonMsgLable} Count :${iscall}`))
    searchCount = paginationProps.dataSize
  }
  searchProps = toolkitProps.searchProps
}

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
    pageField

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
    MasterModal,
    ButtonMsgLable,
    deleteName,
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
      breadcrumbReturn({ dispatch, userAcc, newBtnPath: masterPath });
    }
  }, [userAccess]);


  useEffect(() => {
    let downList = [];
    let listObj = {};

    tableList.forEach((index1) => {
      PageFieldMaster.forEach((index2) => {
        if (index2.ShowInDownload) {
          listObj[`$defSelect${index2.ControlID}`] = index2.ShownloadDefaultSelect
          listObj[index2.ControlID] = index1[index2.ControlID]
        }
      })
      downList.push(listObj)
      listObj = {}
    })
    dispatch(CommonBreadcrumbDetails({ downBtnData: downList }))

  }, [tableList])


  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200) {
      saveDissable(false);//+++++++++save Button Is enable function

      dispatch(updateSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMsg.Message,
          AfterResponseAction: getList,
        })
      );
      tog_center();
    } else if (updateMsg.Status === true) {

      saveDissable(false);//+++++++++save Button Is enable function
      dispatch(updateSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg]);


  useEffect(() => {
    if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
      dispatch(deleteSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMsg.Message,
          AfterResponseAction: getList,
        })
      );
    } else if (deleteMsg.Status === true) {
      dispatch(deleteSucc({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMsg.Message),
        })
      );
    }
  }, [deleteMsg]);


  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(postSucc({ Status: false }))
      saveDissable(false);//+++++++++save Button Is enable function
      tog_center();
      dispatch(getList());
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: postMsg.Message,
      }))
    }

    else if ((postMsg.Status === true)) {
      saveDissable(false);//+++++++++save Button Is enable function
      dispatch(postSucc({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMsg.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
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
        tog_center();
      }
    }
  }, [editData]);

  function tog_center() {
    setmodal_edit(!modal_edit); //when edit mode show in pop up that modal view controle
  }

  PageFieldMaster.sort(function (a, b) {  //sort function is  sort list page coloumn by asending order by listpage sequense
    return a.ListPageSeq - b.ListPageSeq
  });

  let sortLabel = ""
  const columns = []

  PageFieldMaster.forEach((i, k) => {
    if (i.ShowInListPage) {
      columns.push({
        text: i.FieldLabel,
        dataField: i.ControlID,
        sort: true,
      })

      if (i.DefaultSort === 1) {
        sortLabel = i.ControlID
        sortType = "asc"
      } else if (i.DefaultSort === 2) {
        sortLabel = i.ControlID;
        sortType = "desc"
      }
    }
    if (PageFieldMaster.length - 1 === k) {
      columns.push(listPageCommonButtonFunction({
        dispatchHook: dispatch,
        ButtonMsgLable: ButtonMsgLable,
        deleteName: deleteName,
        userAccState: userAccState,
        editActionFun: editId,
        deleteActionFun: deleteId
      })
      )
    }
  })

  const defaultSorted = [
    {
      dataField: sortLabel, // if dataField is not match to any column you defined, it will be ignored.
      order: sortType, // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 15,
    // totalSize: tableList.length,
    custom: true,
  };

  if (!(userAccState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={tableList}
                columns={columns}
                search={defaultSearch(pageField.id)}
              >
                {(toolkitProps, a) => (
                  <React.Fragment>
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive table " >
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            defaultSorted={defaultSorted}
                            striped={true}
                            classes={"table  table-bordered table-hover"}
                            noDataIndication={<div className="text-danger text-center ">Data Not available</div>}
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
