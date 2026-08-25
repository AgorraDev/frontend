import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLoaderData } from "react-router"
import { Server, type DetectionData } from "~/lib/server"
import { type GenerationData } from "~/components/ui/dt-generation-columns"
import {
    LiveGenerationChart,
    type MetricKey,
} from "~/components/live-generation-chart"

const METRICS: { key: MetricKey; label: string; color: string }[] = [
    { key: "GB_GBN_solar_generation_actual", label: "Solar generation (MW)", color: "#f59e0b" },
    { key: "GB_GBN_solar_capacity", label: "Solar capacity (MW)", color: "#f97316" },
    { key: "GB_GBN_solar_profile", label: "Solar profile (MW)", color: "#10b981" },

]


const WINDOWS = [
    { label: "24 h", value: 24 },
    { label: "48 h", value: 48 },
    { label: "7 days", value: 168 },
    { label: "1 month", value: 720 },
    { label: "3 months", value: 2190 },
    { label: "1 year", value: 8760 },
]

const INTERVALS = [
    { label: "2s", value: 2000 },
    { label: "5s", value: 5000 },
]

const POLL_LIMIT = 200
const HIGHLIGHT_MS = 6000

export async function loader(): Promise<{
    generation: GenerationData[]
    detections: DetectionData[]
}> {
    const server = new Server()
    try {
        const [generation, detections] = await Promise.all([
            server.getRecentGeneration(POLL_LIMIT),
            server.getDetections(true),
        ])
        return { generation, detections }
    } catch (error) {
        console.error("Dashboard loader error:", error)
        return { generation: [], detections: [] }
    }
}

