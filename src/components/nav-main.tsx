"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import CreateJobForm from "./page-extensions/CreateJobForm"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Create Job with Sheet */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Create Job</span>
                </SidebarMenuButton>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create a New Job</SheetTitle>
                  <SheetDescription>
                    Fill in the details below to create a new job entry.
                  </SheetDescription>
                </SheetHeader>
                  <div className="px-4 py-5">
                    <CreateJobForm />
                  </div>
              </SheetContent>
            </Sheet>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Navigation Items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
