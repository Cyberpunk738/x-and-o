import './HUD.css';

function HUD({ coins, energy, gems, onOpenShop }) {
    return (
        <div className="hud">
            <div className="hud-item">
                <i className="fas fa-coins"></i>
                <span>{coins}</span>
                <button className="hud-plus" onClick={onOpenShop} title="Open Shop">
                    <i className="fas fa-plus"></i>
                </button>
            </div>
            <div className="hud-item">
                <i className="fas fa-bolt"></i>
                <span>{energy}</span>
                <button className="hud-plus" onClick={onOpenShop} title="Open Shop">
                    <i className="fas fa-plus"></i>
                </button>
            </div>
            <div className="hud-item">
                <i className="fas fa-gem"></i>
                <span>{gems}</span>
                <button className="hud-plus" onClick={onOpenShop} title="Open Shop">
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </div>
    );
}

export default HUD;
