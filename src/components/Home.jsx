import React from 'react';
import './Home.css';

const Home = ({
    coins,
    energy,
    gems,
    onPlayAI,
    onPlayHuman,
    onOpenShop,
    onOpenLeaderboard,
    onOpenSettings,
    onOpenProfile
}) => {
    return (
        <div className="home-container">
            {/* Header: Stats & Profile */}
            <header className="home-header">
                <div className="home-stats">
                    {/* Fire/Streak */}
                    <div className="stat-item fire">
                        <i className="fas fa-fire stat-icon"></i>
                        <span>0</span>
                    </div>
                    {/* Energy */}
                    <div className="stat-item energy">
                        <i className="fas fa-bolt stat-icon"></i>
                        <span>{energy}</span>
                        <i className="fas fa-plus add-btn" onClick={onOpenShop}></i>
                    </div>
                    {/* Gems */}
                    <div className="stat-item gems">
                        <i className="fas fa-gem stat-icon"></i>
                        <span>{gems}</span>
                        <i className="fas fa-plus add-btn" onClick={onOpenShop}></i>
                    </div>
                    {/* Coins */}
                    <div className="stat-item coins">
                        <i className="fas fa-coins stat-icon"></i>
                        <span>{coins}</span>
                        <i className="fas fa-plus add-btn" onClick={onOpenShop}></i>
                    </div>
                </div>

                <div className="profile-icon" onClick={onOpenProfile}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="profile-avatar" />
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <h1 className="home-title">Welcome to Tic Tac Toe</h1>

                <div className="play-buttons">
                    <button className="play-btn btn-human" onClick={onPlayHuman}>
                        Play with Human
                    </button>
                    <button className="play-btn btn-ai" onClick={onPlayAI}>
                        Play with AI
                    </button>
                </div>
            </main>

            {/* Footer Navigation */}
            <nav className="home-footer">
                <button className="nav-item active">
                    <i className="fas fa-home"></i>
                </button>
                <button className="nav-item" onClick={onOpenLeaderboard}>
                    <i className="fas fa-shield-alt"></i>
                </button>
                <button className="nav-item" onClick={onPlayAI}>
                    <i className="fas fa-gamepad"></i>
                </button>
                <button className="nav-item" onClick={onOpenProfile}>
                    <i className="fas fa-smile"></i>
                </button>
                <button className="nav-item" onClick={onOpenShop}>
                    <i className="fas fa-store"></i>
                </button>
            </nav>
        </div>
    );
};

export default Home;
