import { Button } from "reactstrap";
import * as mode from "../../../routes/PageMode"
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { CommonBreadcrumbDetails } from "../../../store/actions";

const editBtnCss = "badge badge-soft-success font-size-12 btn btn-success waves-effect waves-light w-xxs border border-light"
const editSelfBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
const deltBtnCss = "badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
const downBtnCss = "badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
export const makeBtnCss = "badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light "


export const listPageCommonButtonFunction = (props) => {

    const dispatch = props.dispatchHook;
    const userCreated = parseInt(localStorage.getItem("userId"))
    const {
        subPageMode = '',
        userAccState,
        editActionFun,
        deleteActionFun,
        ButtonMsgLable,
        deleteName,
        downBtnFunc,
        editBodyfunc,
        makeBtnFunc = () => { },
        pageMode,
        makeBtnName,
        makeBtnShow = false
    } = props;

    function editHandler(rowData, btnmode, btnId) {

        const config = { editId: rowData.id, btnmode, subPageMode, btnId }

        btnIsDissablefunc({ btnId, state: true })
        if (editBodyfunc) {
            editBodyfunc(rowData, btnmode, subPageMode, btnId)
        } else {
            dispatch(editActionFun({ ...config }));
        }
    };

    function copyHandler(rowData, btnmode) {
        dispatch(editActionFun(rowData.id, btnmode, subPageMode));
    };

    function downHandler(rowData) {
        downBtnFunc(rowData);
    };

    async function deleteHandler(rowData, btnId) {
        const rep = await CustomAlert({
            Type: 8,
            Message: `Are you sure you want to delete this ${ButtonMsgLable} : "${rowData[deleteName]}"`,
        })
        if (rep) {
            btnIsDissablefunc({ btnId, state: true })
            const config = { deleteId: rowData.id, subPageMode, btnId }
            dispatch(deleteActionFun({ ...config }))
        }
    }

    function makeBtnHandler(rowData) {
        rowData["hasSelect"] = true;
        let arr = []
        arr.push(rowData)
        makeBtnFunc(arr)
    }

    return ({
        text: "Action",
        hidden:
            (
                !(userAccState.RoleAccess_IsEdit)
                && !(userAccState.RoleAccess_IsView)
                && !(userAccState.RoleAccess_IsDelete)
                && !(userAccState.RoleAccess_IsEditSelf)) ? true : false,

        formatter: (cellContent, rowData) => {
            const forceEdit = rowData.forceEdit;
            rowData["hasSelect"] = false
            return (
                <div className="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >


                    {
                        ((pageMode === mode.modeSTPList) && makeBtnShow && rowData.POType === 3) ?
                            < Button
                                type="button"
                                id={`btn-makeBtn-${rowData.id}`}
                                className={makeBtnCss}
                                title={makeBtnName}
                                onClick={() => {
                                    const btnid = `btn-makeBtn-${rowData.id}`
                                    makeBtnHandler(rowData, btnid)
                                }}
                            >
                                <span style={{ marginLeft: "6px", marginRight: "6px" }}
                                    className=" fas fa-file-invoice" ></span> </Button>
                            : <div></div>
                    }
                    {
                        //** if condition start

                        (userAccState.RoleAccess_IsEdit && !forceEdit) //condtion:1
                            ?
                            (<Button
                                type="button"
                                id={`btn-edit-${rowData.id}`}
                                className={editBtnCss}
                                title={`Edit ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnid = `btn-edit-${rowData.id}`
                                    editHandler(rowData, mode.edit, btnid)
                                }}
                            >
                                <i className="mdi mdi-pencil font-size-18" ></i>
                            </Button>)

                            : // **Else-If Condition start 

                            ((userAccState.RoleAccess_IsEditSelf) && (rowData.CreatedBy === userCreated) && !forceEdit) //**condition :2
                                ?
                                <Button
                                    type="button"
                                    id={`btn-edit-${rowData.id}`}
                                    className={editSelfBtnCss}
                                    title={`EditSelf ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnid = `btn-edit-${rowData.id}`
                                        editHandler(rowData, mode.edit, btnid)
                                    }}
                                >
                                    <i className="mdi mdi-pencil font-size-18" ></i>
                                </Button>

                                : // **second else-if condition

                                (userAccState.RoleAccess_IsView)  // ** condition :3
                                    ?
                                    <Button
                                        type="button"
                                        className={editSelfBtnCss}
                                        id={`btn-edit-${rowData.id}`}
                                        title={`View ${ButtonMsgLable}`}
                                        onClick={() => {
                                            const btnid = `btn-view-${rowData.id}`
                                            editHandler(rowData, mode.view, btnid)
                                        }}
                                    >
                                        <i className="bx bxs-show font-size-18 "></i>
                                    </Button>

                                    : null  // **else null

                    }


                    {
                        (userAccState.RoleAccess_IsDelete)
                            ?
                            <Button
                                type="button"
                                className={deltBtnCss}
                                id={`btn-delete-${rowData.id}`}
                                title={`Delete ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnid = `btn-delete-${rowData.id}`
                                    deleteHandler(rowData, btnid)
                                }}
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
                                    id={`btn-delete-${rowData.id}`}
                                    title={`Delete ${ButtonMsgLable}`}
                                    onClick={() => {
                                        const btnid = `btn-delete-${rowData.id}`
                                        deleteHandler(rowData, btnid)
                                    }}
                                >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                                : null
                    }
                    {
                        ((userAccState.RoleAccess_IsSave) && (userAccState.RoleAccess_IsCopy)) ?
                            <Button
                                type="button"
                                id={`btn-delete-${rowData.id}`}
                                className={editSelfBtnCss}
                                title={`Copy ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnid = `btn-delete-${rowData.id}`
                                    copyHandler(rowData, mode.copy, btnid)
                                }}
                            >
                                <i className="bx bxs-copy font-size-18 "></i>
                            </Button>
                            : null
                    }
                    {
                        ((userAccState.RoleAccess_IsPrint)) ?
                            <Button
                                type="button"
                                id={`btn-dounload-${rowData.id}`}
                                className={downBtnCss}
                                title={`Download ${ButtonMsgLable}`}
                                onClick={() => {
                                    const btnid = `btn-dounload-${rowData.id}`
                                    downHandler(rowData, btnid)
                                }}
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

                </div >
            )
        }
    });

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
        CustomAlert({
            Type: 1,
            Message: response.Message,
            AfterResponseAction: afterResponseAction,
        });
    } else if (response.Status === true) {
        dispatch(resetAction({ Status: false }))
        CustomAlert({
            Type: 3,
            Message: response.Message,
        });
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

const currentDatefunc = () => {  //+++++++++++++++ Cuurnt Date++++++++++++++++++++++++++++++++++++
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

export const loginUserDetails = () => {//+++++++++++++++++++++ Seesion Company Id+++++++++++++++++++++++++++++
    let user_Details = null
    try {
        user_Details = JSON.parse(localStorage.getItem('roleId'))
    } catch (e) { alert("Common user_Details  Error") }
    return user_Details
}

export const loginRoleID = () => {//+++++++++++++++++++++ Seesion Company Id+++++++++++++++++++++++++++++
    try {
        const detail = JSON.parse(localStorage.getItem('roleId'))
        return detail.Role
    } catch (e) { alert("Common Role ID  Error") }
    return null
}

export const loginUserID = () => {//++++++++++++++++++++++ Seesion User Id+++++++++++++++++++++++++++++
    let created_By = 0
    try {
        created_By = JSON.parse(localStorage.getItem('userId'))
    } catch (e) { alert("Common Created By Error") }
    return created_By
}

export const loginCompanyID = () => {//+++++++++++++++++++++ Seesion Company Id+++++++++++++++++++++++++++++
    let user_Company = 0
    try {
        user_Company = JSON.parse(localStorage.getItem('Company'))
    } catch (e) { alert("Common loginCompanyID  Error") }
    return user_Company
}

export const loginPartyID = () => {//+++++++++++++++++++++ Seesion loginPartyID Id+++++++++++++++++++++++++++++++
    let user_Party = 0
    try {
        user_Party = JSON.parse(localStorage.getItem("roleId")).Party_id
    } catch (e) { alert("Common loginPartyID Func  Error") }
    return user_Party
}

export const loginEmployeeID = () => {//+++++++++++++++++++++ Seesion loginPartyID Id+++++++++++++++++++++++++++++++
    let user_EmployeeID = 0
    try {
        user_EmployeeID = JSON.parse(localStorage.getItem("roleId")).Employee_id
    } catch (e) { alert("Common loginEmployeeID Func  Error") }
    return user_EmployeeID
}

export const loginIsSCMCompany = () => {//+++++++++++++++++++++ Seesion loginPartyID Id+++++++++++++++++++++++++++++++
    let IsSCMCompany = 0
    try {
        IsSCMCompany = JSON.parse(localStorage.getItem("IsSCMCompany"))
    } catch (e) { alert("Common loginEmployeeID Func  Error") }
    return IsSCMCompany
}

export const loginJsonBody = () => ({
    UserID: loginUserID(),
    RoleID: loginRoleID(),
    CompanyID: loginCompanyID(),
    PartyID: loginPartyID()
})

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

export function concatDateAndTime(date, time) { //+++++++++++time and date concate +++++++++++++++++++++++++++++++
    const d = convertDatefunc(date)
    const t = convertTimefunc(time)
    return (`${d} ${t}`)
}

export function convertDatefunc(inputDate) {// +++++++++++Convert Date Format+++++++++++++++++++++++++++++++
    const date = new Date(inputDate);
    let month = date.getMonth() + 1;

    let convDate = `${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`}-${month < 10 ? `0${month}`
        : `${month}`}-${date.getFullYear()}`;
    return convDate
}

export function saveDissable({ id = '', state = false }) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++
    try {
        const btn = document.getElementById(id);
        btn.disabled = state;

        if (state) {
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
        } else {
            btn.innerHTML = `<span> Save</span>`
            // btn.text = "save"
        }
    } catch (e) {
        // alert("Go btn dissable  error") 
    }
}
export function mainSppinerOnOff(state = false) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++
    try {
        // document.getElementById("overlay").style.display = state ? "block" : "none";
        document.getElementById("preloader").style.display = state ? "block" : "none";
    } catch (e) { alert("button sppiner error") }
    // try {
    //     document.getElementById(`${id}`).disabled = state;
    // } catch (e) {
    //     // alert("Go btn dissable  error") 
    // }
}

export function GoBtnDissable({ id = '', state = false }) {//+++++++++++++++++++++ Save Button Dissable/Enable +++++++++++++++++++++++++++++++

    try {
        const btn = document.getElementById(id);
        btn.disabled = state;

        if (state) {
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
        } else {
            btn.innerHTML = `<span> Go</span>`
            btn.text = "Go"
        }
    } catch (e) {
        // alert("Go btn dissable  error") 
    }
}


export function breadcrumbReturn({ dispatch, userAcc, newBtnPath = '' }) {
    const isnewBtnView = ((userAcc.PageType === 2) && (userAcc.RoleAccess_IsSave));
    const isCountLabel = (userAcc.CountLabel);
    const isexcelBtnView = ((userAcc.PageType === 2) && (userAcc.RoleAccess_Exceldownload));
    dispatch(CommonBreadcrumbDetails({
        newBtnPath: newBtnPath,
        newBtnView: isnewBtnView,
        excelBtnView: isexcelBtnView,
        pageHeading: userAcc.PageHeading,
        CountLabel: isCountLabel,
    }))
}

export function CommonConsole(error) {
    console.log(error);
}


export function btnIsDissablefunc({ btnId, state = false }) {

    if (btnId) {
        try {
            document.getElementById("overlay").style.display = state ? "block" : "none";
            document.getElementById(btnId).disabled = state;

            // const loginBtn = document.getElementById(event.target);
            document.getElementById("preloader").style.display = state ? "block" : "none";

            // if (state) {
            //     loginBtn.classList.add("loading");
            // }
            // else {
            //     loginBtn.classList.remove("loading")
            // }
            // // Hide loader after success/failure - here it will hide after 2seconds
            // // setTimeout(() => event.classList.remove("loading"), 3000);

        } catch (error) { CommonConsole(error) }
    }
}

export async function CheckAPIResponse({ method, url, response, body, btnId }) {

    if (btnId) {
        await new Promise(r => setTimeout(r, 2000));
    }

    const { data = '' } = response
    const con1 = ((data.StatusCode === 200));
    const con2 = ((data.StatusCode === 204));
    const con3 = ((data.StatusCode === 226));

    const con4 = ((data.StatusCode === 400));

    const con5 = ((data.StatusCode === 406));
    const con6 = ((method === "post" || method === "put"))
    const con7 = ((data.StatusCode === 100));

    btnIsDissablefunc({ btnId, state: false })

    if (con6) {
        console.log(`${url}***=> ${method} Body =>`, body)
    }
    // **********************************************************************************
    if (con1 || con7) {
        console.log(`${url}***${method} apiCall response:=>`, response.data)
        return response.data
    }

    else if (con2) {
        console.log(`${url}***${method} apiCall response:=>`, response.data)
        return response.data
    }

    else if (con3) {
        console.log(`${url}***${method} apiCall response:=>`, response.data)
        await CustomAlert({ Type: 3, Message: JSON.stringify(response.data.Message) })
        return Promise.reject(response)
    }

    else if (con4) {
        console.log(`${url}***${method} apiCall response:=>`, response.data)
        await CustomAlert({ Type: 2, Message: `${url}:This API ${method} Method Exception Error` })
        return Promise.reject(response)
    }

    else if (con5) {
        console.log(`${url}***${method} apiCall response:=>`, response.data)
        await CustomAlert({ Type: 3, Message: JSON.stringify(data.Message) })
        return Promise.reject(response)
    }

    else {
        console.log(`${url}***${method} apiCall response:=>`, response)
        await CustomAlert({ Type: 2, Message: `${url}:This API ${method} Method Execution Error` })
        return Promise.reject(response)
    }
}