import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
        index("routes/home.tsx"), 
        route("data", "routes/data.tsx"),
        route("anomalies", "routes/anomalies.tsx"),
        route("trace/:traceId", "routes/trace-detail.tsx"),
    ] satisfies RouteConfig;
