import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';


function ExtraTableWrapper({ data, children }) {

    const [modifiyRowKeys, setModifiyRowKeys] = useState([]);


    const { radioButtonNonDelete, radioButtonDelete } = useSelector(state => ({
        radioButtonNonDelete: state.BreadcrumbReducer.radioButtonNonDelete,
        radioButtonDelete: state.BreadcrumbReducer.radioButtonDelete,
    }))

    //  code for deleted, nondeleted and both  Record   ///
    useEffect(() => {

        const IsDeleted = data.filter(item => item.IsRecordDeleted === true)
        const IsNonDeleted = data.filter(item => item.IsRecordDeleted !== true)

        if ((radioButtonNonDelete) && (radioButtonDelete)) {
            setModifiyRowKeys(data);

        } else {
            if ((radioButtonNonDelete)) {
                setModifiyRowKeys(IsNonDeleted);

            } else if ((radioButtonDelete)) {
                setModifiyRowKeys(IsDeleted);
            }
        }

    }, [radioButtonNonDelete, radioButtonDelete, data])

    
    return <> {children(modifiyRowKeys)}</>
}

export default ExtraTableWrapper
