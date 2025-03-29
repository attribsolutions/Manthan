import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CheckStockEntryforBackDatedTransaction, CheckStockEntryforBackDatedTransactionSuccess, CheckStockEntryForFirstTransaction, CheckStockEntryForFirstTransactionSuccess } from '../../../store/actions';
import { customAlert } from '../../../CustomAlert/ConfirmDialog';

const useCheckStockEntry = (TransactionDate, commonPartyDropSelect) => {
    const dispatch = useDispatch();
    const {
        StockEnteryForFirstYear,
        StockEnteryForBackdated,
    } = useSelector((state) => ({
        StockEnteryForFirstYear: state.StockEntryReducer.StockEnteryForFirstYear,
        StockEnteryForBackdated: state.StockEntryReducer.StockEnteryForBackdated,
    }));

    useEffect(() => {
        const jsonBody = JSON.stringify({
            "FromDate": TransactionDate,
            "PartyID": commonPartyDropSelect.value,
        });

        const jsonBodyForBackdatedTransaction = JSON.stringify({
            "TransactionDate": TransactionDate,
            "PartyID": commonPartyDropSelect.value,
        });

        if (commonPartyDropSelect.value > 0) {
            dispatch(CheckStockEntryForFirstTransaction({ jsonBody }));
            dispatch(CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction }));
        }


        return () => {
            dispatch(CheckStockEntryForFirstTransactionSuccess({ status: false }))
            dispatch(CheckStockEntryforBackDatedTransactionSuccess({ status: false }))
        }

    }, [TransactionDate, commonPartyDropSelect.value, dispatch]);



    const Actionhandler = ({ action, params, callback, }) => {
        const validationChecks = [StockEnteryForBackdated, StockEnteryForFirstYear]
        // Loop through validation checks and show alert if any condition fails
        for (const check of validationChecks) {
            if (check.Status === true && check.StatusCode === 400) {
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(check.Message),
                });
                return;  // Stop further execution if a check fails
            }
        }

        if (callback) {
            callback();
        } else {
            dispatch(action(params));
        }
    };


    return { Actionhandler };
};

export default useCheckStockEntry;
