import React, { useState } from 'react'
import { Button, Modal } from 'reactstrap'
import * as mode from "../../../routes/PageMode"
import * as url from "../../../routes/route_url";

const AddMaster = (props) => {

    const [isOpen, setIsOpen] = useState(false)

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
                    <props.masterModal
                        masterPath={props.masterPath}
                        isOpenModal={setIsOpen}
                        isdropdown={true}
                        pageMode={mode.dropdownAdd}
                    />
                </Modal>
            </div>
        </>
    )
}

export default AddMaster