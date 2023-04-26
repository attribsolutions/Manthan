import { CommonConsole } from "./CommonFunction";

export const formValid = ({ isError, required, hasValid, fieldLabel, values }, setState) => {
    let isValid = true;

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

    let isError = { ...state.isError };
    let hasValid = { ...state.hasValid };
    let required = { ...state.required };
    let fieldLabel = { ...state.fieldLabel };
    let values = { ...state.values };

    if (!(event.target === undefined)) {
        event.preventDefault();
        const { name, value, type, checked } = event.target;
        switch (type) {
            case "text": {
                const regExp = RegExp(hasValid[name].regExp)
                if (regExp.test(value)) {
                    isError[name] = "";
                    hasValid[name].valid = true
                }
                else {
                    isError[name] = hasValid[name].inValidMsg;
                    hasValid[name].valid = false
                }
                values[name] = value;
            }
                break;
            case "checkbox":

                if (!(required[name] === undefined)) {
                    if (checked) {
                        isError[name] = "";
                        hasValid[name].valid = true
                        values[name] = checked
                    }
                    else {
                        isError[name] = hasValid[name].inValidMsg;
                        hasValid[name].valid = true
                        values[name] = checked
                    }
                }
                else {
                    isError[name] = "";
                    hasValid[name].valid = true
                    values[name] = checked
                }
                break;

            case "password": {
                const regExp = RegExp(hasValid[name].regExp)
                if (regExp.test(value)) {
                    isError[name] = "";
                    hasValid[name].valid = true
                }
                else {
                    isError[name] = hasValid[name].inValidMsg;
                    hasValid[name].valid = false
                }
                values[name] = value;
            }
                break;

            default:
                break;
        }

        setState({ isError, hasValid, required, fieldLabel, values })
    }
    else {
        const { name, value, } = event.change
        const { type } = event


        switch (type) {
            case "select":
                debugger
                const result = Array.isArray(value);
                if (!result) {
                    if (!(value.value === undefined)) {
                        if (!(required[name] === undefined && value.value > 0)) {
                            isError[name] = "";
                            hasValid[name].valid = true
                        }
                        else if ((required[name] === undefined)) {
                            isError[name] = "";
                            hasValid[name].valid = true
                        }
                        else {
                            isError[name] = hasValid[name].inValidMsg;
                            hasValid[name].valid = false
                        }
                    }
                    else {
                        isError[name] = hasValid[name].inValidMsg;
                        hasValid[name].valid = false
                    }
                }
                else {
                    if (!(required[name] === undefined) && (value.length > 0)) {
                        isError[name] = "";
                        hasValid[name].valid = true
                    }
                    else {
                        isError[name] = hasValid[name].inValidMsg;
                        hasValid[name].valid = false
                    }
                }
                values[name] = value
                break;

            case "date":
                isError[name] = "";
                hasValid[name].valid = true
                values[name] = value
                break;

            default:
                break;

        }
        setState({
            isError, hasValid, required, fieldLabel, values
        })
    }
};

export function comAddPageFieldFunc({ state, setState, fieldArr }) {
    var isState = { ...state }
    const values = { ...state.values }
    try {
        fieldArr.forEach(ele => {
            Object.keys(values).some(lab => {
                if (lab === ele.ControlID) {
                    isState.fieldLabel[lab] = ele.FieldLabel;
                    isState.hasValid[lab].regExp = ele.RegularExpression;
                    isState.hasValid[lab].inValidMsg = ele.InValidMsg;
                    if (ele.IsCompulsory) {
                        isState.required[lab] = true
                    }
                    return true
                };

            });
        });

        setState(isState)
    } catch (e) { CommonConsole(e) }
}

export function defaultSetValidAll({ state, setState, fieldArr }) {
    Object.keys(state.values).some(lab => {
        state.hasValid[lab] = true
    });
    return
}

export const onChangeSelect = ({ hasSelect, evn, state, setState }) => {

    const event = { change: { name: evn.name, value: hasSelect }, type: "select" }
    formValChange({ event, state, setState })
}

export const onChangeDate = ({ v, e, state, setState }) => {
    const event = { change: { name: e.input.name, value: v }, type: "date" }
    formValChange({ event, state, setState })
}

export const onChangeText = ({ event, state, setState }) => {
    formValChange({ event, state, setState })
}

export const initialFiledFunc = (field) => {

    const obj = {}
    obj["values"] = field;
    obj["fieldLabel"] = {}
    obj["isError"] = {}
    obj["hasValid"] = {}
    obj["required"] = {}

    Object.keys(field).forEach(label => {

        obj.fieldLabel[label] = ''
        obj.isError[label] = ''
        obj.hasValid[label] = {}
        obj.hasValid[label]["regExp"] = ""
        obj.hasValid[label]["inValidMsg"] = ""
        obj.hasValid[label]["valid"] = false;

    })
    return obj
}


export const resetFunction = (field, state) => {

    var preState = { ...state }
    preState.values = field
    Object.keys(field).forEach(label => {
        preState.hasValid[label]["valid"] = false
    })
    return preState
}