import { create } from 'zustand';

const useDialogStore = create((set) => ({
    dialogs: {},
    openDialog: (id, type, props) =>
        set((state) => ({
            dialogs: { ...state.dialogs, [id]: { type, props, open: true } },
        })),
    closeDialog: (id) =>
        set((state) => ({
            dialogs: { ...state.dialogs, [id]: { ...state.dialogs[id], open: false } },
        })),
}));

export default useDialogStore;