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

    updateJobStatus = async (data: {id:string, status:string}) => ApiRequestClient.put(`${API_ROUTES.UPDATE_JOB_STATUS}`, data);

    getAllJobs = async (params={}) =>   ApiRequestClient.get(API_ROUTES.GET_ALL_JOBS, { params })

    getSingleJob = async (jobId:string) =>   ApiRequestClient.get(API_ROUTES.GET_ALL_JOBS+`/${jobId}`)

    createJobAppointment = async (data: 
        {
        jobId: string,
        technician: string,
        startTime: string,
        endTime: string
        }) => ApiRequestClient.post(`${API_ROUTES.CREATE_JOB_APPOINTMENT}`, data);

    createJobInvoice = async (data: any, jobId: string) => ApiRequestClient.post(`/job/${jobId}/invoice`, data);

    createInvoicePayment = async (data: any, invoiceId: string) => ApiRequestClient.post(`/invoice/${invoiceId}/payments`, data);
}

export const JobServiceApi = new JobService();