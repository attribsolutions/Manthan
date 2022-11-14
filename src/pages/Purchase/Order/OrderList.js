import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderIdSuccess,
    editOrderId,
    getOrderListPage,
    updateOrderIdSuccess,
    // getOrderList
} from "../../../store/Purchase/OrderPageRedux/actions";
import {  commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage"
import Order from "./Order";
import { ORDER } from "../../../routes/route_url";

const OrderList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.OrderReducer.orderList,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg:state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
  
    const action = {
        getList: getOrderListPage,
        editId: editOrderId,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }


    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(124))
        dispatch(getOrderListPage());
    }, []);

    const { pageField } = reducers;

    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={Order}
                        masterPath={ORDER}
                        ButtonMsgLable={"Order"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default OrderList;