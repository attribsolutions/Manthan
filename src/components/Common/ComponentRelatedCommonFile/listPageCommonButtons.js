import { Button } from "reactstrap";
import { AlertState } from "../../../store/actions";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";


const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "


export const listPageCommonButtonFunction = (props) => {

    const dispatch = props.dispatchHook;
    const userCreated = parseInt(localStorage.getItem("userId"))
    const {
        userAccState,
        editActionFun,
        deleteActionFun,
        ButtonMsgLable,
        deleteName,
        downBtnFunc,
        editBodyfunc
    } = props;

    /***
     * deletemsgLable change to=> ButtonMsgLable line no:11 
     *    autho by => Rohit  date :22-08-022 */

    //  function editHandler(rowData) {
    //     dispatch(editActionFun(rowData.id, "edit",));
    // }

    function editHandler(rowData) {
      
        if (editBodyfunc) { editBodyfunc(rowData) }
        else {
            dispatch(editActionFun(rowData.id, "edit",));
        }
    }

    function copyHandler(rowData) {
        dispatch(editActionFun(rowData.id, "copy",));
    }

    function downHandler(rowData) {
        downBtnFunc(rowData);
    }

    function deleteHandler(rowData) {
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
            RedirectPath: false,
            PermissionAction: deleteActionFun,
            ID: rowData.id,
        }));
    }


    return ({
        text: "Action",
        hidden:
            (
                !(userAccState.RoleAccess_IsEdit)
                && !(userAccState.RoleAccess_IsView)
                && !(userAccState.RoleAccess_IsDelete)
                && !(userAccState.RoleAccess_IsEditSelf)) ? true : false,

        formatter: (cellContent, rowData) => (<div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

            {
                //** if condition start

                (userAccState.RoleAccess_IsEdit) //condtion:1
                    ?
                    (<Button
                        type="button"
                        className={editBtnCss}
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Edit ${ButtonMsgLable}`}
                        onClick={() => { editHandler(rowData) }}
                    >
                        <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </Button>)

                    : // **Else-If Condition start 

                    ((userAccState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated)) //**condition :2
                        ?
                        <Button
                            type="button"
                            className={editSelfBtnCss}
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title={`EditSelf ${ButtonMsgLable}`}
                            onClick={() => { editHandler(rowData) }}
                        >
                            <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                        </Button>

                        : // **second else-if condition

                        (userAccState.RoleAccess_IsView)  // ** condition :3
                            ?
                            <Button
                                type="button"
                                className={editSelfBtnCss}
                                data-mdb-toggle="tooltip" data-mdb-placement="top" title={`View ${ButtonMsgLable}`}
                                onClick={() => { editHandler(rowData) }}
                            >
                                <i className="bx bxs-show font-size-18 "></i>
                            </Button>

                            : null  // **else null

            }


            {(userAccState.RoleAccess_IsDelete)
                ?
                <Button
                    type="button"
                    className={deltBtnCss}
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Delete ${ButtonMsgLable}`}
                    onClick={() => { deleteHandler(rowData) }}
                >
                    <i className="mdi mdi-delete font-size-18"></i>
                </Button>
                /*chnage delete-self functionality  autho by- Rohit date: 22-08-022 
                line no 88 to 108
                */
                :
                ((userAccState.RoleAccess_IsDeleteSelf) && (rowData.CreatedBy === userCreated))
                    ?
                    <Button
                        type="button"
                        className={deltBtnCss}
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Delete ${ButtonMsgLable}`}
                        onClick={() => { deleteHandler(rowData) }}
                    >
                        <i className="mdi mdi-delete font-size-18"></i>
                    </Button>
                    : null
            }
            {((userAccState.RoleAccess_IsSave) && (userAccState.RoleAccess_IsCopy)) ?
                <Button
                    type="button"
                    className={editSelfBtnCss}
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Copy ${ButtonMsgLable}`}
                    onClick={() => { copyHandler(rowData) }}
                >
                    <i className="bx bxs-copy font-size-18 "></i>
                </Button>
                : null
            }
            {((userAccState.RoleAccess_IsPrint)) ?
                <Button
                    type="button"
                    className={downBtnCss}
                    data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Download ${ButtonMsgLable}`}
                    onClick={() => { downHandler(rowData) }}
                >
                    <i className="bx bx-printer font-size-18"></i>
                </Button>
                : null
            }
            {/* {makeBtnShow ? <Button
                type="button"
                className={makeBtnCss}
                data-mdb-toggle="tooltip" data-mdb-placement="top" title={makeBtnName}
                onClick={() => { makeBtnHandler(rowData) }}
            >
                <span style={{ marginLeft: "6px" ,marginRight:"6px"}} className=" fas fa-file-invoice" ></span> </Button>
                 : <></>} */}

        </div>
        )
    }
    )

}

export const commonDefaultSorted = (name) => {
    return (
        [{
            dataField: name,
            order: 'asc'
        }]
    )
}

export const commonPageOptions = (TableList) => {
    return {
        sizePerPage: 10,
        totalSize: TableList.length, // replace later with size(customers),
        custom: true,
    }
}

export const commonListPageDelete_UpdateMsgFunction = (props) => {

    const dispatch = props.dispatch
    const response = props.response
    const resetAction = props.resetAction
    const afterResponseAction = props.afterResponseAction

    if ((response.Status === true) && (response.StatusCode === 200)) {
        dispatch(resetAction({ Status: false }))
        dispatch(AlertState({
            Type: 1, Status: true,
            Message: response.Message,
            AfterResponseAction: afterResponseAction,
        }))
    } else if (response.Status === true) {
        dispatch(resetAction({ Status: false }))
        dispatch(AlertState({
            Type: 3,
            Status: true,
            Message: response.Message,
        }));
    }
}

export const excelDownCommonFunc = (props) => {//++++++++Common Excel Covernt Data Function ++++++++++++++
    const { tableList = [], PageFieldMaster = [] } = props

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
    return downList
}

const currentDatefunc = () => {//+++++++++++++++ Cuurnt Date++++++++++++++++++++++++++++++++++++
    const current = new Date();
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` :
        `${month}`}-${current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`}`;
    return currentDate
}
export const currentDate = currentDatefunc();

export const invertDatefunc = (inp) => {//+++++++++++++++ Current Date++++++++++++++++++++++++++++
    const current = new Date(inp);
    const month = current.getMonth() + 1;
    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` :
        `${month}`}-${current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`}`;
    return currentDate
}

export const createdBy = () => {//++++++++++++++++++++++ Seesion User Id+++++++++++++++++++++++++++++
    let createdBy = 0
    try {
        createdBy = JSON.parse(localStorage.getItem('userId'))
    } catch (e) { alert("Common Created By Error") }
    return createdBy
}

export const userCompany = () => {//+++++++++++++++++++++ Seesion Company Id+++++++++++++++++++++++++++++
    let userCompany = 0
    try {
        userCompany = JSON.parse(localStorage.getItem('Company'))
    } catch (e) { alert("Common userCompany  Error") }
    return userCompany
}

export const userParty = () => {//+++++++++++++++++++++ Seesion userParty Id+++++++++++++++++++++++++++++++
    let userParty = 0
    try {
        userParty = JSON.parse(localStorage.getItem("roleId")).Party_id
    } catch (e) { alert("Common userParty Func  Error") }
    return userParty
}

export function convertTimefunc(inputDate) { //+++++++++++Convert Time Format+++++++++++++++++++++++++++++++
    const date = new Date(inputDate);
    let month = date.getMonth() + 1;

    let convDate = `${date.getDate() < 10 ? `0${date.getDate()}` :
        `${date.getDate()}`}-${month < 10 ? `0${month}` :
            `${month}`}`;

    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let timeString = hours + ":" + minutes;

    let [hourString, minute] = timeString.split(":");
    let hour = +hourString % 24;
    let time = (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
    return (`(${convDate} ${time})`)
}

export function convertDatefunc(inputDate) {// +++++++++++Convert Date Format+++++++++++++++++++++++++++++++
    const date = new Date(inputDate);
    let month = date.getMonth() + 1;

    let convDate = `${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`}-${month < 10 ? `0${month}`
        : `${month}`}-${date.getFullYear()}`;
    return convDate
}

export function saveDissable({ id = '', state = false }) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++
    // try {
    //     document.getElementById("overlay").style.display = state ? "block" : "none";
    // } catch (e) { alert("button sppiner error") }
    // try {
    //     document.getElementById(`form_submmit${id}`).disabled = state;
    // } catch (e) {
    //     //alert("Save button dissable error") 
    // }
}
export function mainSppinerOnOff({ id = '', state = false }) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++
    try {
        document.getElementById("overlay").style.display = state ? "block" : "none";
    } catch (e) { alert("button sppiner error") }
    try {
        document.getElementById(`${id}`).disabled = state;
    } catch (e) {
        // alert("Go btn dissable  error") 
    }
}

export function GoBtnDissable(state = false) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++
    try {
        document.getElementById("overlay").style.display = state ? "block" : "none";
    } catch (e) {
        alert("Go btn dissable overlay error")
    }
    try {
        document.getElementById('gobtn_submmit').disabled = state;
    } catch (e) {
        // alert("Go btn dissable  error") 
    }
}

export function convertNumber(e) {//++++++++++++++++++++++ Convert Quantity +++++++++++++++++++++++++++++
    return parseFloat(e).toFixed(3)
}