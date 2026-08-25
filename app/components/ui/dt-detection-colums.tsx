"use client"
import { Link } from "react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { type DetectionData } from "~/lib/server";

export const detectionColumns: ColumnDef<DetectionData>[] = [
    {
        accessorKey: "trace_id",
        header: "Trace ID",
        cell: ({ row }) => (
            <Link to={`/trace/${row.original.trace_id}`} className="underline">
                {row.original.trace_id}
            </Link>
        ),
    },
    {
        accessorKey: "date_time",
        header: "Timestamp",
    },
    {
        accessorKey: "rule_codes",
        header: " Rules Fired",
        cell: ({ getValue }) => {
            const codes = getValue() as string[];
            return codes && codes.length > 0 ? codes.join(", ") : "-";
        },
    },
    {
        accessorKey: "source",
        header: "Source"
    },
]