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


    export function comAddPageFieldFunc({ state, setState, pageFiled }) {
        var isState = { ...state }
        const values = { ...state.values }
        debugger
        pageFiled.forEach(ele => {
            debugger
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

   