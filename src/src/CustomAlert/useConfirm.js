import { useContext } from 'react';
import { HIDE_CONFIRM, SHOW_CONFIRM } from "./reducer";
import ConfirmContext from "./ConfirmContext";

let resolveCallback;
function useConfirm() {

    const [confirmState, dispatch] = useContext(ConfirmContext);

    const onConfirm = () => {
        closeConfirm();
        resolveCallback(true);
    };

    const onCancel = () => {
        closeConfirm();
        resolveCallback(false);
    };

    const confirm = (payload) => {
        dispatch({
            type: SHOW_CONFIRM,
            payload: payload
        });
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    };

    const closeConfirm = (payload) => {
        dispatch({
            type: HIDE_CONFIRM,
            payload: payload
        });
    };

    return { confirm, onConfirm, onCancel, confirmState };
}

export default useConfirm;