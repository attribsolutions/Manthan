import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Modal } from 'reactstrap'
import * as mode from "../../routes/PageMode"

const DropdownMaster = (props) => {
    const { modalShow, setModalShow, } = props

    const [pageHeading, setPageHeading] = useState('')
    const { bredcrumbItemName = '', userAccess = [] } = useSelector((state) => ({
        bredcrumbItemName: state.BreadcrumbReducer.bredcrumbItemName,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {
        let pagefond = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === props.masterPath)
        });
        if (!(pagefond === undefined)) {
            setPageHeading(pagefond.PageHeading)
        }

    }, [userAccess, props]);

    if (!modalShow) {
        return null
    }
    return (
        <>
            <div>
                <Modal
                    isOpen={modalShow}
                    toggle={() => {
                        setModalShow(false)
                    }}
                    size="xl"
                >
                    <header style={{ "zIndex": "1", "paddingTop": "9px", "marginBottom": "-8px" }}  >
                        <div>
                            <label className="font-size-18  col-ls-6 col-form-label text-black" style={{ marginLeft: "6px" }}>
                                {pageHeading}</label>
                            {(bredcrumbItemName.length > 0) ?
                                <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary"
                                    style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbItemName}</label>
                                : null
                            }
                        </div>
                    </header>
                    <div style={{ marginTop: "10px" }}>

                        <props.masterModal
                            masterPath={props.masterPath}
                            isOpenModal={setModalShow}
                            isdropdown={true}
                            pageMode={mode.dropdownAdd}
                        />
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default DropdownMaster