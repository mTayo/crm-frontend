/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useReducer } from "react"
import { extractErrorMessage, isObjectEmpty } from "@/utils/utils";
import { validateData } from "@/helpers/validator";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuthStore } from "@/store/useStore";
import { JobServiceApi } from "@/services/job.service";

interface InitialState {
    formData: { jobId: string; startTime: string; endTime: string; technician: string };
    isLoading: boolean;
    errors: object;
}

const ScheduleJob = ({onClose, jobId}: any) => {
    const { technicians, jobs, updateState } = useAuthStore();
    const initialState: InitialState = {
        formData: {
            jobId: jobId || '',
            startTime: '',
            endTime:'',
            technician: ''
        },
        errors: {},
        isLoading: false
    };

    const [state, setState]: any = useReducer((state: InitialState, newState: InitialState) => ({ ...state, ...newState }), initialState);
    const { formData, errors, isLoading } = state;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setState({
            formData: {
                ...formData,
                [name]: value
            },
            errors: {
                ...errors,
                [name]: ''
            }
        });
    };

    const handleTechnicianChange = (value: string) => {
        setState({
            formData: {
                ...formData,
                technician: value
            },
            errors: {
                ...errors,
                technician: ''
            }
        });
    };
    const processForm = async() => {
        try {
            setState({
                isLoading: true
            });
            const payload = {
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
            };
            const request = await JobServiceApi.createJobAppointment(payload);
            toast(request?.data?.message);
            setState({
                formData: {
                    jobId: '',
                    startTime: '',
                    endTime:'',
                    technician: ''
                },
                errors: {},
                isLoading: false
            });
            const getSingleJob = await JobServiceApi.getSingleJob(jobId);
   
            let jobsArray = [...jobs];
            jobsArray = jobsArray.map((obj: any) => {
                if (obj?.id === getSingleJob?.data?.data?.id) {
                    return getSingleJob?.data?.data;
                }
                return obj;
            });

            updateState({
                jobs: jobsArray,
            });
            onClose();
        } catch (error) {
            const err = extractErrorMessage(error);
           toast.error(err)
        } finally {
            setState({
                isLoading: false
            });
        }
    }

    const submit = async (e: any) => {
        e.preventDefault();
         
        const rules = {
           jobId: 'required',
            endTime: 'required',
            startTime: 'required',
            technician: 'required'
        };
        const messages = {
            'endTime.required': 'End time is required',
            'startTime.required': 'Start time is required',
            'technician.required': 'Technician is required'
        };

        const validate = await validateData(formData, rules, messages);
        
        if (isObjectEmpty(validate)) {
           
            processForm();
        } else {
            setState({
                errors: { ...validate }
            });
        }
    };
    return(
        <form onSubmit={submit}>
            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="startTime">Start time</FieldLabel>
                <Input
                    id="startTime"
                    type="datetime-local"
                    name="startTime"
                    placeholder="Enter start time"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    error={errors?.startTime}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="endTime">End time</FieldLabel>
                <Input
                    id="endTime"
                    type="datetime-local"
                    name="endTime"
                    placeholder="Enter end time"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    error={errors?.endTime}
                />
            </Field>

           
                 
            <Field>
                <FieldLabel htmlFor="customer">Select technician</FieldLabel>
                <Select onValueChange={handleTechnicianChange} value={formData.technician}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a technician" />
                    </SelectTrigger>
                    <SelectContent>
                    {technicians.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} — {customer.email}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field>
                <Button type="submit" disabled={isLoading} isLoading={isLoading}>Appoint technician</Button>
                
            </Field>
            </FieldGroup>
        </form>
    )
};

export default ScheduleJob;