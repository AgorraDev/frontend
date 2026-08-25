import { Server, type DetectionData } from "../lib/server"
import { detectionColumns } from "~/components/ui/dt-detection-colums";
import DataTable from "~/components/ui/data-table";
import { useLoaderData } from "react-router";
import { useSidebar } from "~/components/ui/sidebar";

export async function loader(): Promise<DetectionData[]> {
    try {
        return await new Server().getDetections(true);
    } catch (error) {
        console.error("Error fetching anomaly data:", error);
        return [];
    }
}

function StatTile({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex-col text-center border rounded-md border-gray-200 gap-2 p-4 min-w-32">
            <h2 className="font-medium">{label}</h2>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    );
}

export default function Anomalies() {
    const data = useLoaderData<typeof loader>();
    const { open } = useSidebar();

    const ruleAnomalies = data.filter(d => d.detector === "basic-rules");
    const iforestAnomalies = data.filter(d => d.detector === "isolation-forest");
    const widthClass = open ? "max-w-10/12" : "max-w-full";

    return (
        <div className="flex min-h-svh p-6">

            <div className="min-w-0 flex-col gap-4 text-sm leading-loose">
                <h1 className="text-2xl font-medium">Detected Anomalies</h1>

                <div className="flex gap-4 mt-4">
                    <StatTile label="Total" value={data.length} />
                    <StatTile label="Rule-based" value={ruleAnomalies.length} />
                    <StatTile label="Isolation Forest" value={iforestAnomalies.length} />
                </div>

                <h1 className="mt-8 text-2xl font-medium">Rule Engine</h1>
                <div className={`flex ${widthClass} mt-4 max-h-100 transition-all duration-300`}>
                    {ruleAnomalies.length > 0 ?
                        <DataTable columns={detectionColumns} data={ruleAnomalies} />
                        : <p>No rule-based anomalies</p>}
                </div>
            
               <h1 className="mt-8 text-2xl font-medium">Isolation Forest</h1>
                <div className={`flex ${widthClass} mt-4 max-h-100 transition-all duration-300`}>
                    {iforestAnomalies.length > 0 ?
                        <DataTable columns={detectionColumns} data={iforestAnomalies} />
                        : <p>No isolation forest anomalies</p>}
                </div>
            </div>
        </div>
    )
}