export default function Home() {
    const initial = useLoaderData<typeof loader>()

    const [generation, setGeneration] = useState<GenerationData[]>(initial.generation)
    const [detections, setDetections] = useState<DetectionData[]>(initial.detections)
    const [live, setLive] = useState(true)
    const [windowSize, setWindowSize] = useState(48)
    const [metricKey, setMetricKey] = useState<MetricKey>("GB_GBN_solar_generation_actual")
    const [intervalMs, setIntervalMs] = useState(4000)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [mounted, setMounted] = useState(false)
    const [newIds, setNewIds] = useState<Set<string>>(new Set())

    // Trace IDs we have already shown, so only genuinely new anomalies flash.
    const seenRef = useRef<Set<string>>(
        new Set(initial.detections.map((detection) => detection.trace_id)),
    )

    // Recharts is client-only; render it only after mount to avoid an SSR
    // hydration mismatch.
    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!live) return
        const server = new Server()
        let cancelled = false

        async function poll() {
            try {
                const [generationRows, detectionRows] = await Promise.all([
                    server.getRecentGeneration(POLL_LIMIT),
                    server.getDetections(true),
                ])
                if (cancelled) return
                setGeneration(generationRows)
                setDetections(detectionRows)
                setLastUpdated(new Date())

                const fresh = detectionRows.filter(
                    (detection) => !seenRef.current.has(detection.trace_id),
                )
                if (fresh.length > 0) {
                    fresh.forEach((detection) => seenRef.current.add(detection.trace_id))
                    const freshIds = fresh.map((detection) => detection.trace_id)
                    setNewIds((previous) => {
                        const next = new Set(previous)
                        freshIds.forEach((id) => next.add(id))
                        return next
                    })
                    setTimeout(() => {
                        if (cancelled) return
                        setNewIds((previous) => {
                            const next = new Set(previous)
                            freshIds.forEach((id) => next.delete(id))
                            return next
                        })
                    }, HIGHLIGHT_MS)
                }
            } catch (error) {
                console.error("Dashboard poll failed:", error)
            }
        }

        poll()
        const timer = setInterval(poll, intervalMs)
        return () => {
            cancelled = true
            clearInterval(timer)
        }
    }, [live, intervalMs])

    const windowData = useMemo(
        () => generation.slice(-windowSize),
        [generation, windowSize],
    )

    const anomalyTimestamps = useMemo(() => {
        const set = new Set<number>()
        for (const detection of detections) {
            set.add(new Date(detection.date_time).getTime())
        }
        return set
    }, [detections])

    const activeMetric = METRICS.find((metric) => metric.key === metricKey)!
    const latest = windowData.length > 0 ? windowData[windowData.length - 1] : null
    const anomaliesInWindow = windowData.filter((row) =>
        anomalyTimestamps.has(new Date(row.utc_timestamp).getTime()),
    ).length

  return (
        <>
                   <h1 className="p-2 text-2xl font-semibold">
                    Dashboard Home
              </h1>
        <div className="flex min-h-screen gap-4 p-6">
  

            <div className="flex min-w-0 flex-1 flex-col gap-4 text-sm">
                {/* Live generation chart */}
                <div className="w-full border-2 border-gray-200 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-medium">{activeMetric.label}</h2>
                        <div className="flex gap-4 text-xs text-gray-600">
                            {latest && (
                                <span>
                                    Latest reading:{" "}
                                    <span className="font-semibold text-gray-900">
                                        {(latest[metricKey] as number)?.toLocaleString()}
                                    </span>
                                </span>
                            )}
                            <span>{windowData.length} readings</span>
        </div>
                    </div>
                    {mounted && windowData.length > 0 ? (
                        <LiveGenerationChart
                            data={windowData}
                            metricKey={metricKey}
                            metricLabel={activeMetric.label}
                            color={activeMetric.color}
                            anomalyTimestamps={anomalyTimestamps}
                        />
                    ) : (
                        <div className="flex h-80 items-center justify-center text-gray-400">
                            {windowData.length === 0
                                ? "Waiting for data…"
                                : "Loading chart…"}
                        </div>
                    )}


                </div>

                {/* Alerts / notifications */}
                <div className="w-full border-2 border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-medium">Alerts & Notifications</h2>
                        <span className="text-xs text-gray-500">
                            {detections.length} total anomalies
                        </span>
                    </div>
                    {detections.length === 0 ? (
                        <p className="text-gray-400">No anomalies detected yet.</p>
                    ) : (
                        <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                            {detections.slice(0, 20).map((detection) => {
                                const isNew = newIds.has(detection.trace_id)
                                return (
                                    <li
                                        key={`${detection.trace_id}-${detection.detector}`}
                                        className={`flex items-center justify-between gap-3 rounded-md border p-2 transition-colors ${
                                            isNew
                                                ? "animate-pulse border-red-300 bg-red-50"
                                                : "border-gray-100"
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate font-mono text-xs text-gray-900">
                                                {detection.date_time}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {detection.detector}
                                                {" · "}
                                                {detection.rule_codes?.length
                                                    ? detection.rule_codes.join(", ")
                                                    : detection.score != null
                                                      ? `score ${detection.score.toFixed(3)}`
                                                      : "—"}
        </div>
      </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            {isNew && (
                                                <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                    NEW
                                                </span>
                                            )}
                                            <Link
                                                to={`/trace/${detection.trace_id}`}
                                                className="text-xs underline"
                                            >
                                                trace
                                            </Link>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
                        {/* Controls */}
            <div className="w-72 shrink-0">
                <div className="flex flex-col gap-5 border-2 border-gray-200 p-4 text-sm">
                    <h2 className="font-semibold">Filters</h2>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-gray-500">Metric</span>
                        <div className="flex flex-col gap-1">
                            {METRICS.map((metric) => (
                                <button
                                    key={metric.key}
                                    type="button"
                                    onClick={() => setMetricKey(metric.key)}
                                    className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors ${
                                        metric.key === metricKey
                                            ? "border-gray-800 bg-gray-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: metric.color }}
                                    />
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-gray-500">
                            Time Window
                        </span>
                        <div className="flex flex-col gap-1">
                            {WINDOWS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setWindowSize(option.value)}
                                    className={`flex-1 rounded-md border px- py-2 text-xs transition-colors ${
                                        option.value === windowSize
                                            ? "border-gray-800 bg-gray-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-gray-500">
                            Refresh rate
                        </span>
                        <div className="flex gap-1">
                            {INTERVALS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setIntervalMs(option.value)}
                                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                                        option.value === intervalMs
                                            ? "border-gray-800 bg-gray-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
        </div>
      </div>
    </div>
    
    </>

  )
}
