

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { edit_PageListID_Action, edit_PageListID_Success } from "../../../store/actions";
import { mode, url } from "../../../routes";
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
    const [pageTypeValue, setPageTypeValue] = useState(null);
    const [listAndMasterPageName, setListAndMasterPageName] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    const {
        bredcrumbItemName = '',
        newBtnView = true,
        pageHeading = '',
        newBtnPath,
        userAcc,
        pageMode,
        editData,
        pageField
    } = useSelector(({ BreadcrumbReducer, H_Pages }) => ({
        ...BreadcrumbReducer.breadcrumbDetail,
        editData: H_Pages.editData,
    }));

    useEffect(() => {

        if (pageField) {
            setListAndMasterPageName([
                { value: 1, label: pageField.RelatedPageName },
                { value: 2, label: pageField.Name },
            ])
        }
    }, [pageField]);

    useEffect(() => {

        if (userAcc) {
            setPageTypeValue(userAcc.PageType);
            setListPagePath(userAcc.ActualPagePath);
        }
    }, [userAcc]);

    useEffect(() => {

        if (editData.Status === true) {
            dispatch(edit_PageListID_Success({ ...editData, Status: false }));
            history.push({
                pathname: url.PAGE,  // The target URL
                editValue: editData.Data,
                pageMode: mode.edit,
                actualPagePath: listPagePath  // when redirect to page master and update then listPagePath is use
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
        if (userName === "Attrib") {
            if (pageType === "add") {
                dispatch(edit_PageListID_Action({ editId: userAcc?.RelatedPageID }))
            }
            else {
                dispatch(edit_PageListID_Action({ editId: userAcc?.id }))
            }
        }
    }

    const toggle_pagetype = () => {
        if (userName === "Attrib" && pageTypeValue === 2) {
            setMenuOpen(!menuOpen)
        }
    }

    const PageHeadingNavigate = ({ pageHeading }) => {
        const headerLabelStyles = userName === "Attrib" ? { cursor: 'pointer' } : {}
        const headerLabelClass = userName === "Attrib" && "labelHover"

        if (pageTypeValue === 2) {
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
                                    {listAndMasterPageName[0]?.label}
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => NavigateHandler("list")}>
                                <div className="text-left">
                                    <i className='bx bx-list-ul align-middle me-1 text-primary'></i>
                                    {listAndMasterPageName[1]?.label}
                                </div>
                            </DropdownItem>
                        </DropdownMenu>

                    </Dropdown>
                </>)
        }
        else {
            return (
                <>
                    <Label className={`pt-3 pl-1 font-size-18 ${headerLabelClass}`}
                        onClick={() => NavigateHandler("list")}
                        style={{ ...headerLabelStyles, }}>{pageHeading}</Label>
                </>
            )
        }
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