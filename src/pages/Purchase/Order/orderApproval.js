import { sap_date_dmy_func } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { getOrderApprovalDetailActionSucc, orderApprovalAction, orderApprovalActionSuccess } from "../../../store/actions";

export const orderApprovalFunc = ({ dispatch, approvalDetail }) => {
    if ((approvalDetail.Status === true)) {

        const { Data, btnId } = approvalDetail;

        let isorderItemSet = [];
        Data.OrderItem.forEach(i => {
            if (i.Quantity > 0) {
                isorderItemSet.push({
                    "OrderNo": Data.id,//parent id
                    "ItemNo": i.Item_id, //OrderItem--id
                    "Material": i.SAPItemCode,//OrderItem--SAPItemCode
                    "Quantity": i.Quantity,//OrderItem--Quantity
                    "Unit": i.SAPUnitName,//OrderItem--SAPUnitName
                    "Plant": Data.SupplierSAPCode,//parent
                    "Batch": ""// blank
                })
            }
        })
        let body = {
            "Customer": Data.CustomerSAPCode,//parent--CustomerSAPCode 
            "DocDate": sap_date_dmy_func(Data.OrderDate), //parent--OrderDate
            "Indicator": "F",
            "OrderNo": Data.id,//parent--id
            "Stats": "1",
            "OrderItemSet": isorderItemSet,
            "CancelFlag": "" //blank
        }
        const jsonBody = JSON.stringify(body);
        
        dispatch(getOrderApprovalDetailActionSucc({ Status: false }))
        dispatch(orderApprovalAction({ jsonBody, btnId }))
    }
}

export const orderApprovalMessage = ({ dispatch, orderApprovalMsg }) => {
    if (orderApprovalMsg.Status === true && orderApprovalMsg.StatusCode === 200) {
        dispatch(orderApprovalActionSuccess({ Status: false }))
        customAlert({
            Type: 1,
            Message: orderApprovalMsg.Message,
        })
    } else if (orderApprovalMsg.Status === true) {
        dispatch(orderApprovalActionSuccess({ Status: false }))
        customAlert({
            Type: 4,
            Message: JSON.stringify(orderApprovalMsg.Message),
        })
    }
}