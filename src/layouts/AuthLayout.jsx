import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <Outlet /> {/* Render Login / Register */}
        </div>
    );
}