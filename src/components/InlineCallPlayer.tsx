import { useState, useRef, useEffect, type MouseEvent as RMouseEvent } from 'react';

export function useInlineCallPlayer(durationStr: string = "12:45") {
    const [mm, ss] = durationStr.split(':').map(Number);
    const totalSecs = mm * 60 + ss;

    const [expanded, setExpanded] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [speed, setSpeed] = useState(1.0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (playing) {
            intervalRef.current = setInterval(() => {
                setElapsed(e => {
                    if (e + 1 >= totalSecs) {
                        setPlaying(false);
                        return totalSecs;
                    }
                    return e + 1;
                });
            }, 1000 / speed);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing, speed, totalSecs]);

    const togglePlay = (e: RMouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!expanded) {
            setExpanded(true);
            setPlaying(true);
            setElapsed(0);
        } else {
            setPlaying(v => !v);
        }
    };

    const collapse = () => {
        setExpanded(false);
        setPlaying(false);
        setElapsed(0);
    };

    return {
        expanded,
        playing,
        elapsed,
        speed,
        totalSecs,
        togglePlay,
        collapse,
        setElapsed,
        setSpeed,
    };
}

export function InlineCallPlayer({ player }: { player: ReturnType<typeof useInlineCallPlayer> }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { expanded, playing, elapsed, speed, totalSecs, togglePlay, collapse, setElapsed, setSpeed } = player;

    // ─ click outside to collapse ─
    useEffect(() => {
        if (!expanded) return;
        const handler = (e: MouseEvent) => {
            // Don't close if clicking inside this component
            if (containerRef.current && containerRef.current.contains(e.target as Node)) {
                return;
            }
            collapse();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [expanded, collapse]);

    if (!expanded) return null;

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const pct = totalSecs > 0 ? (elapsed / totalSecs) * 100 : 0;
    const speeds = [1.0, 1.5, 2.0];

    const cycleSpeed = (e: RMouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length]);
    };

    return (
        <div ref={containerRef} className="mt-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 bg-orange-100/50 border border-orange-200 px-3 py-1.5 rounded-full">
                <button onClick={togglePlay} className="flex-shrink-0 text-orange-500 hover:text-orange-600 transition-colors">
                    {playing ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <rect x="2" y="2" width="3.5" height="10" rx="1" />
                            <rect x="8.5" y="2" width="3.5" height="10" rx="1" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <polygon points="2,1 13,7 2,13" />
                        </svg>
                    )}
                </button>

                <span className="text-xs font-medium text-orange-700 flex-shrink-0">通话</span>

                <div className="relative flex-1 h-1.5 bg-orange-200/50 rounded-full mx-1">
                    <div
                        className="absolute left-0 top-0 h-1.5 bg-orange-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-orange-400 rounded-full shadow-sm"
                        style={{ left: `calc(${pct}% - 7px)` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={totalSecs}
                        value={elapsed}
                        onChange={e => setElapsed(Number(e.target.value))}
                        onClick={e => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                <span className="text-xs text-orange-600 flex-shrink-0 w-9 text-right font-medium">
                    {fmt(elapsed)}
                </span>

                <button
                    onClick={cycleSpeed}
                    className="text-xs font-bold text-orange-600 flex-shrink-0 w-8 text-right hover:text-orange-700"
                >
                    {speed.toFixed(1)}x
                </button>
            </div>
        </div>
    );
}
