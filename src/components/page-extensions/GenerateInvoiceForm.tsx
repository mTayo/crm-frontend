/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Key, useReducer } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { extractErrorMessage, isObjectEmpty } from "@/utils/utils"
import { validateData } from "@/helpers/validator"
import { JobServiceApi } from "@/services/job.service"
import { Textarea } from "../ui/textarea"
import { useAuthStore } from "@/store/useStore"

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

interface InitialState {
  lineItems: LineItem[]
  isLoading: boolean
  errors: Record<string, string>
}

const GenerateInvoiceForm = ({ jobId }: { jobId: string }) => {
    const {  jobs, updateState } = useAuthStore();
  const initialState: InitialState = {
    lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
    errors: {},
    isLoading: false,
  }

  const [state, setState]: any = useReducer(
    (state: InitialState, newState: Partial<InitialState>) => ({
      ...state,
      ...newState,
    }),
    initialState
  )

  const { lineItems, errors, isLoading } = state

  // handle input change for each line item
  const handleChange = (index: number, field: keyof LineItem, value: any) => {
    const updatedItems = [...lineItems]
    updatedItems[index][field] = value
    setState({
      lineItems: updatedItems,
      errors: {},
    })
  }

  // add a new line item
  const addItem = () => {
    setState({
      lineItems: [...lineItems, { description: "", quantity: 1, unitPrice: 0 }],
    })
  }

  // remove a line item
  const removeItem = (index: number) => {
    setState({
      lineItems: lineItems.filter((_: any, i: number) => i !== index),
    })
  }

  const processForm = async () => {
    try {
        setState({ isLoading: true })
        const payload = { lineItems }
        const request = await JobServiceApi.createJobInvoice(payload, jobId)
        toast.success(request?.data?.message || "Invoice generated successfully")
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
        setState(initialState)
    } catch (error) {
      const err = extractErrorMessage(error)
      toast.error(err || "Failed to generate invoice")
    } finally {
      setState({ isLoading: false })
    }
  }

  const submit = async (e: any) => {
    e.preventDefault()

    // validation rules
    const rules: Record<string, string> = {}
    lineItems.forEach((_: any, index: any) => {
      rules[`lineItems.${index}.description`] = "required|min:3"
      rules[`lineItems.${index}.quantity`] = "required"
      rules[`lineItems.${index}.unitPrice`] = "required"
    })

    const validate = await validateData({ lineItems }, rules, {})
    if (isObjectEmpty(validate)) {
      processForm()
    } else {
      setState({ errors: validate })
    }
  }

  const subtotal = lineItems.reduce(
    (sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice,
    0
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <FieldGroup>
        {lineItems.map((item: { description: string | number | readonly string[] | undefined; quantity: string | number | readonly string[] | undefined; unitPrice: string | number | readonly string[] | undefined }, index: number) => (
          <div
            key={index}
            className="border rounded-xl p-4 space-y-3 relative bg-muted/5"
          >
            <div className="flex justify-between items-center">
              <FieldLabel className="font-medium">
                Line Item {index + 1}
              </FieldLabel>
              {lineItems.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="E.g., Service charge"
                value={item.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                error={errors?.[`lineItems.${index}.description`]}
              />
            </Field>

            <div className="flex gap-3">
              <Field className="flex-1">
                <FieldLabel>Quantity</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", Number(e.target.value))
                  }
                  error={errors?.[`lineItems.${index}.quantity`]}
                />
              </Field>

              <Field className="flex-1">
                <FieldLabel>Unit Price</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleChange(index, "unitPrice", Number(e.target.value))
                  }
                  error={errors?.[`lineItems.${index}.unitPrice`]}
                />
              </Field>
            </div>

            <p className="text-sm text-muted-foreground">
              <strong>Line Total:</strong>{" "}
              {((Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0)).toFixed(2))}
            </p>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="flex items-center gap-2 w-full"
        >
          <Plus className="h-4 w-4" /> Add Another Line Item
        </Button>

        <Separator />

        <div className="flex justify-between text-sm font-medium">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            Generate Invoice
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default GenerateInvoiceForm
