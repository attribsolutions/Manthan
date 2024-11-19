// RadioButtonGroup.js

import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BreadcrumbDeleteButton, BreadcrumbNonDeleteButton } from "../../../store/actions";

const DeletedOrNonDeletedButton = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const {
        IsRadioButtonView,
        radioButtonNonDelete,
        radioButtonDelete,
    } = useSelector((state) => state.BreadcrumbReducer);

    useEffect(() => {
        return () => {
            dispatch(BreadcrumbNonDeleteButton(true));
            dispatch(BreadcrumbDeleteButton(false));
        }
    }, [history.location.pathname]);

    const onChangeDelete = (event) => {
        let CheckedValue = event.target.checked
        if (!CheckedValue && !radioButtonNonDelete) {
            event.target.checked = true
            return;
        }
        dispatch(BreadcrumbDeleteButton(CheckedValue))
    }
    const onChangeNonDelete = (event) => {
        let CheckedValue = event.target.checked
        if (!CheckedValue && !radioButtonDelete) {
            event.target.checked = true
            return;
        }
        dispatch(BreadcrumbNonDeleteButton(CheckedValue))
    }
    if (!IsRadioButtonView) return null// page wise condition show or not

    return (
        <div>
            <div className="btn-group mt-2" role="group" aria-label="Basic checkbox toggle button group">

                <input
                    type="checkbox"
                    id={"btncheckNonDeleted"}
                    className="btn-check"
                    autoComplete="off"
                    checked={radioButtonNonDelete}
                    onChange={onChangeNonDelete}
                />
                <label className="btn btn-outline-secondary" htmlFor={"btncheckNonDeleted"}>NonDeleted</label>

                <input
                    type="checkbox"
                    className="btn-check"
                    id={"btncheckDeleted"}
                    autoComplete="off"
                    checked={radioButtonDelete}
                    onChange={onChangeDelete}
                />
                <label className="btn btn-outline-secondary" htmlFor={"btncheckDeleted"}>Deleted</label>

            </div>
        </div>
    );
};

export default React.memo(DeletedOrNonDeletedButton);
