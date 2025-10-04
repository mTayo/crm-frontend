/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { HashLoader } from "react-spinners"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isNotEmptyArray } from "@/utils/utils"

export function JobDetailsSheet({
  open,
  setOpen,
  selectedJob,
  loading,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  selectedJob: any
  loading: boolean
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[400px]  overflow-y-scroll px-4 sm:w-[500px]">
            {loading ? (
            <>
                <SheetHeader className="py-4 px-0">
                <SheetTitle>{selectedJob?.title || "Loading..."}</SheetTitle>
                <SheetDescription>
                    Job details for{" "}
                    <strong>{selectedJob?.customer?.name || "..."}</strong>
                </SheetDescription>
                </SheetHeader>

                <div className="flex h-[70vh] items-center justify-center">
                <HashLoader color="#1b1917" size={80} />
                </div>
            </>
            ) : (
            <>
                <SheetHeader className="py-4 px-0">
                <SheetTitle>{selectedJob?.title || "Untitled Job"}</SheetTitle>
                <SheetDescription>
                    Job details for{" "}
                    <strong>{selectedJob?.customer?.name || "Unknown"}</strong>
                </SheetDescription>
                </SheetHeader>

                
                <div className="mt-4 space-y-4 text-sm">
                    {/* Job Info */}
                    <section>
                    <h3 className="font-semibold text-blue-700 text-lg mb-2">Job Information</h3>
                    <div className="space-y-1">
                        <p>
                        <strong>Status:</strong>{" "}
                        <Badge
                            variant={
                            selectedJob?.status === "DONE"
                                ? "secondary"
                                : "outline"
                            }
                        >
                            {selectedJob?.status}
                        </Badge>
                        </p>
                        <p>
                        <strong>Description:</strong>{" "}
                        {selectedJob?.description || "No description provided."}
                        </p>
                        <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(selectedJob?.createdAt || "").toLocaleString()}
                        </p>
                        <p>
                        <strong>Updated At:</strong>{" "}
                        {new Date(selectedJob?.updatedAt || "").toLocaleString()}
                        </p>
                    </div>
                    </section>

                    <Separator />

                    {/* Customer Info */}
                    <section>
                    <h3 className="font-semibold text-blue-700 text-lg mb-2">Customer</h3>
                    <div className="space-y-1">
                        <p>
                        <strong>Name:</strong> {selectedJob?.customer?.name}
                        </p>
                        <p>
                        <strong>Email:</strong> {selectedJob?.customer?.email}
                        </p>
                        <p>
                        <strong>Phone:</strong> {selectedJob?.customer?.phone}
                        </p>
                        <p>
                        <strong>Address:</strong> {selectedJob?.customer?.address}
                        </p>
                    </div>
                    </section>

                    {/* Appointment Info */}
                    {selectedJob?.appointment && (
                    <>
                        <Separator />
                        <section>
                        <h3 className="font-semibold text-blue-700 text-lg mb-2">Appointment</h3>
                        <div className="space-y-1">
                            <p>
                            <strong>Technician :</strong>{" "}
                            {selectedJob?.appointment?.technicianData?.name} ({selectedJob?.appointment?.technicianData?.email})
                            </p>
                            <p>
                            <strong>Start:</strong>{" "}
                            {new Date(
                                selectedJob.appointment.startTime
                            ).toLocaleString()}
                            </p>
                            <p>
                            <strong>End:</strong>{" "}
                            {new Date(
                                selectedJob.appointment.endTime
                            ).toLocaleString()}
                            </p>
                        </div>
                        </section>
                    </>
                    )}

                     {/* Invoice Section */}
                    {selectedJob?.invoice && (
                        <>
                          <Separator />
                            <h3 className="font-semibold text-blue-700 text-lg mb-2">Invoice</h3>
                        
                        
                            <p><strong>Invoice ID:</strong> {selectedJob.invoice.id}</p>
                            {/* Line items */}
                            {isNotEmptyArray(selectedJob?.invoice?.lineItems) && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-base">Line Items</h4>
                                    
                                    <div className="space-y-3">
                                    {selectedJob?.invoice?.lineItems.map((item: any, idx: number) => (
                                        <div
                                        key={item.id || idx}
                                        className="border rounded-lg p-3 bg-muted/10"
                                        >
                                        <p className="font-medium text-sm truncate">
                                            {item.description}
                                        </p>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>Qty: {item.quantity}</span>
                                            <span>Unit: ${item.unitPrice}</span>
                                            <span>Total: ${item.lineTotal}</span>
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>  
                            )}
                            
                             <p><strong>Subtotal:</strong> ${selectedJob.invoice.subtotal.toFixed(2)}</p>
                            <p><strong>Tax:</strong> ${selectedJob.invoice.tax.toFixed(2)}</p>
                            <p className="font-semibold text-lg">
                            Total: ${selectedJob?.invoice?.total?.toFixed(2)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                            Created at: {new Date(selectedJob?.invoice?.createdAt).toLocaleString()}
                            </p>


                        
                        </>
                        )}

                    {/* --- PAYMENTS --- */}
                    {isNotEmptyArray(selectedJob?.invoice?.payments) && (
                        <>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="font-semibold text-blue-700 text-lg mb-2">Payments</h3>

                            <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedJob.invoice.payments
                                .sort(
                                (a: any, b: any) =>
                                    new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime()
                                )
                                .map((p: any, idx: number) => (
                                <div
                                    key={p.id || idx}
                                    className="flex justify-between items-center border rounded-lg p-2 text-xs bg-muted/5"
                                >
                                    <span>Payment #{selectedJob.invoice.payments.length - idx}</span>
                                    <span className="font-medium">${p.amount}</span>
                                    <span className="text-muted-foreground">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                ))}
                            </div>

                            {/* Payment summary */}
                            {(() => {
                            const totalPaid = selectedJob.invoice.payments.reduce(
                                (sum: number, p: any) => sum + p.amount,
                                0
                            );
                            const balance = selectedJob.invoice.total - totalPaid;

                            return (
                                <div className="mt-2 space-y-1 text-sm">
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <span>Total Paid:</span>
                                    <span>${totalPaid.toFixed(2)}</span>
                                </div>
                                <div
                                    className={`flex justify-between font-semibold ${
                                    balance > 0
                                        ? "text-orange-600"
                                        : "text-green-600"
                                    }`}
                                >
                                    <span>Balance:</span>
                                    <span>${balance.toFixed(2)}</span>
                                </div>
                                </div>
                            );
                            })()}
                        </div>
                        </>
                    )}

                    {/* Job History (Timeline) */}
                    {selectedJob?.history?.length > 0 && (
                    <>
                        <Separator />
                        <section className="pb-10">
                        <h3 className="font-semibold text-blue-700 text-lg mb-2">History</h3>
                        <div className="relative border-l border-muted-foreground/20 pl-4 space-y-6">
                            {selectedJob.history.map((event: any, index: number) => (
                            <div key={event.id} className="relative">
                                <div
                                className={cn(
                                    "absolute -left-[22px] top-[3px] h-3 w-3 rounded-full border border-background",
                                    index === 0
                                    ? "bg-primary"
                                    : "bg-muted-foreground/50"
                                )}
                                />
                                <div className="space-y-1">
                                <p className="font-medium">
                                    {event.oldStatus} → {event.newStatus}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Changed by: {event.changedBy}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(event.createdAt).toLocaleString()}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </section>
                    </>
                    )}
                </div>
            
            </>
            )}
        </SheetContent>

    </Sheet>
  )
}
