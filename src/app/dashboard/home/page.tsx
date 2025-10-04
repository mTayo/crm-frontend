/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import * as React from "react"
import { SectionCards } from "@/components/section-cards"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/useStore"
import { BasicTable } from "@/components/basic-table"
import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from "@tabler/icons-react"
import { capitalizeFirstLetter, extractErrorMessage } from "@/utils/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { JobServiceApi } from "@/services/job.service";
import { toast } from "sonner";
import HashLoader from "react-spinners/HashLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import ScheduleJob from "@/components/page-extensions/ScheduleJob";
import { JobDetailsSheet } from "@/components/page-extensions/ViewJob";
import GenerateInvoiceForm from "@/components/page-extensions/GenerateInvoiceForm";


interface Job { 
  id: string
  title: string
  description: string
  status: string
  customer: {
    id: string
    name: string
    phone: string
    email: string
    address: string
  }
  createdAt: string
}

export default function HomePage() {
  const { jobs, updateState } = useAuthStore();
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openSheet, setOpenSheet] = useState<null | "schedule" | "invoice" | "payment">(null);

  const [loading, setLoading] = React.useState(false);

   const handleView = async (jobId: string) => {
    try {
      setLoading(true);
      setOpen(true);
      const res = await JobServiceApi.getSingleJob(jobId);
      setSelectedJob(res?.data?.data);
    } catch (error) {
      toast.error(extractErrorMessage(error));
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJobStatusUpdate = async (jobId: string, status: string) => {
    try {
        const req = await JobServiceApi.updateJobStatus({id: jobId, status});
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
    }catch(error){
      toast.error(extractErrorMessage(error));
    }
  }

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }) => row.original.title || "Untitled",
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => row.original.customer.name,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "DONE" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {capitalizeFirstLetter(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
  id: "actions",
  cell: ({ row }) => {
    const job = row.original; // current job row
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {/* View is always available */}
          {/* <DropdownMenuItem onClick={() => handleView(row?.original?.id)}></DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => handleView(row?.original?.id)}
          >
            View Details
          </DropdownMenuItem>

          {/* Show "Schedule Job" only if job is new */}
          {job.status === "NEW" && (
            <DropdownMenuItem
              onClick={() => {
                setSelectedJob(job);
                setOpenSheet("schedule");
              }}
            >
              Schedule Job
            </DropdownMenuItem>
          )}

          {/* Show "Generate Invoice" only if job is scheduled */}
          {job.status === "DONE" && (
            <DropdownMenuItem
              onClick={() => {
                setSelectedJob(job);
                setOpenSheet("invoice");
              }}
            >
              Generate Invoice
            </DropdownMenuItem>
          )}

          {/* Show "Generate Invoice" only if job is scheduled */}
          {job.status === "SCHEDULED" && (
            <DropdownMenuItem
              onClick={() => {
                setSelectedJob(job);
                handleJobStatusUpdate(job.id, "DONE");
              }}
            >
              Mark as done
            </DropdownMenuItem>
          )}

          {/* Show "Record Payment" only if job has an invoice */}
          {job.status === "INVOICED" && (
            <DropdownMenuItem
              onClick={() => {
                setSelectedJob(job);
                setOpenSheet("payment");
              }}
            >
              Record Payment
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Delete is always available */}
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            // onClick={() => handleDelete(job.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
}
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4">
            <BasicTable data={jobs} columns={columns} />
          </div>
        </div>
      </div>

      {/* Sheet */}
      <JobDetailsSheet open={open} setOpen={setOpen} loading={loading} selectedJob={selectedJob} />
  

      {/* SCHEDULE JOB SHEET */}
      <Sheet open={openSheet === "schedule"} onOpenChange={() => setOpenSheet(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Schedule Job</SheetTitle>
            <SheetDescription>
              Assign a technician and select the time window for this job.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4 px-4">
            <ScheduleJob onClose ={()=> setOpenSheet(null)} jobId={selectedJob?.id} />
          </div>
          
        </SheetContent>
      </Sheet>

      {/* INVOICE SHEET */}
      
      <Sheet open={openSheet === "invoice"} onOpenChange={() => setOpenSheet(null)}>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Generate Invoice</SheetTitle>
            <SheetDescription>
              Add invoice items for this job.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4 px-4">
            <GenerateInvoiceForm   jobId={selectedJob?.id || ''}  />
            
          </div>
         
        </SheetContent>
      </Sheet>

      {/* PAYMENT SHEET */}
      <Sheet open={openSheet === "payment"} onOpenChange={() => setOpenSheet(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Record Payment</SheetTitle>
            <SheetDescription>
              Add payment details for this job’s invoice.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Amount</Label>
              <Input id="pay-amount" type="number" placeholder="Enter payment amount" />
            </div>
          </div>
          <SheetFooter>
            <Button
              onClick={async () => {
                const amount = parseFloat((document.getElementById("pay-amount") as HTMLInputElement).value);
                try {
                  await axios.post(
                    `https://crm-backend-fnz1.onrender.com/api/invoices/${selectedJob?.id}/payments`,
                    { amount }
                  );
                  toast.success("Payment recorded successfully");
                  setOpenSheet(null);
                } catch (err: any) {
                  if (err.response?.status === 400)
                    toast.error("Payment exceeds remaining balance");
                  else toast.error("Failed to record payment");
                }
              }}
            >
              Record Payment
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </div>
  )
}
