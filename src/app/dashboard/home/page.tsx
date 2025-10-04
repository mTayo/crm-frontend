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
} from "@/components/ui/sheet"
import { JobServiceApi } from "@/services/job.service";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMemo, useState } from "react";
import ScheduleJob from "@/components/page-extensions/ScheduleJob";
import { JobDetailsSheet } from "@/components/page-extensions/ViewJob";
import GenerateInvoiceForm from "@/components/page-extensions/GenerateInvoiceForm";
import RecordPaymentForm from "@/components/page-extensions/RecordPayment";


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

const statusTabs = [
  { label: "All", value: "all" },
  { label: "New", value: "NEW" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Done", value: "DONE" },
  { label: "Invoiced", value: "INVOICED" },
  { label: "Paid", value: "PAID" },
]



export default function HomePage() {
  const { jobs, updateState } = useAuthStore();
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openSheet, setOpenSheet] = useState<null | "schedule" | "invoice" | "payment">(null);

  const [loading, setLoading] = React.useState(false);
  const [activeStatus, setActiveStatus] = useState("all")

  // Filter jobs based on selected tab
  const filteredData = useMemo(() => {
    if (activeStatus === "all") return jobs
    return jobs.filter((job) => job.status === activeStatus)
  }, [activeStatus, jobs])

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
            <div className="mb-4">
              <Tabs value={activeStatus} onValueChange={setActiveStatus}>
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
                  {statusTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="capitalize text-sm px-4"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <BasicTable data={filteredData} columns={columns} />
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
          <div className="space-y-4 px-4">
            <div>
              <RecordPaymentForm selectedJob={selectedJob} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}
