/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { API_ROUTES } from '@/constants/api-routes';
import { ApiRequestClient } from './abstract.service';

/**
 * AuthService
 */
class AuthService {
   
    /**
     * Get logged in user
     *
     * @returns {*} function
     */
    getUser = async () => ApiRequestClient.get(`${API_ROUTES.USER}`);
    /**
     * Log in user
     *
     * @returns {*} function
     */
    logIn = async (payload: {email: string, password: string}) => ApiRequestClient.post(`${API_ROUTES.LOGIN}`, payload);
    
     
}

export const AuthServiceApi = new AuthService();
