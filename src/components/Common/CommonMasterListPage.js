
import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import { useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, CommonBreadcrumbDetails } from "../../store/actions";
import { breadcrumbReturnFunc, metaTagLabel, }
  from "./CommonFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { listPageActionsButtonFunc } from "./ListActionsButtons";
import DynamicColumnHook from "./TableCommonFunc";
import CustomTable from "../../CustomTable2";



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

  
  useEffect(async () => {// This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal

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

  
  useEffect(() => {// Edit Modal Show When Edit Data is true
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
  const [tableColumns, defaultSorted] = DynamicColumnHook({
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

          <CustomTable
            keyField={"id"}
            data={tableList}
            columns={tableColumns}
            defaultSorted={defaultSorted}
            onDataSizeChange={({ dataCount }) => {
              dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
            }}
            paginationEnabled={true}
            noDataIndication={<div className="text-danger text-center table-cursor-pointer"  >Data Not available</div>}
          />

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









