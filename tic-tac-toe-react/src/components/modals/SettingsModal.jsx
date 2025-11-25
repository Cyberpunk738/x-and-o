import Modal from './Modal';

function SettingsModal({ soundEnabled, theme, neonUnlocked, onSoundToggle, onThemeToggle, onClose, soundManager }) {
    const handleThemeChange = (e) => {
        const newTheme = e.target.checked ? 'neon' : 'classic';
        if (newTheme === 'neon' && !neonUnlocked) {
            e.target.checked = false;
            alert('Unlock Neon Theme in the Shop first!');
            return;
        }
        onThemeToggle(newTheme);
        soundManager.playButtonClick();
    };

    const handleSoundChange = (e) => {
        onSoundToggle(e.target.checked);
        if (e.target.checked) {
            soundManager.ensureAudioContext();
            soundManager.playButtonClick();
        }
    };

    return (
        <Modal title="Settings" onClose={onClose}>
            <div className="settings-body">
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-label">Sound Effects</div>
                        <div className="setting-desc">Enable game sounds</div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={handleSoundChange}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-label">Dark Mode</div>
                        <div className="setting-desc">Switch to neon theme</div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={theme === 'neon'}
                            onChange={handleThemeChange}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-label">Music</div>
                        <div className="setting-desc">Background music</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" disabled />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-footer">
                <div className="app-version">Version 3.0.0</div>
            </div>
        </Modal>
    );
}

export default SettingsModal;
