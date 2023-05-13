import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal } from 'reactstrap'
import * as mode from "../../../routes/PageMode"
import * as url from "../../../routes/route_url";

const AddMaster = (props) => {

    const [isOpen, setIsOpen] = useState(false)
    let { bredcrumbItemName = '' } = useSelector((state) => ({
        bredcrumbItemName: state.BreadcrumbReducer.bredcrumbItemName,
    }));

    return (
        <>
            <div>
                <Button
                    className=" rounded_Add_Btn "
                    // style={{ borderRadius: "25px !important" }}
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
                    <header  style={{ zIndex: "1" }}  >
                                    <div>
                                        <label className="font-size-18  col-ls-6 col-form-label text-black" style={{ marginLeft: "6px" }}>
                                            {"pageHeading"}</label>
                                        {(bredcrumbItemName.length > 0) ?
                                            <label className="font-size-24 form-label  text-nowrap bd-highlight text-primary"
                                                style={{ paddingLeft: "7px", color: "#5156be" }} >&nbsp;/&nbsp;{bredcrumbItemName}</label>
                                            : null
                                        }
                                    </div>

                             
                    </header>
                    <div id="123456" style={{
                        marginBottom: "-126px",
                        marginTop: "-88px"
                    }}>

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