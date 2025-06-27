import { useRef, useState } from 'react';
import { useWaveform } from '@/hooks/useWaveform';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Send, X } from 'lucide-react';

const LiveWaveform = ({ isRecording, setIsRecording, onSend }) => {
    const waveformRef = useRef(null);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const { wavesurfer, startRecording, stopRecording, recordedBlob: blob } = useWaveform({
        container: waveformRef,
        isRecording,
        waveColor: '#4B5563',
        progressColor: '#EF4444', // Tailwind red-500
        height: 48,
        barWidth: 2,
        responsive: true,
    });

    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
            setRecordedBlob(blob);
        } else {
            startRecording();
        }
        setIsRecording(!isRecording);
    };

    const handleSend = () => {
        if (recordedBlob) {
            onSend(recordedBlob);
            setRecordedBlob(null);
            setIsRecording(false);
        }
    };

    const handleCancel = () => {
        setRecordedBlob(null);
        setIsRecording(false);
        if (wavesurfer) {
            wavesurfer.destroy();
        }
    };

    return (
        <Card className="p-4 w-full bg-white border-slate-200 rounded-full">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleRecording}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    className="text-primary hover:bg-blue-100"
                >
                    {isRecording ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <div ref={waveformRef} className="w-full" />
                {recordedBlob && (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSend}
                            aria-label="Send recorded audio"
                            className="text-primary hover:bg-blue-100"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            aria-label="Cancel recording"
                            className="text-red-500 hover:bg-red-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default LiveWaveform;