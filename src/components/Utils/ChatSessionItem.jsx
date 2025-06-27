import { useState, memo, useCallback } from 'react';
import { Link } from "react-router-dom";
import { MoreHorizontal } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuAction } from '@/components/ui/multisidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import ConfirmDialog from '@/components/Utils/Dialog/ConfirmDialog';
import useDialogStore from '@/stores/dialogStore';

const formatSessionTitle = (session) => {
    const formattedDate = new Date(session.createdAt).toLocaleString();
    return session.title || `Chat ${formattedDate}`;
};

const ChatSessionItem = memo(({ session, isSelected, onDelete }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { openDialog } = useDialogStore();
    const displayTitle = formatSessionTitle(session);

    const handleDeleteClick = useCallback(() => {
        setOpenConfirm(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            await onDelete(session.sessionId);
        } finally {
            setIsDeleting(false);
            setOpenConfirm(false);
        }
    }, [onDelete, session.sessionId]);

    const handleShowMessage = useCallback(() => {
        openDialog(`message-${session.sessionId}`, 'message', {
            title: 'Session Info',
            message: `Details for session: ${session.title || `Chat ${new Date(session.createdAt).toLocaleString()}`}`,
            onClose: () => { },
        });
    }, [openDialog, session.sessionId, session.title, session.createdAt]);

    return (
        <div className={`group/session`}>
            <SidebarMenuButton asChild isActive={isSelected}>
                <Link to={`/chat/${session.sessionId}`}>
                    <span>{session.title || `Chat ${new Date(session.createdAt).toLocaleString()}`}</span>
                </Link>
            </SidebarMenuButton>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className={`xl:invisible xl:group-hover/session:visible`}>
                        <MoreHorizontal className="text-gray-500" />
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem onSelect={handleDeleteClick}>
                        <span>Delete Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleShowMessage}>
                        <span>View Details</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDialog
                open={openConfirm}
                title="Delete Session"
                description={`Are you sure you want to delete "${displayTitle}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenConfirm(false)}
                confirmButtonProps={{ disabled: isDeleting }}
            />
        </div>
    );
});

export default ChatSessionItem;