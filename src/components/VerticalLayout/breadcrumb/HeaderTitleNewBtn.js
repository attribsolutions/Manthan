

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
    const [relatedPageId, setRelatedPageId] = useState(0);
    const [pageTypeSelect, setPageTypeSelect] = useState(null);
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
        if (userAcc) {
            setListPagePath(userAcc.ActualPagePath)
            if (pageTypeSelect === 'add') {
                NavigateHandler(userAcc.RelatedPageID)
            }
            else if (pageTypeSelect === 'list') {
                NavigateHandler(userAcc.id)
            }
            else {
                setRelatedPageId(userAcc.id);
            }
        }
    }, [userAcc, pageTypeSelect]);

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

    function NavigateHandler(id) {
        debugger
        if (userName === "Attrib") {
            dispatch(edit_PageListID_Action({ editId: id, }))
        }
    }

    const handleClose = (pageType) => {
        setMenuOpen(false);
        setPageTypeSelect(pageType);
    };

    if (newBtnView) {
        return (
            <>
                <div className="fade-menu-container">
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

                    <Dropdown
                        isOpen={menuOpen}
                        toggle={() => setMenuOpen(!menuOpen)}
                        className="d-inline-block"
                    >
                        <DropdownToggle tag="label"                        >
                            <Label className="pt-3 pl-1 font-size-18 ">{pageHeading}</Label>
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem onClick={() => handleClose("add")}>
                                <div className="text-left">
                                    <i className='bx bxs-add-to-queue align-middle me-1 text-primary' ></i>
                                    Add Page
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => handleClose("list")}>
                                <div className="text-left">
                                    <i className='bx bx-list-ul align-middle me-1 text-primary'></i>
                                    List Page
                                </div>
                            </DropdownItem>
                        </DropdownMenu>

                    </Dropdown>
                </div>
            </>
        );
    } else {
        return (
            <div onClick={() => { NavigateHandler(relatedPageId) }}>
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
