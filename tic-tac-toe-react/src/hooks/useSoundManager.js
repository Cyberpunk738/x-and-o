// Custom hook for sound management

import { useRef, useCallback } from 'react';

export function useSoundManager(soundEnabled) {
    const audioContextRef = useRef(null);

    const ensureAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
                return false;
            }
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(e => {
                console.warn('Could not resume audio context:', e);
            });
        }

        return true;
    }, []);

    const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
        if (!soundEnabled) return;
        if (!ensureAudioContext()) return;

        try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + duration);
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    }, [soundEnabled, ensureAudioContext]);

    const playClick = useCallback((player = 'X') => {
        if (player === 'X') {
            playTone(600, 0.1, 'sine', 0.2);
        } else {
            playTone(400, 0.1, 'sine', 0.2);
        }
    }, [playTone]);

    const playWin = useCallback(() => {
        playTone(523, 0.1, 'sine', 0.3);
        setTimeout(() => playTone(659, 0.1, 'sine', 0.3), 100);
        setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
    }, [playTone]);

    const playDraw = useCallback(() => {
        playTone(440, 0.3, 'sine', 0.2);
        setTimeout(() => playTone(392, 0.3, 'sine', 0.2), 150);
    }, [playTone]);

    const playButtonClick = useCallback(() => {
        playTone(300, 0.05, 'square', 0.15);
    }, [playTone]);

    const playCoin = useCallback(() => {
        playTone(880, 0.08, 'sine', 0.25);
        setTimeout(() => playTone(1200, 0.08, 'sine', 0.2), 80);
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(200, 0.2, 'sawtooth', 0.2);
    }, [playTone]);

    return {
        playClick,
        playWin,
        playDraw,
        playButtonClick,
        playCoin,
        playError,
        ensureAudioContext
    };
}
