export async function uploadFile(files, sessionId, fetchWithAuth, fetchFiles, selectedModel, apiKeys) {
    const provider = selectedModel.group;
    const model = selectedModel.model;
    const api_key = apiKeys[provider];

    const formData = new FormData();
    formData.append("session_id", sessionId);
    // Thêm từng file vào FormData với key "files"
    files.forEach((file) => formData.append("files", file));
    formData.append("provider", provider);
    formData.append("model", model);
    formData.append("api_key", api_key);

    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/upload-file`, {
            method: "POST",
            body: formData,
        });

        if (!response || !response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        fetchFiles(sessionId); // Refresh danh sách file
        return { success: true, data };
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
    }
}

export async function uploadAudio(file, sessionId, fetchWithAuth, fetchFiles, youtubeUrl = "", query = "", selectedModel, apiKeys) {
    const provider = selectedModel.group;
    const model = selectedModel.model;
    const api_key = apiKeys[provider];
    const formData = new FormData();
    formData.append("session_id", sessionId);
    if (file) formData.append("file", file);
    if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
    if (query) formData.append("query", query);
    formData.append("provider", provider);
    formData.append("model", model);
    formData.append("api_key", api_key);

    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/upload_audio`, {
            method: "POST",
            body: formData,
        });

        if (!response || !response.ok) {
            const errorText = await response.text();
            throw new Error(`Audio upload failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        fetchFiles(sessionId); // Refresh danh sách file
        return { success: true, data };
    } catch (error) {
        console.error("Audio upload error:", error);
        throw new Error(`Audio upload failed: ${error.message}`);
    }
}

// export async function uploadFile(file, sessionId, fetchWithAuth) {

//     const formData = new FormData();
//     formData.append("session_id", sessionId);
//     formData.append("file", file);

//     try {
//         const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/upload-file`, {
//             method: "POST",
//             body: formData,
//         });

//         if (!response || !response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Upload failed: ${response.status} - ${errorText}`);
//         }

//         const data = await response.json();
//         return { success: true, data };
//     } catch (error) {
//         console.error("Upload error:", error);
//         throw new Error(`Upload failed: ${error.message}`);
//     }
// }

// export async function uploadFile(file, token) {
//     // Giả lập gọi API
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({ success: true });
//         }, 1500);
//     });
// }