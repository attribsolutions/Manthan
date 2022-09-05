import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss";
// import CategoryMaster from "./CategoryMaster";

import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
// import { deleteProductCategoryTypeIDSuccess, delete_ProductCategoryType_ID,  updateProductCategoryTypeIDSuccess } from "../../../store/Administrator/PartyTypeRedux/action";
import { AlertState } from "../../../store/actions";
import { deleteSubCategoryIDSuccess, delete_SubCategory_ID, editSubCategoryID, getSubCategorylist, updateSubCategoryIDSuccess } from "../../../store/Administrator/SubCategoryRedux/action";
import SubCategoryMaster from "./SubCategoryMaster";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";
// import { AlertState } from "../../../store/action";

const SubCategoryList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  // var  editData=[]

  const { TableListData, editData, updateMessage, deleteMessage, RoleAccessModifiedinSingleArray } = useSelector(
    (state) => ({
      TableListData: state.SubCategoryReducer.SubCategoryListData,
      editData: state.SubCategoryReducer.editData,
      updateMessage: state.SubCategoryReducer.updateMessage,
      deleteMessage: state.SubCategoryReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    })
  );

  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [RoleAccessModifiedinSingleArray])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getSubCategorylist());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateSubCategoryIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getSubCategorylist,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateSubCategoryIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),
        })
      );
    }
  }, [updateMessage]);

  useEffect(() => {
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteSubCategoryIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getSubCategorylist,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteSubCategoryIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: TableListData.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "Name",
      dataField: "Name",
      sort: true,
    },

    {
      text: "Category Type  ",
      dataField: "ProductCategoryTypeName",
      sort: true,
    },

   // For Edit, Delete ,and View Button Common Code function
   listPageCommonButtonFunction({
    dispatchHook: dispatch,
    ButtonMsgLable: "SubCategory",
    deleteName:"Name",
    userPageAccessState: userPageAccessState,
    editActionFun: editSubCategoryID,
    deleteActionFun: delete_SubCategory_ID
})
  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>SubCategoryList| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                defaultSorted={defaultSorted}
                data={TableListData}
                columns={pagesListColumns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={userPageAccessState.PageHeading}
                      IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                      SearchProps={toolkitProps.searchProps}
                      breadcrumbCount={`Product Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                      RedirctPath={`/SubCategoryMaster`}
                      isExcelButtonVisible={true}
                      ExcelData={TableListData}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            classes={"table  table-bordered"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
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
          <Modal
            isOpen={modal_center}
            toggle={() => {
              tog_center();
            }}
            size="xl"
          >
            <SubCategoryMaster state={editData.Data} relatatedPage={"/SubCategoryMaster"} pageMode={editData.pageMode}/>
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

export default SubCategoryList;
