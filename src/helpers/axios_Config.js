import axios from 'axios';
import axiosRetry from 'axios-retry';
import { toast, Bounce } from 'react-toastify';

// const API_URL = "http://cbmfooderp.com:8000";

const API_URL = "http://192.168.1.114:8000";
// const API_URL = "http://127.0.0.1:8000";


const axiosApi = axios.create({ baseURL: API_URL });

const requestUrls = {};

function logRequestAndResponse(config, response) {
    // Get the stored request URL for this request or response
    const requestUrl = requestUrls[config?.url] || requestUrls[response?.config.url];

    if (config) {
        // Log request
        const logMessage = `%cRequest`;
        const logStyle = 'font-weight: bold; color: blue;';
        const logData = config.data !== undefined ? JSON.parse(JSON.stringify(config.data, null, 2)) : 'Data is undefined.';
        console.groupCollapsed(logMessage, logStyle, `${config.method} ${requestUrl}`);
        console.log('Data:', logData);
        console.groupEnd();
    }

    if (response) {
        if (response.status === 'Network Error') {
            // Log network error response separately
            const logMessage = `%c${response.status}`;
            const logStyle = 'font-weight: bold; color: red;';
            console.groupCollapsed(logMessage, logStyle, `${requestUrl}`);
            console.log('Data:', 'Data is undefined.');
            console.groupEnd();
        } else {
            // Determine response log color
            const logColor = response.status === 200 ? 'green' : 'orange';

            // Log regular response
            const logMessage = `%cResponse (${response.status})`;
            const logStyle = `font-weight: bold; color: ${logColor};`;
            const logData = response.data !== undefined ? response.data : 'Data is undefined.';
            console.groupCollapsed(logMessage, logStyle, `${requestUrl}`);
            console.log('Data:', logData);
            console.groupEnd();
        }
    }
}

axiosApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token} `;
        } else {
            delete config.headers.Authorization;
        }

        // Store the request URL for this request
        requestUrls[config.url] = `${config.baseURL}${config.url} `;

        // Log request using utility function
        logRequestAndResponse(config);

        return config;
    },
    (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
    (response) => {
        // Log response using utility function
        logRequestAndResponse(null, response);

        return response;
    },
    (error) => {
        if (!error.response) {
            // Log network error using utility function
            const networkErrorResponse = {
                config: error.config,
                data: undefined,
                status: 'Network Error',
                statusText: 'Network Error',
                headers: error.config.headers,
            };

            logRequestAndResponse(error.config, networkErrorResponse);

            showToastAlert('Network error. Please check your internet connection.', 'error');
        } else {
            // Handle other errors and log using utility function
            const { data, status } = error.response;
            const messages = {
                400: getBadRequestMessage(data),
                401: 'Unauthorized. Please log in again.',
                403: 'Permission denied.',
                404: 'Resource not found.',
                226: 'The requested resource has been used in a different context',
                406: 'Not Acceptable - The server cannot produce a response matching the list of acceptable values defined in the request',
                0: () => axiosRetry(error.config),
            };
            const errorMessage = messages[status] || 'Oops! Something went wrong.';

            logRequestAndResponse(error.config, error.response);
            showToastAlert(errorMessage, 'error');
        }

        return Promise.reject(error);
    }
);

function getBadRequestMessage(data) {
    if (data && data.errors) {
        return Object.values(data.errors).join('\n');
    } else if (data && data.message) {
        return data.message;
    }
    return 'An error occurred.';
}

axiosRetry(axiosApi, { retries: 3, retryDelay: axiosRetry.exponentialDelay });


const activeToasts = new Set();

export function showToastAlert(message = 'Oops! Something went wrong.', color = '') {
    if (!activeToasts.has(message)) {
        activeToasts.add(message);

        toast(message, {
            type: color,
            transition: Bounce,
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            onClose: () => {
                activeToasts.delete(message);
            },
        });
    }
}

export { axiosApi };
