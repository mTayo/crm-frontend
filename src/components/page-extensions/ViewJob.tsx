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
                    <h3 className="font-medium text-lg mb-2">Job Information</h3>
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
                    <h3 className="font-medium text-lg mb-2">Customer</h3>
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
                        <h3 className="font-medium text-lg mb-2">Appointment</h3>
                        <div className="space-y-1">
                            <p>
                            <strong>Technician ID:</strong>{" "}
                            {selectedJob.appointment.technician}
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

                    {/* Job History (Timeline) */}
                    {selectedJob?.history?.length > 0 && (
                    <>
                        <Separator />
                        <section>
                        <h3 className="font-medium text-lg mb-4">History</h3>
                        <div className="relative border-l border-muted-foreground/20 pl-4 space-y-6">
                            {selectedJob.history.map((event: any, index: number) => (
                            <div key={event.id} className="relative">
                                <div
                                className={cn(
                                    "absolute -left-[22px] top-[-10px] h-3 w-3 rounded-full border border-background",
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
