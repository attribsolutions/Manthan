export const formValid = ({ isError, required, hasValid, fieldLabel, values }, setState) => {

    let isValid = true;
    //     Object.values(isError).forEach(val => {
    //         if ((val.length > 0)) {
    //             isValid = false
    //         } else {
    //             isValid = true
    //         }
    //     });

    Object.keys(required).forEach((lab) => {

        if (!(hasValid[lab].valid)) {
            isError[lab] = hasValid[lab].inValidMsg
            isValid = false
            setState({ isError, hasValid, required, fieldLabel, values })
        }
    });
    return isValid
};


export const formValChange = ({ event, state, setState }) => {
    debugger
    let isError = { ...state.isError };
    let hasValid = { ...state.hasValid };
    let required = { ...state.required };
    let fieldLabel = { ...state.fieldLabel };
    let values = { ...state.values };

    if (!(event.target === undefined)) {
        event.preventDefault();
        const { name, value, type } = event.target;

        const regExp = RegExp(hasValid[name].regExp)
        if (regExp.test(value)) {
            isError[name] = "";
            hasValid[name].valid = true
        }
        else {
            isError[name] = hasValid[name].inValidMsg;
            hasValid[name].valid = false
        }
        values[name] = value
        setState({ isError, hasValid, required, fieldLabel, values })
    }
    else {
        const { name, value } = event
        values[name] = value
        isError[name] =''
        hasValid[name].valid = true
        setState({
            isError, hasValid, required, fieldLabel, values
        })
    }
};


    export function comAddPageFieldFunc({ state, setState, fieldData }) {
        var isState = { ...state }
        // isState['fieldLabel'] = {}
        // isState['isError'] = {}
        // isState['hasValid'] = {}
        // isState['required'] = {}

        const values = { ...state.values }

        fieldData.forEach(ele => {
            debugger
            Object.keys(values).forEach(lab => {
                if (lab === ele.controlId) {
                    // isState['hasValid'] = {
                    //     [lab]: {
                    //         regExp: ele.regExp,
                    //         inValidMsg: ele.fieldLabel,
                    //         valid: false
                    //     }
                    // }
                    isState.fieldLabel[lab] = ele.fieldLabel
                    isState.hasValid[lab].regExp = ele.regExp
                    isState.hasValid[lab].inValidMsg = ele.inValidMsg
                    if (ele.isCompulsory) {
                        isState.required[lab] = true
                    }
                }
            });
        });

        setState(isState)

    }

    export const fieldData = [
        {
            controlId: 'name',
            ControlType: 2,
            ControlTypeName: "Dropdown",
            fieldLabel: "Driver Name ",
            isCompulsory: true,
            defaultSort: true,
            showInListPage: true,
            showInDownload: true,
            downloadDefaultSelect: false,
            regExp: /^.{4,100}$/,
            inValidMsg: "Driver Name is invalid",
        },
        {
            controlId: 'address',
            ControlType: 2,
            ControlTypeName: "text",
            fieldLabel: "Address ",
            isCompulsory: true,
            defaultSort: true,
            showInListPage: true,
            showInDownload: true,
            downloadDefaultSelect: false,
            regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
            inValidMsg: "Address  is invalid",
        },

        {
            controlId: 'uid',
            ControlType: 2,
            ControlTypeName: "text",
            fieldLabel: "UID ",
            isCompulsory: true,
            defaultSort: true,
            showInListPage: true,
            showInDownload: true,
            downloadDefaultSelect: false,
            regExp: /^.{4,100}$/,
            inValidMsg: "UID  is invalid",
        },
        {
            controlId: 'party',
            controlType: 2,
            controltypeName: "select",
            fieldLabel: "Party ",
            isCompulsory: true,
            defaultSort: true,
            fieldValidation:4,
            fieldValidationName:"10 digit Number",
            showInListPage: true,
            showInDownload: true,
            downloadDefaultSelect: false,
            regExp: /^.{4,100}$/,
            inValidMsg: "Party is invalid",
        },

    ]



   

// const [state1, setState1] = useState(
//     {
//         value: {
//             name: '',
//             address: '',
//             uid: '',
//         },
//         fieldLabel: {
//             name: '',
//             address: '',
//             uid: '',
//         },
//         isError: {
//             name: '',
//             address: '',
//             uid: '',
//         },
//         hasValid: {
//             name: {
//                 regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
//                 inValidMsg: "Name  is invalid",
//             },
//             address: {
//                 regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
//                 inValidMsg: "Email address is invalid",
//             },

//             uid: {
//                 regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
//                 inValidMsg: "UID  is invalid",
//             },
//         },
//         required: {
//             name: true,
//             address: true,
//             uid: false,
//         }
//     }
// )