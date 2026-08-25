"use client"
import { Link } from "react-router";
import { type ColumnDef } from "@tanstack/react-table"

export type AnomalyData = {
    trace_id: string;
    date_time: string;
    source: string;
    error_details: Record<string, any>;
    error_payload: Record<string, any>;
    
}

export const anomalyColumns: ColumnDef<AnomalyData>[] = [
    {
        accessorKey: "trace_id",
        header: "Trace ID",
        cell: ({ row }) => (
            <Link to={`/trace/${row.original.trace_id}`} className="underline">
                {row.original.trace_id}
            </Link>
        )
    },
    {
        accessorKey: "date_time",
        header: "Timestamp",
    },
    {
        accessorKey: "source",
        header: "Source",
    },
    {
        accessorKey: "error_details",
        header: "Anomaly Error",
        cell: ({ getValue }) => JSON.stringify(getValue() as Record<string, any>),
    },
    {
        accessorKey: "error_payload",
        header: "Anomaly Payload",
        cell: ({ getValue }) => JSON.stringify(getValue() as Record<string, any>),
    },
]