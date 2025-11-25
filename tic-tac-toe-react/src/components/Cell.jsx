import { useEffect, useRef } from 'react';
import './Cell.css';

function Cell({ index, value, isWinner, onClick }) {
    const cellRef = useRef(null);

    useEffect(() => {
        if (value && cellRef.current) {
            // Spawn particles
            const cellRect = cellRef.current.getBoundingClientRect();
            const centerX = cellRect.width / 2;
            const centerY = cellRect.height / 2;

            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                const angle = (Math.PI * 2 * i) / 8;
                const distance = 40;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                particle.style.setProperty('--dx', dx + 'px');
                particle.style.setProperty('--dy', dy + 'px');

                cellRef.current.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 600);
            }
        }
    }, [value]);

    return (
        <div
            ref={cellRef}
            className={`cell ${value.toLowerCase()} ${isWinner ? 'winner' : ''}`}
            data-index={index}
            onClick={onClick}
        >
            {value}
        </div>
    );
}

export default Cell;
