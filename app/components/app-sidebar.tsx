import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    } from "./ui/sidebar";

export function AppSidebar() {

    return (
        <>
        <Sidebar>
            <SidebarHeader className="text-center">
                <h2 className="text-lg pt-2 font-bold">Main Menu</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup title="Navigation" className="pt-2">
                    <a href="/" className="block py-2 px-4 hover:bg-gray-200">Dashboard</a>
                    <a href="/data" className="block py-2 px-4 hover:bg-gray-200">All Data</a>
                    <a href="/anomalies" className="block py-2 px-4 hover:bg-gray-200">Anomalies</a>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <p className="text-sm text-gray-500">&copy; 2026 Energy Data App</p>
            </SidebarFooter>
        </Sidebar>
        </>
    );
}