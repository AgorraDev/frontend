import { Server } from "../lib/server"
import { weatherColumns, type WeatherData } from "~/components/ui/dt-weather-columns";
import { generationColumns, type GenerationData } from "~/components/ui/dt-generation-columns";
import { useLoaderData } from "react-router";
import { useSidebar } from "~/components/ui/sidebar";
import DataTable from "~/components/ui/data-table";


export async function loader(): Promise<{ weatherData: WeatherData[]; generationData: GenerationData[] } > {
    try {
        var weatherData = await new Server().getWeatherData() as WeatherData[];
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return { weatherData: [], generationData: [] };
    }
    try {
        var generationData = await new Server().getGenerationData() as GenerationData[];
    } catch (error) {
        console.error("Error fetching generation data:", error);
        return { weatherData: [], generationData: [] };
    }
    
    return { weatherData, generationData };

}

export default function Test() {
    const { weatherData, generationData } = useLoaderData<typeof loader>();
    console.log(generationData);
    const { open } = useSidebar();

  return (
    <div className="flex min-h-svh w-full p-6">
      <div className="min-w-0 flex flex-col gap-4 leading-loose">

        <h1>Currently reading Postgresql data for weather and generation information.</h1>
        <div>
            <h1 className="text-2xl font-bold">Weather Data</h1>
        </div>
        
        <div className={`flex ${open ? 'w-12/12' : 'max-w-full' } mt-4 max-h-100 transition-all duration-300`}> 
            {weatherData.length > 0 ? (
                <DataTable columns={weatherColumns} data={weatherData} />
            ) : (
                <p>No weather data recieved from server.</p>
            )}
        </div>

        <div>
            <h1 className="text-2xl font-bold">Generation Data</h1>
        </div>

        <div className={`flex ${open ? 'w-12/12' : 'max-w-full' } mt-4 max-h-100 transition-all duration-300`}> 
            {generationData.length > 0 ? (
                <DataTable columns={generationColumns} data={generationData} />
            ) : (
                <p>No generation data recieved from server.</p>
            )}
        </div>
      </div>
    </div>
  )
}