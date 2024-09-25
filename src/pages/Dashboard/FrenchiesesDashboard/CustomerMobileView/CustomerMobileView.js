import React from 'react'
import cbm_logo from "../../../../assets/images/cbm_logo.png"
import { Card, Input } from 'reactstrap'
import CustomermobileViewBackground from './CustomermobileViewBackground';
import { useParams } from 'react-router-dom';
const CustomerMobileView = () => {
    const { Mac_ID } = useParams();
    debugger
    return (
        <div>
            <CustomermobileViewBackground Mac_ID={Mac_ID} />
        </div>

    );


}

export default CustomerMobileView