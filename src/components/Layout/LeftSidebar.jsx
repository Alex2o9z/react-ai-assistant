import { memo, useMemo } from 'react';
import { Bot, PencilLine, ChevronDown } from 'lucide-react';
import ChatSessionItem from '@/components/Utils/ChatSessionItem';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
    SidebarRail,
} from '@/components/ui/multisidebar';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible';
import { format, isToday, isYesterday, isThisWeek, isThisYear, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';


export default function LeftSidebar({ sessions, currentSessionId, navigate, onNewSession, deleteSession, setSessions }) {
    const handleDeleteSession = async (sessionId) => {
        const success = await deleteSession(sessionId);
        if (success) {
            setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        }
    };

    const normalizedSessions = sessions
        .map((s) => ({
            ...s,
            sessionId: s.session_id,
            createdAt: new Date(s.created_at),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

    const groupedSessions = useMemo(() => {
        const groups = {
            today: [],
            yesterday: [],
            thisWeek: [],
            thisMonth: {},
            older: {},
        };
        normalizedSessions.forEach((session) => {
            const date = session.createdAt;
            if (isToday(date)) {
                groups.today.push(session);
            } else if (isYesterday(date)) {
                groups.yesterday.push(session);
            } else if (isThisWeek(date, { weekStartsOn: 1 })) {
                groups.thisWeek.push(session);
            } else if (isThisYear(date)) {
                const month = format(date, 'MMMM', { locale: vi });
                groups.thisMonth[month] = groups.thisMonth[month] || [];
                groups.thisMonth[month].push(session);
            } else {
                const year = format(date, 'yyyy', { locale: vi });
                groups.older[year] = groups.older[year] || [];
                groups.older[year].push(session);
            }
        });
        return groups;
    }, [normalizedSessions]);

    const renderGroup = (label, sessions) => (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        {label}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sessions.map((item) => (
                                <SidebarMenuItem key={item.sessionId}>
                                    <ChatSessionItem
                                        session={item}
                                        isSelected={currentSessionId === item.sessionId}
                                        onDelete={handleDeleteSession}
                                        navigate={navigate}
                                    />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );


    return (
        <Sidebar side="left">
            <SidebarHeader className="border-sidebar-border h-16 border-b">
                <SidebarMenuButton size="lg" asChild>
                    <a href="#">
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <Bot className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-xl leading-tight">
                            <span className="truncate font-extrabold">{import.meta.env.VITE_APP_NAME}</span>
                        </div>
                    </a>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="overflow-visible">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Button onClick={onNewSession} aria-label="Create new Chat session" className="text-white">
                                        <PencilLine />
                                        <span>New Chat</span>
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* <SidebarSeparator /> */}
                {groupedSessions.today.length > 0 && renderGroup('Today', groupedSessions.today)}
                {groupedSessions.yesterday.length > 0 && renderGroup('Yesterday', groupedSessions.yesterday)}
                {groupedSessions.thisWeek.length > 0 && renderGroup('This week', groupedSessions.thisWeek)}
                {Object.keys(groupedSessions.thisMonth).map((month) => (
                    groupedSessions.thisMonth[month].length > 0 && (
                        <Collapsible key={month} defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        {month}
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {groupedSessions.thisMonth[month].map((item) => (
                                                <SidebarMenuItem key={item.sessionId}>
                                                    <ChatSessionItem
                                                        session={item}
                                                        isSelected={currentSessionId === item.sessionId}
                                                        onDelete={handleDeleteSession}
                                                        navigate={navigate}
                                                    />
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    )
                ))}
                {Object.keys(groupedSessions.older).map((year) => (
                    groupedSessions.older[year].length > 0 && (
                        <Collapsible key={year} defaultOpen className="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        {year}
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {groupedSessions.older[year].map((item) => (
                                                <SidebarMenuItem key={item.sessionId} className={`group/session`}>
                                                    <ChatSessionItem
                                                        session={item}
                                                        isSelected={currentSessionId === item.sessionId}
                                                        onDelete={handleDeleteSession}
                                                        navigate={navigate}
                                                    />
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    )
                ))}
            </SidebarContent>
            <SidebarRail side="left" />
        </Sidebar>
    );
}