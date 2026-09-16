"use client"
import { Link } from "react-router";
import { type ColumnDef } from "@tanstack/react-table"

export type TraceData = {
   stage: string;
   status: string;
   created_at: string;
   source: string;
   details: Record<string, any>;
    
}

export const traceColumns: ColumnDef<TraceData>[] = [
    {
        accessorKey: "stage",
        header: "Stage",
    },
    {
        accessorKey: "status",
        header: "Status",    
    },
    {
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        accessorKey: "source",
        header: "Source",
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ getValue }) => JSON.stringify(getValue() as Record<string, any>),
    },
]