"use client"

import { type ColumnDef } from "@tanstack/react-table"

export type WeatherData = {
    trace_id: string;
    utc_timestamp: string;
    GB_temperature: number;
    GB_radiation_direct_horizontal: number;
    GB_radiation_diffuse_horizontal: number;
    
}
export const weatherColumns: ColumnDef<WeatherData>[] = [
    {
        accessorKey: "trace_id",
        header: "Trace ID",
    },
    {
        accessorKey: "utc_timestamp",
        header: "Timestamp",
    },
    {
        accessorKey: "GB_temperature",
        header: "Temperature (°C)",
    },
    {
        accessorKey: "GB_radiation_direct_horizontal",
        header: "Direct Horizontal Radiation (W/m²)",
    },
    {
        accessorKey: "GB_radiation_diffuse_horizontal",
        header: "Diffuse Horizontal Radiation (W/m²)",
    },
]