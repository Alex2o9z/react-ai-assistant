import React, { useEffect, useState } from "react";
import { KeyRound, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useDialogStore from '@/stores/dialogStore';
import useApiKeyStore from '@/stores/apiKeyStore';
import { ModeToggle } from '@/components/Utils/ModeToggle'

import { SidebarTrigger } from "@/components/ui/multisidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navigation({ aiModels, setAIModels }) {
    const { openDialog } = useDialogStore();
    const { selectedModel, setSelectedModel, apiKeys } = useApiKeyStore();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const groupedModels = aiModels.reduce((acc, model) => {
        acc[model.group] = acc[model.group] || [];
        acc[model.group].push(model);
        return acc;
    }, {});

    const handleOpenApiKeyDialog = (model) => {
        openDialog(`api-key-${model.model}`, 'input-api-key', {
            model: model,
            defaultValue: apiKeys[model.group] || '',
            onSave: (value) => console.log(`API Key saved for ${model.group}:`, value),
            onClose: () => { },
        });
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    return (
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-2 sm:px-4 lg:px-6 xl:px-8 z-50 shadow-sm transition-shadow duration-300">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">

                {/* Left Sidebar trigger */}
                <SidebarTrigger side="left" aria-label="Toggle sidebar" />

                {/* Navigation Menu for larger screens */}
                <NavigationMenu viewport={false} className="z-49">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="font-medium text-xs sm:text-sm lg:text-base">
                                AI Model: {selectedModel?.title || "Select Model"}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className={`absolute`}>
                                <ul className="grid p-2 gap-3 lg:gap-4">
                                    <li>
                                        <ScrollArea className="max-h-75 lg:max-h-100">
                                            {Object.keys(groupedModels).map((group, index) => (
                                                <div key={group} className="mb-4">
                                                    <h4 className="mb-2 text-xs sm:text-sm font-medium capitalize">{group}</h4>
                                                    {groupedModels[group].map((model) => (
                                                        <NavigationMenuLink
                                                            key={model.model}
                                                            onClick={() => handleModelSelect(model)}
                                                            // className={selectedModel?.model === model.model ? 'bg-gray-200' : ''}
                                                            asChild>
                                                            <Link to="#" className="flex-row items-center justify-between text-xs sm:text-sm" aria-label={`Select ${model.title} model`}>
                                                                {model.title}
                                                                <button
                                                                    onClick={() => handleOpenApiKeyDialog(model)}
                                                                    aria-label={`Set API key for ${model.title}`}
                                                                    className="p-1"
                                                                >
                                                                    <KeyRound className="h-5 w-5 text-gray-500" />
                                                                </button>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    ))}
                                                    {index < Object.keys(groupedModels).length - 1 && (
                                                        <Separator className="my-2" />
                                                    )}
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        {/* <NavigationMenuItem>
                            <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Components</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Documentation</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Blocks</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem> */}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <ModeToggle className={`rounded-full`} />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className={`md:w-9 md:h-9`}>
                            <AvatarImage src="/images/user-avatar.svg" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem >
                            <Link to="#" onClick={handleLogout} className="flex flex-row gap-2 items-center w-full">
                                <LogOut className="h-4 w-4 text-gray-500" />
                                <span>Logout</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}