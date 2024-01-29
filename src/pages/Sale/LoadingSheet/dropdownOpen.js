import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal } from 'reactstrap'
import * as mode from "../../../routes/PageMode"
import DriverMaster from '../../Adminisrator/DriverPage/DriverMaster';

const DropdownMaster = (props) => {
    debugger
    const { modal_scroll, setmodal_scroll, masterModal, masterPath } = props;
    const [isOpen, setIsOpen] = useState(false);
    function tog_scroll() {
        setmodal_scroll(!modal_scroll);
        removeBodyCss();
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }
    // useEffect(() => {
    //     if (props.location)
    // }, [props.location]);

    return (
        <>
            <div>
                <Modal
                    isOpen={modal_scroll}
                    toggle={() => {
                        tog_scroll();
                    }}
                    scrollable={true}
                    size="xl"
                >
                    {/* <div className="modal-header" style={{ backgroundColor: '#cce6f6' }}> */}
                    <props.masterModal
                        masterPath={masterPath}
                        isOpenModal={setIsOpen}
                        isdropdown={true}
                        pageMode={mode.dropdownAdd}
                    />
                    {/* </div> */}
                </Modal>
            </div>
        </>
    )
}

export default DropdownMaster