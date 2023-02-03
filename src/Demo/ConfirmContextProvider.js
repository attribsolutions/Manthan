import {useReducer} from "react";
import ConfirmContext from "./ConfirmContext";
import {initialState, reducer} from "./Reducer";
// import ConfirmContext from "./store/ConfirmContext";

export const ConfirmContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ConfirmContext.Provider value={[state, dispatch]}>
            {children}
        </ConfirmContext.Provider>
    );
};