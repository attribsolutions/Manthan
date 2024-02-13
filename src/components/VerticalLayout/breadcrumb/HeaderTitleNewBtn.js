

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { edit_PageListID_Action, edit_PageListID_Success } from "../../../store/actions";
import { url } from "../../../routes";
import { loginUserName } from "../../Common/CommonFunction";
import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label } from "reactstrap";

const HeaderTitleNewBtn = ({
    hederTextColor = "black"
}) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const userName = loginUserName();

    const [listPagePath, setListPagePath] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);

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

    function NavigateHandler(pageType) {

        if (pageType === "add") {
            dispatch(edit_PageListID_Action({ editId: userAcc?.RelatedPageID, }))
            setListPagePath()
        }
        else {
            dispatch(edit_PageListID_Action({ editId: userAcc?.id, }))
        }
        setListPagePath(userAcc.ActualPagePath)
    }

    const toggle_pagetype = () => {
        if (userName === "Attrib") {
            setMenuOpen(!menuOpen)
        }

    }

    const PageHeadingNavigate = ({ pageHeading }) => {
        const headerLabelStyles = userName === "Attrib" ? { cursor: 'pointer' } : {}
        const headerLabelClass = userName === "Attrib" && "labelHover"

        return (
            <>
                <Dropdown
                    isOpen={menuOpen}
                    toggle={toggle_pagetype}
                    className="d-inline-block"
                >
                    <DropdownToggle tag="label">
                        <Label className={`pt-3 pl-1 font-size-18 ${headerLabelClass}`}
                            style={{ ...headerLabelStyles, }}>{pageHeading}</Label>
                    </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem onClick={() => NavigateHandler("add")}>
                            <div className="text-left">
                                <i className='bx bxs-add-to-queue align-middle me-1 text-primary' ></i>
                                Add Page
                            </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => NavigateHandler("list")}>
                            <div className="text-left">
                                <i className='bx bx-list-ul align-middle me-1 text-primary'></i>
                                List Page
                            </div>
                        </DropdownItem>
                    </DropdownMenu>

                </Dropdown>

            </>)
    };

    const RenderNewButtonView = () => newBtnView && (
        <button
            type="button"
            className="btn btn-success"
            data-mdb-toggle="tooltip"
            data-mdb-placement="top"
            title="Create New"
            onClick={NewButtonHandeller}
        >
            New
        </button>
    );

    return (
        <div>
            <RenderNewButtonView />
            <PageHeadingNavigate pageHeading={pageHeading} />
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

};

export default React.memo(HeaderTitleNewBtn);


