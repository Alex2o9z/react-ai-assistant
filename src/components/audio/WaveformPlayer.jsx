import { useRef } from 'react';
import { useWaveform } from '@/hooks/useWaveform';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause } from 'lucide-react';

const WaveformPlayer = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const { isPlaying, togglePlayPause, progress, duration } = useWaveform({
        container: waveformRef,
        audioUrl,
        waveColor: '#4B5563',
        progressColor: '#3B82F6',
        height: 48,
        barWidth: 2,
        responsive: true,
    });

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="p-4 w-full max-w-md bg-white border-slate-200">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    className="text-primary hover:bg-blue-100"
                >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div ref={waveformRef} className="w-full" />
                <span className="text-sm text-slate-600">{formatDuration(duration)}</span>
            </div>
            {/* <Progress value={progress} className="mt-2" /> */}
        </Card>
    );
};

export default WaveformPlayer;