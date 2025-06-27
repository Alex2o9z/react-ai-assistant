import { useState, useEffect, useRef, useMemo } from "react";
import { FileUploaded } from "@/components/Utils/FileUploaded";
import { FolderOpen } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarRail,
} from "@/components/ui/multisidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useFileActions } from "@/hooks/useFileActions";
import { isDocumentFile, isAudioVideoUrl } from "@/lib/fileUtils";

const useActiveTab = (documentFiles, audioVideoFiles) => {
    const [activeTab, setActiveTab] = useState("documents");

    useEffect(() => {
        if (documentFiles.length === 0 && audioVideoFiles.length > 0) {
            setActiveTab("audio");
        } else {
            setActiveTab("documents");
        }
    }, [documentFiles, audioVideoFiles]);

    return [activeTab, setActiveTab];
};

const FileList = ({ sessionId, files, deleteFile, isFetching, audioAction }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const safeFiles = Array.isArray(files) ? files : [];
    const { handleFullScript, handleSummarize } = useFileActions(audioAction);

    // Categorize files
    const documentFiles = useMemo(
        () => safeFiles.filter((file) => isDocumentFile(file.file_name)),
        [safeFiles]
    );
    const audioVideoFiles = useMemo(
        () => safeFiles.filter((file) => isAudioVideoUrl(file.file_name)),
        [safeFiles]
    );

    const [activeTab, setActiveTab] = useActiveTab(documentFiles, audioVideoFiles);

    const prevFilesCountRef = useRef(safeFiles.length);

    useEffect(() => {
        if (safeFiles.length > prevFilesCountRef.current && !isSidebarOpen) {
            setSidebarOpen(true);
        }
        prevFilesCountRef.current = safeFiles.length;
    }, [safeFiles.length, isSidebarOpen]);

    const renderFileList = useMemo(() => {
        return (fileList, isAudioVideo = false) => {
            if (fileList.length === 0) {
                return <p className="w-full px-6 py-4 text-center text-gray-500">Empty</p>;
            }
            return (
                <div className="flex flex-col w-full items-start relative">
                    {fileList.map((file) => (
                        <FileUploaded
                            key={file.file_id}
                            sessionId={sessionId}
                            currentState={isAudioVideo ? "audio-URL" : "default"}
                            fileId={file.file_id}
                            fileName={file.file_name}
                            onDelete={deleteFile}
                            onFullScript={isAudioVideo ? handleFullScript : undefined}
                            onSummarize={isAudioVideo ? handleSummarize : undefined}
                            disabled={isFetching}
                        />
                    ))}
                </div>
            );
        };
    }, [sessionId, deleteFile, isFetching, handleFullScript, handleSummarize]);

    return (
        <Sidebar side="right" className="mt-16">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className={`w-full`}>
                                <TabsTrigger value="documents">
                                    Documents
                                    <Badge variant="secondary">{documentFiles.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="audio">
                                    Audio/Video
                                    <Badge variant="secondary">{audioVideoFiles.length}</Badge>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="documents">
                                {renderFileList(documentFiles)}
                                {isFetching && (
                                    <div className="inline-flex flex-col items-start relative">
                                        <span className="text-gray-500">Loading...</span>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="audio">
                                {renderFileList(audioVideoFiles, true)}
                                {isFetching && (
                                    <div className="inline-flex flex-col items-start relative">
                                        <span className="text-gray-500">Loading...</span>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail
                side="right"
                className="group-data-[collapsible=offcanvas]:!-left-0 w-fit h-fit my-auto"
                // className="w-fit h-fit my-auto"
                asChild
            >
                <button className="inline-flex items-center justify-center bg-sidebar gap-2.5 px-3 py-5 absolute top-0 right-0 -left-14 rounded-s-lg border border-r-0">
                    <FolderOpen className="!w-6 !h-6 text-primary" />
                    {/* <Badge className={`absolute top-2 right-2`} variant="destructive">{safeFiles.length}</Badge> */}
                    {safeFiles.length > 0 && (
                        <span className="absolute top-4 right-3 w-2.5 h-2.5 bg-primary rounded-full border" />
                    )}
                </button>
            </SidebarRail>
        </Sidebar>
    );
};

export default FileList;