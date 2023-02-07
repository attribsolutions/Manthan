export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const HIDE_CONFIRM = 'HIDE_CONFIRM';

export const initialState = {
    Status: false,
    Type: '',
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_CONFIRM:
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