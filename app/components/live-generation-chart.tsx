"use client"

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceDot,
} from "recharts"
import { type GenerationData } from "~/components/ui/dt-generation-columns"

export type MetricKey =
    | "GB_GBN_solar_generation_actual"
    | "GB_GBN_solar_capacity"
    | "GB_GBN_load_actual_entsoe_transparency"
    | "GB_GBN_price_day_ahead"
    | "GB_GBN_solar_profile"

type LiveGenerationChartProps = {
    data: GenerationData[]
    metricKey: MetricKey
    metricLabel: string
    color: string
    anomalyTimestamps: Set<number>
}

function shortLabel(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export function LiveGenerationChart({
    data,
    metricKey,
    metricLabel,
    color,
    anomalyTimestamps,
}: LiveGenerationChartProps) {
    const chartData = data.map((row) => ({
        epoch: new Date(row.utc_timestamp).getTime(),
        label: shortLabel(row.utc_timestamp),
        value: row[metricKey] as number,
    }))

    const anomalyMarkers = chartData.filter((point) =>
        anomalyTimestamps.has(point.epoch),
    )

    return (
        <ResponsiveContainer width="100%" height={320}>
            <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={28} />
                <YAxis tick={{ fontSize: 11 }} width={56} />
                <Tooltip
                    formatter={(value) => [
                        typeof value === "number" ? value.toLocaleString() : String(value),
                        metricLabel,
                    ]}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    name={metricLabel}
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#metricFill)"
                    isAnimationActive={false}
                    dot={false}
                />
                {anomalyMarkers.map((marker) => (
                    <ReferenceDot
                        key={marker.epoch}
                        x={marker.label}
                        y={marker.value}
                        r={5}
                        fill="#dc2626"
                        stroke="#ffffff"
                        strokeWidth={1}
                        ifOverflow="extendDomain"
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    )
}
