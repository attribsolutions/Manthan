import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BreadcrumbShowCountlabel, commonPageField } from "../../store/actions";
import * as _cfunc from "../../components/Common/CommonFunction";
import GlobalCustomTable from '../../GlobalCustomTable';
import { mode, pageId } from "../../routes/index"
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { Grn_Pending_Action, Grn_Pending_Action_Success } from '../../store/Report/GRNPendingReport/action';

const GRNPendingReport = (props) => {

    const [userPageAccessState, setUserAccState] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        pageField,
        userAccess,
        GRNpendingdata
    } =
        useSelector((state) => ({
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
            GRNpendingdata: state.grnpendingReducer.grnpendingData,
        })
        );

    const [tableColumns] = DynamicColumnHook({ pageField, })
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)
    useEffect(() => {

        dispatch(commonPageField(pageId.GRN_PENDING_REPORT))
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(Grn_Pending_Action());
        return () => {
            dispatch(Grn_Pending_Action_Success());
        }
    }, []);
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    return (
        <React.Fragment >

            <div>
                <GlobalCustomTable
                    keyField={"id"}
                    data={GRNpendingdata}
                    columns={tableColumns}
                    id="table_Arrow"
                    paginationEnabled={50}
                    noDataIndication={
                        <div className="text-danger text-center ">
                            Items Not available
                        </div>
                    }
                    onDataSizeChange={({ dataCount }) => {
                        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount}`));
                    }}
                />
            </div>
        </React.Fragment >
    )
}

export default GRNPendingReport
