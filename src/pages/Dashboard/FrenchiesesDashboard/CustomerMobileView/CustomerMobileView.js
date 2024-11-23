import React from 'react'
import cbm_logo from "../../../../assets/images/cbm_logo.png"
import { Card, Input } from 'reactstrap'
import { useParams } from 'react-router-dom';
import { CustomermobileViewBackground } from './CustomermobileViewBackground';
const CustomerMobileView = () => {
    const { Mac_ID } = useParams();
    
    return (
        <div>
            <CustomermobileViewBackground Details={Mac_ID} />
        </div>

    );


}

export default CustomerMobileView