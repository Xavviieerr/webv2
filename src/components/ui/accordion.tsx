"use client"

import * as React from "react"
import { ChevronDownIcon, Plus, X } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-gray-200 last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  hideChevron,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  hideChevron?: boolean
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          hideChevron && "hover:no-underline",
          !hideChevron && "hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {hideChevron ? (
          <>
            {/* Plus Icon - Circular with dotted border */}
            <div className="pointer-events-none shrink-0 transition-opacity group-data-[state=open]:hidden">
              <div className="relative size-8 flex items-center justify-center rounded-full bg-[#F5F5F5] border border-dotted border-[#CAB6E8]">
                <Plus className="size-4 text-[#0A5F5A] stroke-[2.5]" />
              </div>
            </div>
            {/* X Icon - Dark teal circle with white X */}
            <span className="pointer-events-none hidden size-8 shrink-0 items-center justify-center rounded-full bg-[#0A5F5A] text-white group-data-[state=open]:flex">
              <X className="size-4" />
            </span>
          </>
        ) : (
          <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
