/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useReducer } from "react"
import { AuthServiceApi } from "@/services/auth.service";
import Cookies from 'js-cookie';
import { extractErrorMessage, isObjectEmpty } from "@/utils/utils";
import { validateData } from "@/helpers/validator";
import { toast } from "sonner";

interface InitialState {
    formData: { email: string; password: string };
    isLoading: boolean;
    errors: object;
    showPassword: boolean;
}

const LoginPage = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {

    const router = useRouter()
    const initialState: InitialState = {
        formData: {
            email: '',
            password: ''
        },
        showPassword: false,
        errors: {},
        isLoading: false
    };

    const [state, setState]: any = useReducer((state: InitialState, newState: InitialState) => ({ ...state, ...newState }), initialState);
    const { formData, errors, isLoading } = state;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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


    const processForm = async() => {
        try {
            setState({
                isLoading: true
            });
            const payload = {
                ...formData,
            };
            const request = await AuthServiceApi.logIn(payload);
            toast(request?.data?.message);
            
            Cookies.set('access_token', request?.data?.data?.token)
            router.push('/dashboard/home');
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
            password: 'required|min:8|max:30',
            email: 'required|isEmail'
        };
        const messages = {
            'password.required': 'Password is required',
            'email.required': 'Email is required',
            'email.isEmail': 'Valid email is required'
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

    return (
        <div className={cn("flex max-w-lg w-full flex-col gap-6", className)} {...props}>
        <Card>
            <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
                Enter your email below to login to your account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={submit}>
                <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                        onChange={handleInputChange}
                        error={errors?.email}
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                        Forgot your password?
                    </a>
                    </div>
                    <Input id="password" name="password" type="password" required error={errors?.password}  onChange={handleInputChange} />
                </Field>
                <Field>
                    <Button type="submit" disabled={isLoading} isLoading={isLoading}>Login</Button>
                    <Button variant="outline" disabled={isLoading} type="button">
                    Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                    </FieldDescription>
                </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}

export default LoginPage;
