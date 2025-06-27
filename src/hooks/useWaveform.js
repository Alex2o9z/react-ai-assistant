import { useState, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

export const useWaveform = ({
    container,
    audioUrl,
    waveColor = '#4B5563', // Tailwind gray-600
    progressColor = '#3B82F6', // Tailwind blue-500
    height = 48,
    barWidth = 2,
    responsive = true,
    isRecording = false,
}) => {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState(null);

    useEffect(() => {
        if (!container.current) return;

        const ws = WaveSurfer.create({
            container: container.current,
            waveColor,
            progressColor,
            height,
            barWidth,
            responsive,
            plugins: [RecordPlugin.create()],
        });

        setWavesurfer(ws);

        if (audioUrl && !isRecording) {
            ws.load(audioUrl);
        }

        ws.on('ready', () => {
            setDuration(ws.getDuration());
        });

        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('timeupdate', () => {
            const currentTime = ws.getCurrentTime();
            const duration = ws.getDuration();
            setProgress((currentTime / duration) * 100 || 0);
        });

        if (isRecording) {
            ws.registerPlugin(RecordPlugin.create()).startRecording();
        }

        ws.on('record-end', (blob) => {
            setRecordedBlob(blob);
            ws.loadBlob(blob); // Load recorded audio for static waveform
        });

        return () => {
            ws.destroy();
        };
    }, [container, audioUrl, waveColor, progressColor, height, barWidth, responsive, isRecording]);

    const togglePlayPause = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.playPause();
        }
    }, [wavesurfer]);

    const startRecording = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.plugins.record.startRecording();
        }
    }, [wavesurfer]);

    const stopRecording = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.plugins.record.stopRecording();
        }
    }, [wavesurfer]);

    return { wavesurfer, isPlaying, togglePlayPause, progress, duration, recordedBlob, startRecording, stopRecording };
};