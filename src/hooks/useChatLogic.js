import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import useApiKeyStore from "@/stores/apiKeyStore";
import useDialogStore from "@/stores/dialogStore";
import { uploadFile, uploadAudio } from "@/services/uploadService";
import { storeAudio, getAudio, clearAllAudio, dataUrlToBlob } from "@/services/speechServices";

export default function useChatLogic(token) {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();
    const { selectedModel, apiKeys } = useApiKeyStore();
    const { openDialog } = useDialogStore();
    const [aiModels, setAIModels] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (!isFetching) {
            fetchSessions();
            fetchAIModels();
        }
        if (sessionId) {
            fetchHistory(sessionId);
            fetchFiles(sessionId);
        } else {
            setMessages([
                {
                    role: "assistant",
                    text: "Xin chào! Tôi là trợ lý AI, sẵn sàng giúp bạn. Hãy gửi câu hỏi hoặc yêu cầu của bạn nhé!",
                    timestamp: new Date().toISOString(),
                },
            ]);
            setFiles([]);
        }
    }, [sessionId, token, navigate]);

    useEffect(() => {
        return () => {
            clearAllAudio();
        };
    }, [sessionId]);

    const fetchAIModels = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/aimodels`);
            if (!response.ok) throw new Error("Failed to fetch models");

            const data = await response.json();
            const list = Array.isArray(data) ? data : [];
            console.log("Danh sách AI Models:", list);
            setAIModels(list);

            if (!selectedModel && list.length > 0) {
                useApiKeyStore.getState().setSelectedModel(list[0]);
                console.log("Auto-selected default model:", list[0]);
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchSessions = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/sessions`);
            if (!res) return;
            const data = await res.json();
            const list = Array.isArray(data) ? data : data.sessions ?? [];
            console.log("Danh sách sessions:", list);
            setSessions(list);
        } catch (err) {
            console.error("Lỗi lấy danh sách sessions:", err);
            setSessions([]);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchHistory = async (sid) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            console.log("Fetching history for sessionId:", sid);
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/session/${sid}`);
            if (!res) return;
            const history = await res.json();
            console.log("History response:", history);
            const mapped = (history.messages || []).flatMap((item) => [
                {
                    role: item.role,
                    text: item.content,
                    timestamp: item.timestamp,
                },
            ]);
            setMessages(mapped);
        } catch (err) {
            console.error("Lỗi khi tải lịch sử:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchFiles = async (sid) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            console.log("Fetching files for sessionId:", sid);
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/files/${sid}`);
            if (!res) return;
            const data = await res.json();
            console.log("Files response:", data);
            setFiles(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách file:", err);
            setFiles([]);
        } finally {
            setIsFetching(false);
        }
    };

    const deleteFile = async (fileId) => {
        try {
            const response = await fetchWithAuth(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/files/${sessionId}/${fileId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response) return false;
            if (response.status === 204) {
                console.log("File deleted successfully:", fileId);
                fetchFiles(sessionId);
                return true;
            } else if (response.status === 404) {
                console.warn("File not found or unauthorized");
            } else {
                const errorText = await response.text();
                console.error(`Failed to delete file: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error("Error deleting file:", err);
        }
        return false;
    };

    const sendMessage = async (message) => {
        if (!message || (!message.data && !input.trim())) return;
        if (!selectedModel || !apiKeys[selectedModel.group]) {
            if (selectedModel) {
                openDialog(`api-key-${selectedModel.model}`, 'input-api-key', {
                    model: selectedModel,
                    defaultValue: '',
                    onSave: (value) => console.log(`API Key saved for ${selectedModel.group}:`, value),
                    onClose: () => { },
                });
            } else {
                console.warn('sendMessage called but selectedModel is null.');
            }
            return;
        }

        const provider = selectedModel.group;
        const model = selectedModel.model;
        const api_key = apiKeys[provider];
        const now = new Date().toISOString();

        let userMessage;
        if (message.type === 'text') {
            userMessage = { role: "user", text: message.data, timestamp: now };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");
        } else if (message.type === 'audio') {
            console.log("Received audio file in sendMessage:", {
                name: message.data.name,
                size: message.data.size,
                type: message.data.type,
                isFile: message.data instanceof File,
            });
            const userAudioTimestamp = now;
            userMessage = {
                role: "user",
                text: "[Voice message]",
                timestamp: now,
                audioTimestamp: userAudioTimestamp,
            };
            setMessages((prev) => [...prev, userMessage]);
            storeAudio(`audio_${userAudioTimestamp}`, message.data);
        } else {
            console.error('Invalid message type:', message.type);
            setError('Invalid message type');
            return;
        }
        setError(null);

        const sid = sessionId || crypto.randomUUID();
        console.log("Using session_id:", sid);

        if (!sessionId) {
            try {
                const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/new_chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id: sid }),
                });
                if (!res || !res.ok) {
                    const errorText = await res.text();
                    console.error("Failed to create new session:", errorText);
                    throw new Error(`Lỗi tạo phiên chat: ${res?.status || "?"} - ${errorText}`);
                }
                console.log("New session created:", sid);
            } catch (err) {
                console.error("Lỗi tạo phiên chat:", err);
                setError(err.message);
                return;
            }
        }

        const formData = new FormData();
        formData.append("session_id", sid);
        if (message.type === 'audio') {
            console.log("Appending audio file to FormData:", {
                name: message.data.name,
                size: message.data.size,
                type: message.data.type,
            });
            formData.append("voice", message.data, "recording.wav");
        } else {
            formData.append("prompt", message.data);
        }

        formData.append("provider", provider);
        formData.append("model", model);
        formData.append("api_key", api_key);

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? {
                name: value.name,
                size: value.size,
                type: value.type,
            } : value);
        }

        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat`, {
                method: "POST",
                body: formData,
            });

            if (!res || !res.ok) {
                const errorText = await res.text();
                console.error("Chat request failed:", errorText);
                throw new Error(`Lỗi gửi yêu cầu: ${res?.status || "?"} - ${errorText}`);
            }

            const data = await res.json();
            console.log("Chat response:", data);

            if (message.type === 'audio' && data.transcript) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.timestamp === userMessage.timestamp && msg.role === "user"
                            ? { ...msg, text: data.transcript }
                            : msg
                    )
                );
            }

            const aiMessage = {
                role: "assistant",
                text: data.response,
                timestamp: new Date().toISOString(),
                audio: null,
            };

            if (data.audio) {
                console.log("Processing assistant audio:", data.audio.substring(0, 50) + "...");
                let audioBlob;
                if (data.audio.startsWith("data:audio")) {
                    audioBlob = dataUrlToBlob(data.audio);
                } else {
                    const dataUrl = `data:audio/wav;base64,${data.audio}`;
                    audioBlob = dataUrlToBlob(dataUrl);
                }

                if (audioBlob) {
                    const assistantAudioTimestamp = new Date().toISOString();
                    storeAudio(`audio_${assistantAudioTimestamp}`, audioBlob);
                    aiMessage.audioTimestamp = assistantAudioTimestamp;
                } else {
                    console.error("Failed to convert audio data to Blob");
                    setError("Không thể xử lý audio từ server.");
                }
            }

            setMessages((prev) => [...prev, aiMessage]);

            if (!sessionId) {
                navigate(`/chat/${data.session_id || sid}`);
            }

            await fetchFiles(sid);
        } catch (err) {
            console.error("Lỗi gửi tin nhắn:", err);
            setError(err.message);
        }
    };

    const deleteSession = useCallback(async (sessionId) => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/session/${sessionId}`, {
                method: "DELETE",
            });

            if (!response) return false;
            if (response.status === 204) {
                console.log("Session deleted successfully:", sessionId);
                setSessions((prev) => prev.filter((session) => session.sessionId !== sessionId));
                if (sessionId === sessionId) {
                    navigate("/chat");
                }
                await fetchSessions();
                return true;
            } else if (response.status === 404) {
                console.warn("Session not found or unauthorized");
            } else {
                const errorText = await response.text();
                console.error(`Failed to delete session: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error("Error deleting session:", err);
        }
        return false;
    }, [fetchWithAuth, setSessions, navigate, sessionId]);

    const handleUpload = useCallback(async (files, youtubeUrl = "", query = "") => {
        if (!selectedModel || !apiKeys[selectedModel.group]) {
            if (selectedModel) {
                openDialog(`api-key-${selectedModel.model}`, 'input-api-key', {
                    model: selectedModel,
                    defaultValue: '',
                    onSave: (value) => console.log(`API Key saved for ${selectedModel.group}:`, value),
                    onClose: () => { },
                });
            } else {
                console.warn('handleUpload called but selectedModel is null.');
            }
            return { success: false, error: "Không có mô hình AI được chọn hoặc thiếu API key." };
        }

        if (files.length > 10) {
            setError("Chỉ được phép tải lên tối đa 10 file.");
            return { success: false, error: "Chỉ được phép tải lên tối đa 10 file." };
        }

        const validFileTypes = ['pdf', 'doc', 'docx', 'txt', 'wav', 'mp3', 'mp4'];
        const audioFileTypes = ['wav', 'mp3', 'mp4']; // Định nghĩa các loại file audio
        const maxFileSizeMB = import.meta.env.VITE_MAX_FILE_SIZE_MB || 200;
        const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

        const invalidFiles = files.filter(
            (file) => !validFileTypes.includes(file.name.split('.').pop()?.toLowerCase())
        );
        const oversizedFiles = files.filter((file) => file.size > maxFileSizeBytes);

        if (invalidFiles.length > 0) {
            const invalidNames = invalidFiles.map((f) => f.name).join(", ");
            setError(`File không hợp lệ: ${invalidNames}. Chỉ chấp nhận: ${validFileTypes.join(", ")}.`);
            return { success: false, error: `File không hợp lệ: ${invalidNames}.` };
        }

        if (oversizedFiles.length > 0) {
            const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
            setError(`File quá lớn: ${oversizedNames}. Kích thước tối đa là ${maxFileSizeMB}MB.`);
            return { success: false, error: `File quá lớn: ${oversizedNames}.` };
        }

        setUploadLoading(true);
        setError(null);

        let sid = sessionId;
        if (!sid) {
            sid = crypto.randomUUID();
            console.log("Using new session_id for upload:", sid);
            try {
                const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/new_chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id: sid }),
                });
                if (!res || !res.ok) {
                    const errorText = await res.text();
                    console.error("Failed to create new session:", errorText);
                    throw new Error(`Lỗi tạo phiên chat: ${res?.status || "?"} - ${errorText}`);
                }
                console.log("New session created for upload:", sid);
                navigate(`/chat/${sid}`);
            } catch (err) {
                console.error("Lỗi tạo phiên chat:", err);
                setError(err.message);
                setUploadLoading(false);
                return { success: false, error: err.message };
            }
        }

        try {
            let result;
            // Tách file audio và file tài liệu
            const audioFiles = files.filter((file) =>
                audioFileTypes.includes(file.name.split('.').pop()?.toLowerCase())
            );
            const documentFiles = files.filter((file) =>
                !audioFileTypes.includes(file.name.split('.').pop()?.toLowerCase())
            );

            // Upload file tài liệu
            if (documentFiles.length > 0) {
                result = await uploadFile(documentFiles, sid, fetchWithAuth, fetchFiles, selectedModel, apiKeys);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: `Đã tải lên ${documentFiles.length} file: ${documentFiles.map((f) => f.name).join(", ")} thành công`,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }

            // Upload file audio
            if (audioFiles.length > 0) {
                for (const file of audioFiles) {
                    result = await uploadAudio(file, sid, fetchWithAuth, fetchFiles, "", "", selectedModel, apiKeys);
                }
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: `Đã tải lên ${audioFiles.length} audio: ${audioFiles.map((f) => f.name).join(", ")} thành công`,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }

            // Upload YouTube URL
            if (youtubeUrl) {
                result = await uploadAudio(null, sid, fetchWithAuth, fetchFiles, youtubeUrl, query, selectedModel, apiKeys);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        text: `Đã xử lý URL YouTube: ${youtubeUrl}`,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }

            await fetchFiles(sid);
            await fetchHistory(sid);
            return { success: true, data: result?.data };
        } catch (err) {
            setError(err.message);
            console.log(`Tải lên thất bại: ${err.message}`, "error");
            return { success: false, error: err.message };
        } finally {
            setUploadLoading(false);
        }
    }, [sessionId, fetchWithAuth, fetchFiles, navigate, selectedModel, apiKeys]);

    const audioAction = async (fileName, action) => {
        if (!sessionId) {
            console.error("No sessionId available for audio action");
            setError("Vui lòng chọn một phiên chat trước khi thực hiện hành động.");
            return false;
        }
        if (!selectedModel || !apiKeys[selectedModel.group]) {
            if (selectedModel) {
                openDialog(`api-key-${selectedModel.model}`, 'input-api-key', {
                    model: selectedModel,
                    defaultValue: '',
                    onSave: (value) => console.log(`API Key saved for ${selectedModel.group}:`, value),
                    onClose: () => { },
                });
            } else {
                console.warn('handleUpload called but selectedModel is null.');
            }
            return;
        }

        const provider = selectedModel.group;
        const model = selectedModel.model;
        const api_key = apiKeys[provider];

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/audio_action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    action: action,
                    file_name: fileName,
                    query: "",
                    provider: provider,
                    model: model,
                    api_key: api_key,
                }),
            });

            if (!response || !response.ok) {
                const errorText = await response.text();
                console.error(`Failed to perform audio action (${action}): ${response.status} - ${errorText}`);
                setError(`Lỗi khi thực hiện hành động ${action}.`);
                return false;
            }

            const data = await response.json();
            console.log(`Audio action (${action}) response:`, data);

            if (data.messages && Array.isArray(data.messages)) {
                const mappedMessages = data.messages.map((msg) => ({
                    role: msg.role,
                    text: msg.content,
                    timestamp: msg.timestamp,
                }));
                setMessages((prev) => [...prev, ...mappedMessages]);
            } else {
                console.warn("No valid messages returned from API");
            }

            await fetchHistory(sessionId);
            return true;
        } catch (err) {
            console.error(`Error performing audio action (${action}):`, err);
            setError(`Lỗi khi thực hiện hành động ${action}: ${err.message}`);
            return false;
        }
    };

    return {
        input,
        setInput,
        messages,
        aiModels,
        setAIModels,
        sessions,
        setSessions,
        files,
        error,
        setError,
        uploadLoading,
        sendMessage,
        navigate,
        sessionId,
        deleteSession,
        deleteFile,
        fetchFiles,
        fetchHistory,
        audioAction,
        handleUpload,
    };
}