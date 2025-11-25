import Modal from './Modal';

function LeaderboardModal({ leaderboard, onResetStats, onClose, soundManager }) {
    const totalGames = leaderboard.wins + leaderboard.losses + leaderboard.draws;
    const winRate = totalGames > 0 ? Math.round((leaderboard.wins / totalGames) * 100) : 0;

    return (
        <Modal title="Leaderboard" onClose={onClose}>
            <div className="leaderboard-content">
                <div className="leaderboard-stats">
                    <div className="stat-item">
                        <div className="stat-label">Wins</div>
                        <div className="stat-value">{leaderboard.wins}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Losses</div>
                        <div className="stat-value">{leaderboard.losses}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Draws</div>
                        <div className="stat-value">{leaderboard.draws}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Win Rate</div>
                        <div className="stat-value">{winRate}%</div>
                    </div>
                </div>
                <div className="leaderboard-actions">
                    <button className="btn-reset" onClick={onResetStats}>
                        <i className="fas fa-redo"></i>
                        Reset Stats
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default LeaderboardModal;
