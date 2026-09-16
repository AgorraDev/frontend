import { Server, type TraceEventOut } from "../lib/server";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/trace-detail";
import DataTable from "~/components/ui/data-table";
import { traceColumns } from "~/components/ui/dt-trace-columns";

export async function loader({ params }: Route.LoaderArgs): Promise<TraceEventOut[]> {
    try {
        return await new Server().getTraceDetails(params.traceId);
    } catch (error) {
        console.error("Error fetching trace data", error);
        return []
    }   
}

export default function TraceDetail() {
    const events = useLoaderData<typeof loader>();
    const { traceId } = useLoaderData<typeof loader>() ? {} as any : {};

    console.log(events)
    return (
        <div>
            <h1 className="font-bold">Trace Chain</h1>
            <p></p>
            <DataTable columns={traceColumns} data={events} />
        </div>
    );
}