import { Server, type TraceEventOut } from "../lib/server";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/trace-detail";

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
            {events.length === 0 ? (
                <p>No trace events found for this reading.</p>
            ) : (
                <ol>
                    {events.map((e, i) => (
                        <li key={i}>
                            <p className="font-bold text-xl capitalize">{e.stage}</p>
                            <p>Status: {e.status}</p>
                            {e.stage === 'validation_failed' ? (
                                <p>Data failed passing from sensor to system.</p>
                            ) : ( null )}
                            <div>
                                
                                <p>Timestamp: {e.created_at} </p>
                                <p>Source: {e.source ? `${e.source}` : ""}</p>
                                <p>Details:
                                {e.details && Object.entries(e.details).map(([key, value]) =>(
                                    <p key={key} className="capitalize">
                                        {key} : {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </p>
                                ))}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}