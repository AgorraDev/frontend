
import  { type GenerationData } from "~/components/ui/dt-generation-columns";
import { type WeatherData } from "~/components/ui/dt-weather-columns";
import Anomalies from "~/routes/anomalies";

export type TraceEventOut = {
        stage: string;
        status: string;
        source: string | null;
        details: any;
        created_at: string;
}
export type DetectionData = {
        trace_id: string;
        detector: string;
        detector_version: string;
        source: string;
        date_time: string;
        anomaly: boolean;
        score: number | null
        rule_codes: string[];
        details: any;
        created_at: string;
}

export class Server {
    baseURL = 'http://127.0.0.1:8000';

    async getWeatherData(): Promise<WeatherData[]> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/weather`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request Failed with status: ${response.status}`);
            }
            const data: WeatherData[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching message:", error);
            throw error;
        }
    }

    async getGenerationData(): Promise<GenerationData[]> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/generation`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request Failed with status: ${response.status}`);
            }
            const data: GenerationData[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching generation data:", error);
            throw error;
        }
    }

    // Returns the most recent `limit` generation readings, ordered oldest to
    // newest for charting. Sorts and slices client-side so it works whether or
    // not the backend honours the limit/order query params.
    async getRecentGeneration(limit = 200): Promise<GenerationData[]> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/generation?limit=${limit}&order=desc`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request Failed with status: ${response.status}`);
            }
            const data: GenerationData[] = await response.json();
            data.sort(
                (a, b) =>
                    new Date(a.utc_timestamp).getTime() - new Date(b.utc_timestamp).getTime(),
            );
            return data.slice(-limit);
        } catch (error) {
            console.error("Error fetching recent generation:", error);
            throw error;
        }
    }

    async getAnomaliesData(): Promise<any> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/anomaly_log`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request Failed with status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching anomaly data:", error);
            throw error;
        }
    }


    async getTraceDetails(traceId: string): Promise<TraceEventOut[]> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/trace/${traceId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request failed with status: ${response.status}`)
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching anomaly data:", error);
            throw error
        }
    }

    async getDetections(anomaliesOnly = true): Promise<DetectionData[]> {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/react/detections?anomalies_only=${anomaliesOnly}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Request failed with status: ${response.status}`);
            }
            return await response.json() as DetectionData[];
        } catch (error) {
            console.error("Error fetching detections:", error);
            throw error
        }
    }
}