import { useState } from "react";
import { TaskMarkerTable } from "./TaskMarkerTable";
import TaskLinesTable from "./TaskLinesTable";
import ExtraTasksTable from "./ExtraTasksTable";
import { useTaskStore } from "../../globalState/taskStorageLegacy";

export const MapActionsTable = () => {
    const [activeTab, setActiveTab] = useState<"marker" | "lines" | "extra">("marker");

    const { extraTasks } = useTaskStore()
    console.log("🚀 ~ MapActionsTable ~ extraTasks:", extraTasks)

    return (
        <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Map Actions</h2>

            <div className="flex space-x-2 mb-4 border-b">
                <button
                    onClick={() => setActiveTab("marker")}
                    className={`px-4 py-2 text-sm border-b-2 ${activeTab === "marker" ? "border-black font-semibold" : "border-transparent text-gray-500"}`}
                >
                    Task Marker
                </button>
                <button
                    onClick={() => setActiveTab("lines")}
                    className={`px-4 py-2 text-sm border-b-2 ${activeTab === "lines" ? "border-black font-semibold" : "border-transparent text-gray-500"}`}
                >
                    Task Lines
                </button>
                <button
                    onClick={() => setActiveTab("extra")}
                    className={`px-4 py-2 text-sm border-b-2 ${activeTab === "extra" ? "border-black font-semibold" : "border-transparent text-gray-500"}`}
                >
                    Extra Tasks
                </button>
            </div>

            {activeTab === "marker" && <TaskMarkerTable />}
            {activeTab === "lines" && <TaskLinesTable />}
            {activeTab === "extra" && <ExtraTasksTable />}
        </div>
    );
};
