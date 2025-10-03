/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unsafe-optional-chaining */
import axios from 'axios';
import Cookies from 'js-cookie';

const instance: any = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`
});

instance.interceptors.request.use(
    async (config: any) => {
        const access_token = Cookies.get('access_token');
        if (typeof access_token !== 'undefined') {
            config.headers.Authorization = `Bearer ${access_token}`;
            // config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error: any) => Promise.reject(error)
);

/**
 *
 * @param {*} response API
 * @returns {object} response
 */
const successHandler = (response: any) => response;

instance.interceptors.response.use(
    (response: any) => successHandler(response),
    async (error: any) => {
        const originalRequest = error.config;
      
        return Promise.reject(error);
    }
);

export default instance;
