import { useEffect } from 'react';
import useDialogStore from '@/stores/dialogStore';
import ConfirmDialog from '@/components/Utils/Dialog/ConfirmDialog';
import InputApiKeyDialog from '@/components/Utils/Dialog/InputApiKeyDialog';
import MessageDialog from '@/components/Utils/Dialog/MessageDialog';

const DialogManager = () => {
    const { dialogs, closeDialog } = useDialogStore();

    return (
        <>
            {Object.entries(dialogs).map(([id, { type, props, open }]) => {
                if (!open) return null;
                switch (type) {
                    case 'confirm':
                        return (
                            <ConfirmDialog
                                key={id}
                                open={open}
                                title={props.title}
                                description={props.description}
                                onConfirm={props.onConfirm}
                                onCancel={() => {
                                    props.onCancel?.();
                                    closeDialog(id);
                                }}
                            />
                        );
                    case 'input-api-key':
                        return (
                            <InputApiKeyDialog
                                key={id}
                                open={open}
                                value={props.value}
                                model={props.model}
                                defaultValue={props.defaultValue}
                                onSave={props.onSave}
                                onClose={() => {
                                    props.onClose?.();
                                    closeDialog(id);
                                }}
                            />
                        );
                    case 'message':
                        return (
                            <MessageDialog
                                key={id}
                                open={open}
                                title={props.title}
                                message={props.message}
                                onClose={() => {
                                    props.onClose?.();
                                    closeDialog(id);
                                }}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
};

export default DialogManager;