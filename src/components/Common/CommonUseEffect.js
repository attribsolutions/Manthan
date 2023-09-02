import { breadcrumbReturnFunc } from "./CommonFunction";
import { mode } from "../../routes/index";
import { comAddPageFieldFunc } from "./validationFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import $ from 'jquery';

export const userAccessUseEffect = ({ props,
    dispatch,
    userAccess = [],
    setUserAccState,
    otherloginAccss }) => {

    let hasShowModal = props.hasOwnProperty(mode.editValue)

    let locationPath;

    if ((props.pageMode === mode.dropdownAdd) || hasShowModal) {
        locationPath = props.masterPath;
    } else {
        locationPath = props.location.pathname;
    }

    userAccess.forEach((inx) => {
        if ((`/${inx.ActualPagePath}` === locationPath) && setUserAccState) {
            setUserAccState(inx);
            if (!props.isdropdown) {
                breadcrumbReturnFunc({ dispatch, userAcc: inx });
            }
        }
        if (otherloginAccss) { otherloginAccss(inx) }
    })
}

// ****************************************************************************************
// ****************************************************************************************

export const saveMsgUseEffect = async ({
    postMsg, postSuccss, pageMode, dispatch, history, status200, listPath, foreceRedirectList = false }) => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
        dispatch(postSuccss({ Status: false }))

        if (status200) { status200() };

        if (pageMode === mode.dropdownAdd) {
            customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
        }
        else {
            const a = await customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
            if ((a || foreceRedirectList === true)) {
                history.push({
                    pathname: listPath,
                });
            }
        }
    }
    else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {
        dispatch(postSuccss({ Status: false }))
        customAlert({
            Type: 4,
            Message: JSON.stringify(postMsg.Message),
        });
    }
}


// ****************************************************************************************
// ****************************************************************************************


export const updateMsgUseEffect = async ({
    updateMsg, updateSuccss, modalCss, dispatch, history, listPath, status200 }) => {

    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
        dispatch(updateSuccss({ Status: false }))

        if (status200) { status200() };

        await customAlert({
            Type: 1,
            Message: JSON.stringify(updateMsg.Message),
        })
        history.push({
            pathname: listPath,
        })
    } else if (updateMsg.Status === true && !modalCss) {
        dispatch(updateSuccss({ Status: false }));
        customAlert({
            Type: 3,
            Message: JSON.stringify(updateMsg.Message),
        })
    }
}

// ****************************************************************************************
// ****************************************************************************************


export const pageFieldUseEffect = ({ state, setState, pageField }) => {
    if (pageField) {
        const fieldArr = pageField.PageFieldMaster
        comAddPageFieldFunc({ state, setState, fieldArr })
    }
}

// ****************************************************************************************
// ***************************************************************************************

export const table_ArrowUseEffect = (tableId) => {

    // (function ($) {
    $.fn.enableCellNavigation = function () {

        var arrow = { left: 37, up: 38, right: 39, down: 40 };

        // select all on focus
        this.find('input').keydown(function (e) {

            // shortcut for key other than arrow keys
            if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) { return; }

            if (!($.inArray(e.which, [arrow.up, arrow.down]) < 0)) {
                let hasSelect = e.target.offsetParent.classList.contains("select2-selection__value-container");
                if (hasSelect) {
                    e.stopPropagation()
                }

            }
            var input = e.target;
            var td = $(e.target).closest('td');

            var moveTo = null;

            switch (e.which) {

                case arrow.left: {


                    if (input.selectionStart == 0) {
                        moveTo = td.prev('td:has(input,textarea)');


                        var tr = td.closest('tr');
                        var pos = td[0].cellIndex;
                        var ctd = tr.children('td')

                        let prevTd = td
                        let in_d = 0
                        while ((in_d < pos)) {

                            moveTo = prevTd.prev('td:has(input,textarea)');
                            if (moveTo.length > 0) { in_d = ctd.length - 1 }
                            prevTd = td.prev('td')
                            in_d++;
                        }

                    }
                    if (moveTo && moveTo.length) {

                        e.preventDefault();
                        var tdInput = moveTo.find('input,textarea')

                        if (tdInput.length > 0) {
                            tdInput[0].focus();
                            tdInput[0].select();
                        }
                    }

                    break;
                }
                case arrow.right: {
                    if (input.selectionEnd == input.value.length) {

                        var tr = td.closest('tr');
                        var pos = td[0].cellIndex;
                        var ctd = tr.children('td')

                        let nextTd = td

                        while (pos < ctd.length) {

                            moveTo = nextTd.next('td:has(input,textarea)');
                            if (moveTo.length > 0) { pos = ctd.length + 1 }
                            nextTd = td.next('td')
                            pos++;
                        }

                    }

                    if (moveTo && moveTo.length) {

                        e.preventDefault();
                        var tdInput = moveTo.find('input,textarea')

                        if (tdInput.length > 0) {
                            tdInput[0].focus();
                            tdInput[0].select();
                        }
                    }
                    break;
                }

                case arrow.up: {
                    var thisIndex = $(input).index('input:text');
                    var pre = thisIndex - 1;

                    var tdPreInput
                    td.find('input').each(function (i2, tdEle) {

                        var thisIndex = $(tdEle).index('input:text');
                        if (pre === thisIndex) {
                            tdPreInput = tdEle
                        }
                    });

                    if (tdPreInput) {
                        tdPreInput.focus()
                        return
                    }
                    var tr = td.closest('tr');
                    var pos = td[0].cellIndex;
                    var moveToRow = tr.prev('tr');


                    if (moveToRow.length) {
                        moveTo = $(moveToRow[0].cells[pos]);
                    }
                    if (moveTo && moveTo.length) {

                        e.preventDefault();
                        var tdInput = moveTo.find('input,textarea')

                        if (tdInput.length > 0) {
                            tdInput[tdInput.length - 1].focus();
                            tdInput[tdInput.length - 1].select();
                        }
                    }
                    break;
                }
                case arrow.down: {

                    var thisIndex = $(input).index('input:text');
                    var next = thisIndex + 1;

                    var tdNextInput
                    td.find('input').each(function (i2, tdEle) {

                        var thisIndex = $(tdEle).index('input:text');
                        if (next === thisIndex) {
                            tdNextInput = tdEle
                        }
                    });

                    if (tdNextInput) {
                        tdNextInput.focus()
                        return
                    }
                    var tr = td.closest('tr');
                    var pos = td[0].cellIndex;

                    var moveToRow = tr.next('tr');

                    if (moveToRow.length) {
                        moveTo = $(moveToRow[0].cells[pos]);
                    }
                    if (moveTo && moveTo.length) {

                        e.preventDefault();
                        var tdInput = moveTo.find('input,textarea')

                        if (tdInput.length > 0) {
                            tdInput[0].focus();
                            tdInput[0].select();
                        }
                    }
                    break;
                }
            }
        });

    };


    $(function () {
        $(tableId).enableCellNavigation();
    });


}

// ****************************************************************************************
// ***************************************************************************************