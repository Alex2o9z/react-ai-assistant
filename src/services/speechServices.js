const audioStore = new Map();

export const storeAudio = (key, file) => {
    if (!(file instanceof Blob) && !(file instanceof File)) {
        throw new Error(`Invalid file type for key ${key}: Expected Blob or File, got ${typeof file}`);
    }
    if (audioStore.size > 50) {
        const oldestKey = audioStore.keys().next().value;
        clearAudio(oldestKey);
    }
    const audioUrl = URL.createObjectURL(file);
    audioStore.set(key, audioUrl);
    return audioUrl;
};

export const getAudio = (key) => {
    return audioStore.get(key);
};

export const clearAudio = (key) => {
    const url = audioStore.get(key);
    if (url) {
        URL.revokeObjectURL(url);
        audioStore.delete(key);
    }
};

export const clearAllAudio = () => {
    for (const url of audioStore.values()) {
        URL.revokeObjectURL(url);
    }
    audioStore.clear();
};

export const dataUrlToBlob = (data, isRawBase64 = false) => {
    try {
        let mime = "audio/wav";
        let base64 = data;

        if (!isRawBase64) {
            const [header, base64Data] = data.split(",");
            mime = header.match(/:(.*?);/)?.[1] || "audio/wav";
            base64 = base64Data;
        }

        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: mime });
    } catch (err) {
        console.error("Error converting data to Blob:", err);
        return null;
    }
};