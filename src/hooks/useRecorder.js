import { useState, useRef } from "react";
import { storeAudio } from "@/services/speechServices";
import useApiKeyStore from "@/stores/apiKeyStore";
import useDialogStore from "@/stores/dialogStore";

export default function useRecorder(onStopCallback) {
    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const { selectedModel, apiKeys } = useApiKeyStore();
    const { openDialog } = useDialogStore();

    const startRecording = async () => {
        if (selectedModel && !apiKeys[selectedModel.group]) {
            openDialog(`api-key-${selectedModel.model}`, 'input-api-key', {
                model: selectedModel,
                defaultValue: '',
                onSave: (value) => console.log(`API Key saved for ${selectedModel.group}:`, value),
                onClose: () => { },
            });
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const wavBlob = await convertToWav(blob);
                const file = new File([wavBlob], "recording.wav", { type: "audio/wav" });
                console.log("Generated WAV file:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });

                // // Lưu file vào sessionStorage
                // const audioUrl = URL.createObjectURL(file);
                // const timestamp = new Date().toISOString();
                // sessionStorage.setItem(`audio_${timestamp}`, audioUrl);
                // console.log("Stored audio in sessionStorage with key:", `audio_${timestamp}`);

                // if (onStopCallback) onStopCallback(file, timestamp); // Truyền timestamp để liên kết

                // Store audio in audioStore instead of sessionStorage
                const timestamp = new Date().toISOString();
                try {
                    storeAudio(`audio_${timestamp}`, file);
                    console.log("Stored audio in audioStore with key:", `audio_${timestamp}`);
                } catch (err) {
                    console.error("Error storing audio in audioStore:", err);
                }

                if (onStopCallback) onStopCallback(file, timestamp); // Pass file and timestamp
            };

            mediaRecorder.start();
            recorderRef.current = mediaRecorder;
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const convertToWav = async (webmBlob) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await webmBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const wavBuffer = audioBufferToWav(audioBuffer);
        return new Blob([wavBuffer], { type: "audio/wav" });
    };

    const audioBufferToWav = (buffer) => {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;

        const length = buffer.length * numChannels * bytesPerSample;
        const dataLength = length;
        const bufferArray = new ArrayBuffer(44 + dataLength);
        const view = new DataView(bufferArray);

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + dataLength, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeString(view, 36, "data");
        view.setUint32(40, dataLength, true);

        let offset = 44;
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const value = Math.max(-1, Math.min(1, sample)) * 0x7fff;
                view.setInt16(offset, value, true);
                offset += 2;
            }
        }

        return bufferArray;
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    return { startRecording, stopRecording, isRecording };
}