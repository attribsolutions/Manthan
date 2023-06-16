import { CommonConsole, sap_date_dmy_func } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { getOrderApprovalDetailActionSucc, orderApprovalAction, orderApprovalActionSuccess } from "../../../store/actions";

export const orderApprovalFunc = ({ dispatch, approvalDetail }) => {
    if ((approvalDetail.Status === true)) {
        try {
            const { Data, btnId } = approvalDetail;

            let isorderItemSet = [];
            Data.OrderItem.forEach(i => {
                if (i.Quantity > 0) {
                    isorderItemSet.push({
                        "OrderNo": (5000000 + Number(Data.id)).toString(),//parent--id
                        "ItemNo": (i.id).toString(), //OrderItem--id
                        "Material": (i.ItemSAPCode).toString(),//OrderItem--ItemSAPCode
                        "Quantity": (i.QuantityInNo).toString(),//OrderItem--QuantityInNo 
                        "Unit": "EA",
                        "Plant": (Data.SupplierSAPCode).toString(),//parent
                        "Batch": ""// blank
                    })
                }
            });

            let body = {
                "Customer": (Data.CustomerSAPCode).toString(),//parent--CustomerSAPCode 
                "DocDate": sap_date_dmy_func(Data.OrderDate), //parent--OrderDate
                "Indicator": "C",
                "OrderNo": (5000000 + Number(Data.id)).toString(),//parent--id
                "Stats": "1",
                "CancelFlag": "", //blank
                "OrderItemSet": isorderItemSet,
            }
            const jsonBody = JSON.stringify(body);

            dispatch(getOrderApprovalDetailActionSucc({ Status: false }))
            dispatch(orderApprovalAction({ jsonBody, btnId }))
        } catch (e) {

            dispatch(getOrderApprovalDetailActionSucc({ Status: false }))
            dispatch(orderApprovalActionSuccess({
                Status: true,
                Message: "Order Save Successfully But Can't Send in 'SAP'"
            }))

        }
    }
}

export const orderApprovalMessage = async ({ dispatch, orderApprovalMsg, listPath, history }) => {
    try {
        if (orderApprovalMsg.Status === true && orderApprovalMsg.StatusCode === 200) {
            dispatch(orderApprovalActionSuccess({ Status: false }))

            const a = await customAlert({
                Type: 1,
                Message: orderApprovalMsg.Message,
            })
            if (a) {
                history.push({
                    pathname: listPath,
                });
            }

        } else if (orderApprovalMsg.Status === true) {
            dispatch(orderApprovalActionSuccess({ Status: false }))
            customAlert({
                Type: 2,
                Message: JSON.stringify(orderApprovalMsg.Message),
            })
        }
    } catch (e) { }
}