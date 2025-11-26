import Modal from './Modal';

const LeaderboardModal = ({ leaderboard, onResetStats, onClose, soundManager }) => {
    return (
        <Modal title="LEADERBOARD" onClose={onClose}>
            <div className="leaderboard-content">
                <div className="leaderboard-stats">
                    <div className="stat-item">
                        <div className="stat-label">VICTORIES</div>
                        <div className="stat-value">{leaderboard.wins}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">DEFEATS</div>
                        <div className="stat-value">{leaderboard.losses}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">DRAWS</div>
                        <div className="stat-value">{leaderboard.draws}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">TOTAL GAMES</div>
                        <div className="stat-value">
                            {leaderboard.wins + leaderboard.losses + leaderboard.draws}
                        </div>
                    </div>
                </div>
                <div className="leaderboard-actions">
                    <button
                        className="btn-reset"
                        onClick={() => {
                            onResetStats();
                            soundManager.playButtonClick();
                        }}
                    >
                        <i className="fas fa-trash"></i> RESET STATS
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LeaderboardModal;
