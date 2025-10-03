/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import axiosClient from '../axios-config/axios-config';

/**
 * ApiClient
 */
class ApiClient {
    /**
     * ApiClient GET request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    get(path: string, params = {}, headers = {}): any {
        return axiosClient.get(path, {
            params,
            headers
        });
    }

    /**
     * ApiClient POST request helper
     * @param {*} path Server API endpoint
     * @param {*} payload Request payload sent to server
     * @return {*} promise
     */
    post(path: string, payload: any) {
        return axiosClient.post(`${path}`, payload);
    }

    /**
     * ApiClient DELETE request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    delete(path: string, params?: any) {
        return axiosClient.delete(path, {
            params
        });
    }

    /**
     * ApiClient PATCH request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    patch(path: string, payload: any) {
        return axiosClient.patch(path, payload);
    }

    /**
     * ApiClient PUT request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    put(path: string, payload: any) {
        return axiosClient.put(path, payload);
    }

    /**
     * ApiClient PATCH request helper
     * @param {*} path Server API endpoint
     * @param {*} params Server request params
     * @return {*} promise
     */
    uploadRequest(path: string, payload?: object) {
        return axiosClient.post(path, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

export const ApiRequestClient = new ApiClient();
