import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CheckStockEntryforBackDatedTransaction, CheckStockEntryForFirstTransaction } from '../../../store/actions';
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
    }, [TransactionDate, commonPartyDropSelect.value, dispatch]);

    useEffect(() => {
        if (StockEnteryForFirstYear.Status === true && StockEnteryForFirstYear.StatusCode === 400) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(StockEnteryForFirstYear.Message),
            });
        }
    }, [StockEnteryForFirstYear]);



    const Actionhandler = ({ action, params, callback }) => {
        debugger
        if (StockEnteryForBackdated.Status === true && StockEnteryForBackdated.StatusCode === 400) {
            customAlert({ Type: 3, Message: StockEnteryForBackdated.Message });
        } else {
            if (callback) {
                callback();
            } else {
                dispatch(action(params));
            }

        }
    };

    return { Actionhandler };
};

export default useCheckStockEntry;
