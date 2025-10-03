/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import { API_ROUTES } from '@/constants/api-routes';
import { ApiRequestClient } from './abstract.service';

/**
 * JobService
 */
class JobService {
    createNewJob = async (data: any) => ApiRequestClient.post(`${API_ROUTES.CREATE_JOB}`, data);
}

export const JobServiceApi = new JobService();