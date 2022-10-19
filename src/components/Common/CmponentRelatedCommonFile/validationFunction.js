export const formValid = ({ isError, required, hasValid, fieldLabel, values }, setState) => {
debugger
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
            case "text":
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

            default:
                break;
        }

        setState({ isError, hasValid, required, fieldLabel, values })
    }
    else {
        const { name, value, } = event.change
        const { type } = event

        debugger
        switch (type) {
            case "select":
                const result = Array.isArray(value);
                if (!result) {
                    if (!(value.value === undefined)) {
                        if (!(required[name] === undefined && value.value > 0)) {
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
    // debugger
    fieldArr.forEach(ele => {
        // debugger
        Object.keys(values).forEach(lab => {
            if (lab === ele.ControlID) {
                isState.fieldLabel[lab] = ele.FieldLabel
                isState.hasValid[lab].regExp = ele.RegularExpression
                isState.hasValid[lab].inValidMsg = ele.InValidMsg
                if (ele.IsCompulsory) {
                    isState.required[lab] = true
                }
            }
        });
    });

    setState(isState)

}



export const onChangeSelect = ({ e, v, state, setState }) => {
    const event = { change: { name: e.name, value: v }, type: "select" }
    formValChange({ event, state, setState })
}

export const onChangeDate = ({ v, e, state, setState }) => {
    const event = { change: { name: e.input.name, value: v }, type: "date" }
    formValChange({ event, state, setState })
}
export const onChangeText = ({ event, state, setState }) => {
    formValChange({ event, state, setState })
}
