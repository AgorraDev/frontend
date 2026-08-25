"use client"

import { type ColumnDef } from "@tanstack/react-table"

export type GenerationData = {
    trace_id: string;
    utc_timestamp: string;
    GB_GBN_load_actual_entsoe_transparency: number;
    GB_GBN_load_forecast_entsoe_transparency: number;
    GB_GBN_price_day_ahead: number;
    GB_GBN_solar_capacity: number;
    GB_GBN_solar_generation_actual: number;
    GB_GBN_solar_profile: number;
    
}
export const generationColumns: ColumnDef<GenerationData>[] = [
    {
        accessorKey: "trace_id",
        header: "Trace ID",
    },
    {
        accessorKey: "utc_timestamp",
        header: "Timestamp",
    },
    {
        accessorKey: "GB_GBN_load_actual_entsoe_transparency",
        header: "Load Actual (MW)",
    },
    {
        accessorKey: "GB_GBN_load_forecast_entsoe_transparency",
        header: "Load Forecast (MW)",
    },
    {
        accessorKey: "GB_GBN_price_day_ahead",
        header: "Price Day Ahead (€/MWh)",
    },
    {
        accessorKey: "GB_GBN_solar_capacity",
        header: "Solar Capacity (MW)",
    },
    {
        accessorKey: "GB_GBN_solar_generation_actual",
        header: "Solar Generation Actual (MW)",
    },
    {
        accessorKey: "GB_GBN_solar_profile",
        header: "Solar Profile (MW)",
    },
]