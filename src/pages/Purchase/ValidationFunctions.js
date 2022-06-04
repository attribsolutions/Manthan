
export const Custom_ValidationFun = (event) => {
    let Return = ''

    if ((event.value !== "") && (event.name === "text")) Return = true
    else if ((event.name === "textNum")) {

        const NumberValidation = /^\d+((.\d+))?(,\d+((.\d+))?)*$/;
        if (NumberValidation.test(event.value)) Return = true
        else Return = false
    }
    else if (event.type === "email") {

        const EmailValidation = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if ((EmailValidation.test(event.value))) Return = true
        else Return = false
    }
    else Return = false
    return Return
}