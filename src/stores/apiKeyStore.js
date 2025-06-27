import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useApiKeyStore = create(
    persist(
        (set) => ({
            selectedModel: null,
            apiKeys: {},
            setSelectedModel: (model) => set({ selectedModel: model }),
            setApiKey: (group, key) =>
                set((state) => ({
                    apiKeys: { ...state.apiKeys, [group]: key },
                })),
            clearApiKey: (group) =>
                set((state) => {
                    const newApiKeys = { ...state.apiKeys };
                    delete newApiKeys[group];
                    return { apiKeys: newApiKeys };
                }),
            logout: () =>
                set({
                    selectedModel: null,
                    apiKeys: {},
                }),
        }),
        {
            name: 'api-key-store',
            storage: {
                getItem: (name) => {
                    const value = sessionStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
                removeItem: (name) => sessionStorage.removeItem(name),
            },
        }
    )
);

export default useApiKeyStore;