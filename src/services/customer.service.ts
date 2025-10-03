/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import { API_ROUTES } from '@/constants/api-routes';
import { ApiRequestClient } from './abstract.service';

/**
 * CustomerService
 */
class CustomerService {
    fetchCustomers = async () => ApiRequestClient.get(`${API_ROUTES.GET_ALL_CUSTOMERS}`);
}

export const CustomerServiceApi = new CustomerService();