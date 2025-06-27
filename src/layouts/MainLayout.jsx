import { useState, memo, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "@/components/Layout/Navigation";
import LeftSidebar from "@/components/Layout/LeftSidebar";
import useChatLogic from "@/hooks/useChatLogic";
import { useAuth } from "@/contexts/AuthContext";
import DialogManager from "@/components/Utils/Dialog/DialogManager";
import { MultiSidebarProvider } from "@/components/ui/multisidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/multisidebar";
import { FolderOpen } from 'lucide-react';

function ChatContent({ chatLogic, isChatPage }) {
    if (!isChatPage || !chatLogic) return <Outlet />;

    return (
        <>
            <LeftSidebar
                sessions={chatLogic.sessions}
                setSessions={chatLogic.setSessions}
                deleteSession={chatLogic.deleteSession}
                currentSessionId={chatLogic.sessionId}
                navigate={chatLogic.navigate}
                onNewSession={() => chatLogic.navigate("/chat")}
            />
            <SidebarInset className="min-w-0 h-screen">
                <Navigation aiModels={chatLogic.aiModels} />
                <Outlet />
            </SidebarInset>
        </>
    );
}

function SidebarTriggerWrapper({ hasFiles }) {
    return (
        <SidebarTrigger
            side="right"
            variant="storefront"
            showOn="tablet-and-below"
            aria-label="Toggle file sidebar"
            className="bg-sidebar gap-2.5 !px-3 py-5 absolute top-1/2 right-0 rounded-s-lg rounded-r-none border border-r-0 my-auto h-fit w-fit z-20"
        >
            <FolderOpen className="!w-6 !h-6 text-primary" />
            {hasFiles.length > 0 && (
                <span className="absolute top-4 right-3 w-2.5 h-2.5 bg-primary rounded-full border" aria-label={`${hasFiles.length} files available`} />
            )}
        </SidebarTrigger>
    );
}

const MemoizedChatContent = memo(ChatContent);

export default function MainLayout() {
    const location = useLocation();
    const { token } = useAuth();
    const [open, setOpen] = useState(true);
    const isChatPage = location.pathname.startsWith("/chat") || location.pathname === "/";
    const chatLogic = isChatPage && token ? useChatLogic(token) : null;
    const hasFiles = useMemo(
        () => Array.isArray(chatLogic?.files) ? chatLogic.files : [],
        [chatLogic?.files]
    );

    return (
        <MultiSidebarProvider rightOpen={open} onRightOpenChange={setOpen} rightMobileBehaviorOnTablet={true}>
            <MemoizedChatContent chatLogic={chatLogic} isChatPage={isChatPage} />
            <SidebarTriggerWrapper hasFiles={hasFiles} />
            <DialogManager />
        </MultiSidebarProvider>
    );
}