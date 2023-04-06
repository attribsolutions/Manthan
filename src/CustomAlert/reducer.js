export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const HIDE_CONFIRM = 'HIDE_CONFIRM';

export const initialState = {
    Status: false,
    Type: '',
};

function statefun(state, action) {

    let s = { ...state };
    let p = { ...action.payload };
    if (s.Type === p.Type) {
        const sArr = Array.isArray(s.Message)
        const pArr = Array.isArray(p.Message)
        if (sArr) {
            if (pArr) {
                action.payload.Message.push(state.Message)
            } else {
                state.Message.push({ Msg: action.payload.Message })
                action.payload.Message = state.Message
            }
        } else {
            const a = []
            if (pArr) {
                action.payload.Message.push({ Msg: state.Message })
            } else {
                a.push({ Msg: state.Message });
                a.push({ Msg: action.payload.Message })
                action.payload.Message = a
            }
        }
    }
}
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_CONFIRM:
            statefun(state, action)
            return {
                Status: true,
                ...action.payload,
            };
        case HIDE_CONFIRM:
            return initialState;
        default:
            return initialState;
    }
};