import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal } from 'reactstrap'
import * as mode from "../../../routes/PageMode"

const AddMaster = (props) => {

    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <>
            <div>
                <Button
                    className=" rounded_Add_Btn "
                    color="btn btn-outline-primary border-2 font-size-12"
                    type="button"
                    onClick={() => { setIsOpen(true) }}
                >  <i className="dripicons-plus align-center"></i>
                </Button>

                <Modal
                    isOpen={isOpen}
                    toggle={() => {
                        setIsOpen(false)
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
                    {/* <div style={{ margin: "-102px  -12px -136px" }}> */}
                    <div>
                        <props.masterModal
                            masterPath={props.masterPath}
                            isOpenModal={setIsOpen}
                            isdropdown={true}
                            pageMode={mode.dropdownAdd}
                        />
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default AddMaster