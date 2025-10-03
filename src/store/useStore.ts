/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import Cookies from "js-cookie";

import { ApiRequestClient } from "@/services/abstract.service";
import { AuthServiceApi } from "@/services/auth.service";
import { CustomerServiceApi } from "@/services/customer.service";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  customers: any[];
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

  logout: () => {
    Cookies.remove("access_token");
    set({ user: null, token: null, appInitialized: false });
  },

  fetchAdminData: async () => {
    try {
      const [userRes, customerRes]:any = await Promise.allSettled([
        AuthServiceApi.getUser(),
        CustomerServiceApi.fetchCustomers()
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
