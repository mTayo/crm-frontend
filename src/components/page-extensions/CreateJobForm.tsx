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
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuthStore } from "@/store/useStore";
import { JobServiceApi } from "@/services/job.service";

interface InitialState {
    formData: { title: string; description: string; customerId: string };
    isLoading: boolean;
    errors: object;
}

const CreateJobForm = () => {
    const { customers } = useAuthStore();
    const initialState: InitialState = {
        formData: {
            title: '',
            description: '',
            customerId: ''
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

    const handleCustomerChange = (value: string) => {
        setState({
            formData: {
                ...formData,
                customerId: value
            },
            errors: {
                ...errors,
                customerId: ''
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
            };
            const request = await JobServiceApi.createNewJob(payload);
            toast(request?.data?.message);
            setState({
                formData: {
                    title: '',
                    description: '',
                    customerId: ''
                },
                errors: {},
                isLoading: false
            });
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
            title: 'required|min:3|max:30',
            description: 'required|min:8'
        };
        const messages = {
            'title.required': 'title is required',
            'description.required': 'Description is required'
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
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    error={errors?.title}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                    id="description"
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    error={errors?.description}
                />
            </Field>
                 
            <Field>
                <FieldLabel htmlFor="customer">Select customer</FieldLabel>
                <Select onValueChange={handleCustomerChange} value={formData.customer}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                    {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} — {customer.email}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field>
                <Button type="submit" disabled={isLoading} isLoading={isLoading}>Submit</Button>
                
            </Field>
            </FieldGroup>
        </form>
    )
};

export default CreateJobForm;