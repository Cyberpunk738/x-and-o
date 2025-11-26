import { useCallback, useEffect, useRef } from 'react';

export function useSoundManager(enabled) {
    const audioContextRef = useRef(null);

    useEffect(() => {
        if (enabled && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [enabled]);

    const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
        if (!enabled || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [enabled]);

    const playClick = useCallback((player) => {
        if (player === 'X') {
            playTone(440, 0.1, 'square', 0.1);
        } else {
            playTone(330, 0.1, 'sine', 0.1);
        }
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(150, 0.3, 'sawtooth', 0.2);
    }, [playTone]);

    const playWin = useCallback(() => {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.2, 'square', 0.1), i * 100);
        });
    }, [playTone]);

    const playDraw = useCallback(() => {
        [440, 415, 392].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.3, 'triangle', 0.1), i * 200);
        });
    }, [playTone]);

    const playButtonClick = useCallback(() => {
        playTone(800, 0.05, 'sine', 0.05);
    }, [playTone]);

    const playCoin = useCallback(() => {
        playTone(1200, 0.1, 'sine', 0.1);
        setTimeout(() => playTone(1600, 0.2, 'sine', 0.1), 50);
    }, [playTone]);

    return {
        playTone,
        playClick,
        playError,
        playWin,
        playDraw,
        playButtonClick,
        playCoin
    };
}
