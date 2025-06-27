import PropTypes from "prop-types";
import { useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { FileText, FileAudio2, X, MoreHorizontal } from "lucide-react";
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/Utils/Dialog/ConfirmDialog';
import useDialogStore from '@/stores/dialogStore';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from '@/components/ui/multisidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const FileUploaded = ({ sessionId, currentState, className, fileId, fileName, onDelete, onFullScript, onSummarize, disabled }) => {

    const [openConfirm, setOpenConfirm] = useState(false);
    const { openDialog } = useDialogStore();

    const handleDeleteClick = useCallback(() => {
        setOpenConfirm(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        onDelete(fileId);
        setOpenConfirm(false);
    }, [onDelete, fileId]);

    const handleShowMessage = useCallback(() => {
        openDialog(`message-${sessionId}`, 'message', {
            title: 'File Info',
            message: `Details for ${fileName}:`,
            onClose: () => { },
        });
    }, [openDialog, sessionId, fileName]);

    const handleFullScript = useCallback(async () => {
        try {
            const response = await onFullScript(fileName);
            if (response) {
                console.log("Đã lấy full script thành công!");
            } else {
                openDialog('error', 'error', {
                    title: 'Error',
                    message: 'Lỗi khi lấy full script.',
                    onClose: () => { },
                });
            }
        } catch (error) {
            openDialog('error', 'error', {
                title: 'Error',
                message: 'Lỗi khi lấy full script.',
                onClose: () => { },
            });
        }
    }, [onFullScript, fileName, openDialog]);

    const handleSummarize = useCallback(async () => {
        try {
            const response = await onSummarize(fileName);
            if (response) {
                console.log("Đã tóm tắt nội dung thành công!");
            } else {
                openDialog('error', 'error', {
                    title: 'Error',
                    message: 'Lỗi khi tóm tắt nội dung.',
                    onClose: () => { },
                });
            }
        } catch (error) {
            openDialog('error', 'error', {
                title: 'Error',
                message: 'Lỗi khi tóm tắt nội dung.',
                onClose: () => { },
            });
        }
    }, [onSummarize, fileName, openDialog]);

    return (
        <SidebarMenu className={`group/file`}>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link className={`flex flex-col items-start gap-2.5 relative w-full h-fit hover:bg-blue-50 ${className}`} asChild>
                        <div className="flex items-start gap-2 relative self-stretch w-full">
                            {currentState === "default" ? (
                                <FileText className="w-10 h-10 text-primary" />
                            ) : (
                                <FileAudio2 className="w-10 h-10 text-primary" />
                            )}
                            <div className="flex flex-col items-start gap-1 w-full relative flex-1 grow min-w-0">
                                <div className="relative w-full mt-[-1.00px] pr-4 font-bold text-accent-foreground text-base tracking-[-0.11px] leading-[22px] truncate">
                                    {fileName || (currentState === "audio-URL" ? "FileName.wav" : "FileName.pdf")}
                                </div>
                                {/* <div className="relative w-fit font-medium text-accent-foreground text-xs tracking-[-0.06px] leading-4 whitespace-nowrap">
                                    2,5gb&nbsp;&nbsp;•&nbsp;&nbsp;docx&nbsp;&nbsp;•&nbsp;&nbsp;1 min left
                                </div> */}
                            </div>

                            {/* <button
                    onClick={() => handleDelete(fileId)}
                    className="hidden group-hover:!block absolute right-0 top-0 p-1 rounded-full border border-[#6abfe7] bg-white hover:bg-gray-100"
                    disabled={disabled}
                >
                    <X className="w-3 h-3 text-primary" />
                </button> */}
                        </div>

                        {currentState === "audio-URL" && (onFullScript || onSummarize) && (
                            <div className="inline-flex flex-wrap items-start gap-[4px_4px] relative">
                                {onFullScript && (
                                    <Button
                                        onClick={handleFullScript}
                                        disabled={disabled}
                                        size="sm"
                                        className="text-xs text-white rounded-xl"
                                    >
                                        Full script
                                    </Button>
                                )}
                                {onSummarize && (
                                    <Button
                                        onClick={handleSummarize}
                                        disabled={disabled}
                                        size="sm"
                                        className="text-xs text-white rounded-xl"
                                    >
                                        Summarize
                                    </Button>
                                )}
                            </div>
                        )}
                    </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction className={`xl:invisible xl:group-hover/file:visible`}>
                            <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem onSelect={handleDeleteClick}>
                            <span>Delete file</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleShowMessage}>
                            <span>View Details</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmDialog
                    open={openConfirm}
                    title="Delete File"
                    description={`Are you sure you want to delete "${fileName || `No Name File`}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setOpenConfirm(false)}
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

FileUploaded.propTypes = {
    currentState: PropTypes.oneOf(["default", "audio-URL"]).isRequired,
    className: PropTypes.string,
    fileId: PropTypes.string,
    fileName: PropTypes.string,
    onDelete: PropTypes.func,
};