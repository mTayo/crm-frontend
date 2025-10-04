/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { extractErrorMessage, isObjectEmpty } from "@/utils/utils";
import { validateData } from "@/helpers/validator";
import { JobServiceApi } from "@/services/job.service";
import { useAuthStore } from "@/store/useStore";

interface InitialState {
  formData: { amount: string };
  isLoading: boolean;
  errors: object;
}

const RecordPaymentForm = ({ selectedJob, onSuccess }: { selectedJob: any; onSuccess?: () => void }) => {
  const [job, setJob] = useState(selectedJob);
  const invoice = job?.invoice;
  const {  jobs, updateState } = useAuthStore();
  const total = invoice?.total ?? 0;
  const paid = invoice?.payments?.reduce(
    (sum: number, payment: any) => sum + payment.amount,
    0
  ) || 0;
  const remaining = total - paid;

  const initialState: InitialState = {
    formData: { amount: "" },
    isLoading: false,
    errors: {},
  };

  const [state, setState]: any = useReducer(
    (state: InitialState, newState: Partial<InitialState>) => ({
      ...state,
      ...newState,
    }),
    initialState
  );

  const { formData, errors, isLoading } = state;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState({
      formData: {
        ...formData,
        [name]: value,
      },
      errors: {
        ...errors,
        [name]: "",
      },
    });
  };

  const processForm = async () => {
    try {
      setState({ isLoading: true });
      if(parseFloat(formData.amount) > remaining) {
        toast.error("Payment exceeds remaining balance")
        return;
      }
      if(parseFloat(formData.amount) <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }
      if(!selectedJob?.invoice?.id) {
        toast.error("No invoice found for this job");
        return;
      }
      const payload = {
        amount: parseFloat(formData.amount),
      };

      const res = await JobServiceApi.createInvoicePayment(payload, selectedJob?.invoice?.id);

      toast.success(" Payment recorded successfully");
      const getSingleJob = await JobServiceApi.getSingleJob(selectedJob?.id);
   
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
        setJob(getSingleJob?.data?.data);
      if (res?.data?.remainingBalance === 0) {
        // await PaymentServiceApi.markJobAsPaid(selectedJob?.id);
        toast.success("Job marked as Paid");
      }

      setState({
        formData: { amount: "" },
        errors: {},
        isLoading: false,
      });

      onSuccess?.();
    } catch (error) {
      const err = extractErrorMessage(error);
      if (err.includes("exceeds remaining balance")) {
        toast.error("Payment exceeds remaining balance");
      } else {
        toast.error(err);
      }
    } finally {
      setState({ isLoading: false });
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();

    const rules = {
      amount: "required|min:1",
    };

    const messages = {
      "amount.required": "Amount is required",
      "amount.min": "Amount must be greater than 0",
    };

    const validate = await validateData(formData, rules, messages);

    if (isObjectEmpty(validate)) {
      processForm();
    } else {
      setState({ errors: { ...validate } });
    }
  };

  return (
    <form onSubmit={submit}>
      <FieldGroup>
         <div className="mb-4 p-3 rounded-md border bg-muted/30">
          <p>
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
          <p>
            <strong>Paid:</strong> ${paid.toFixed(2)}
          </p>
          <p>
            <strong>Remaining:</strong> ${remaining.toFixed(2)}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="amount">Amount</FieldLabel>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter payment amount"
            required
            value={formData.amount}
            onChange={handleInputChange}
            error={errors?.amount}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            Record Payment
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default RecordPaymentForm;
