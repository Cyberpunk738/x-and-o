import Modal from './Modal';

const SettingsModal = ({
    soundEnabled,
    theme,
    neonUnlocked,
    onSoundToggle,
    onThemeToggle,
    onClose,
    soundManager
}) => {
    return (
        <Modal title="SETTINGS" onClose={onClose}>
            <div className="settings-body">
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-label">SOUND EFFECTS</div>
                        <div className="setting-desc">Enable game sounds</div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => {
                                onSoundToggle(e.target.checked);
                                soundManager.playButtonClick();
                            }}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-label">NEON THEME</div>
                        <div className="setting-desc">
                            {neonUnlocked ? 'Enable Cyberpunk visuals' : 'Unlock in Shop (30 Coins)'}
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={theme === 'neon'}
                            onChange={(e) => {
                                onThemeToggle(e.target.checked ? 'neon' : 'classic');
                                soundManager.playButtonClick();
                            }}
                            disabled={!neonUnlocked}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-footer">
                <div className="app-version">v1.0.0 • React Edition</div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
