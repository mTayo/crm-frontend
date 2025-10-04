/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */

import { API_ROUTES } from '@/constants/api-routes';
import { ApiRequestClient } from './abstract.service';

/**
 * TechniciansService
 */
class TechniciansService {
   
    /**
     * Get logged in user
     *
     * @returns {*} function
     */
    getAllTechnicians = async () => ApiRequestClient.get(`${API_ROUTES.TECHNICIANS}`);
    
     
}

export const TechniciansServiceApi = new TechniciansService();
