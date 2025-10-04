/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import Cookies from "js-cookie";

import { ApiRequestClient } from "@/services/abstract.service";
import { AuthServiceApi } from "@/services/auth.service";
import { CustomerServiceApi } from "@/services/customer.service";
import { JobServiceApi } from "@/services/job.service";
import { TechniciansServiceApi } from "@/services/technicians.service";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  customers: any[];
  jobs: any[];
  technicians: any[];
  token: string | null;
  dataLoading: boolean;
  appInitialized: boolean;
  error: string | null;

  logout: () => void;
  fetchAdminData: () => Promise<void>;

  fetchData: (endpoint: string) => Promise<any>;
  updateState: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  dataLoading: true,
  appInitialized: false,
  error: null,
  customers:[],
  jobs: [],
  technicians: [],

  logout: () => {
    Cookies.remove("access_token");
    set({ user: null, token: null, appInitialized: false });
  },

  fetchAdminData: async () => {
    try {
      const [userRes, customerRes, jobRes, techniciansRes]:any = await Promise.allSettled([
        AuthServiceApi.getUser(),
        CustomerServiceApi.fetchCustomers(),
        JobServiceApi.getAllJobs(),
        TechniciansServiceApi.getAllTechnicians()
      ]);

      if (userRes.status === "fulfilled") {
        const userData = userRes.value?.data?.data;
        set({
          user: {
            ...userData?.user,
          },
        });
      }

      if (customerRes.status === "fulfilled") {
    
        const customerData = customerRes.value?.data?.data;

        set({
          customers: customerData || [],
          
        });
      }

      if (techniciansRes.status === "fulfilled") {
    
        const techniciansData = techniciansRes.value?.data?.data;
        set({
          technicians: techniciansData || [],
          
        });
      }

      if (jobRes.status === "fulfilled") {
    
        const jobData = jobRes.value?.data?.data;

        set({
          jobs: jobData || [],
        });
      }

    } catch (error) {
      set({ user: null });
    
    }finally{
      set({  appInitialized: true });
    }
  },
 
  fetchData: async (endpoint: string) => {
    const token = Cookies.get("access_token");
    if (!token) throw new Error("No token found");
    return ApiRequestClient.get(endpoint);
  },

  updateState: (data: Partial<AuthState>) => set(data),

}));
