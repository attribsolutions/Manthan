

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { edit_PageListID_Action, edit_PageListID_Success } from "../../../store/actions";
import { url } from "../../../routes";
import { loginUserName } from "../../Common/CommonFunction";
import { useState } from "react";

const HeaderTitleNewBtn = ({
    hederTextColor = "black"
}) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const userName = loginUserName();

    const [listPagePath, setListPagePath] = useState("");
    const [relatedPageId, setRelatedPageId] = useState(0);
    const {
        bredcrumbItemName = '',
        newBtnView = true,
        pageHeading = '',
        newBtnPath,
        userAcc,
        pageMode,
        editData,
    } = useSelector(({ BreadcrumbReducer, H_Pages }) => ({
        ...BreadcrumbReducer.breadcrumbDetail,
        editData: H_Pages.editData,
    }));

    useEffect(() => {

        if (userAcc) {
            if ((userAcc.PageType === 1) || (userAcc.PageType === 3)) {
                setRelatedPageId(userAcc.id);
            }
            else {
                setRelatedPageId(userAcc.RelatedPageID);
            }
            setListPagePath(userAcc.ActualPagePath)
        }
    }, [userAcc]);

    useEffect(() => {

        if (editData.Status === true) {
            dispatch(edit_PageListID_Success({ ...editData, Status: false }));
            history.push({
                pathname: url.PAGE,  // The target URL
                editValue: editData.Data,
                pageMode: "edit",
                actualPagePath: listPagePath
            });
        }
    }, [editData]);

    const NewButtonHandeller = () => {
        history.push({
            pathname: newBtnPath,
            pageMode: pageMode
        })
    }

    function NavigateHandler() {
        if (userName === "Attrib") {
            dispatch(edit_PageListID_Action({ editId: relatedPageId, }))
        }
    }

    if (newBtnView) {
        return (
            <div>
                <button
                    type="button"
                    className="btn btn-success"
                    style={{ padding: "2px", paddingInline: "5px", color: "white" }}
                    data-mdb-toggle="tooltip"
                    data-mdb-placement="top"
                    title="Create New"
                    onClick={NewButtonHandeller}
                >
                    New
                </button>
                <label
                    onClick={NavigateHandler}
                    className={userName === "Attrib" ? "font-size-18 col-ls-6 col-form-label labelHover" : "font-size-18 col-ls-6 col-form-label text-black"}
                    style={{ paddingLeft: "7px", cursor: userName === "Attrib" ? 'pointer' : 'default', }}>
                    {pageHeading}
                </label>
            </div>
        );
    } else {
        return (
            <div onClick={NavigateHandler}>
                <label className={userName === "Attrib" ? "font-size-18 col-ls-6 col-form-label labelHover" : "font-size-18 col-ls-6 col-form-label text-black"}
                    style={{ marginLeft: "6px", cursor: userName === "Attrib" ? 'pointer' : 'default', }}>
                    {pageHeading}
                </label>
                {bredcrumbItemName.length > 0 && (
                    <label
                        className="font-size-21 form-label text-nowrap bd-highlight text-primary"
                        style={{ paddingLeft: "7px", color: "#5156be" }}
                    >
                        &nbsp;/&nbsp;{bredcrumbItemName}
                    </label>
                )}
            </div>
        );
    }
};

export default React.memo(HeaderTitleNewBtn);
