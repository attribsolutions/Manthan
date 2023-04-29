import React, { useState } from 'react'
import { Button, Modal } from 'reactstrap'
import * as mode from "../../../routes/PageMode"
import * as url from "../../../routes/route_url";

const AddMaster = (props) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>

            <Button
                className=" button_add"
                color="btn btn-outline-primary border-2 font-size-12"
                type="button"
                onClick={() => { setIsOpen(true) }}
            >  <i className="dripicons-plus"></i>
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
        </>
    )
}

export default AddMaster