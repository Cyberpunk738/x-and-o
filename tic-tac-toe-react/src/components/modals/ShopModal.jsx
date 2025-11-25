import Modal from './Modal';

function ShopModal({ coins, onBuyEnergy, onBuyGem, onUnlockNeon, neonUnlocked, onClose, soundManager }) {
    return (
        <Modal title="Shop" onClose={onClose}>
            <div className="shop-content">
                <div className="shop-items">
                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-bolt"></i>
                            <div>
                                <div className="shop-title">Energy +10</div>
                                <div className="shop-sub">Costs 5 coins</div>
                            </div>
                        </div>
                        <button className="btn-buy" onClick={onBuyEnergy}>Buy</button>
                    </div>
                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-gem"></i>
                            <div>
                                <div className="shop-title">Gem +1</div>
                                <div className="shop-sub">Costs 10 coins</div>
                            </div>
                        </div>
                        <button className="btn-buy" onClick={onBuyGem}>Buy</button>
                    </div>
                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-moon"></i>
                            <div>
                                <div className="shop-title">Unlock Neon Theme</div>
                                <div className="shop-sub">Costs 30 coins</div>
                            </div>
                        </div>
                        <button
                            className="btn-buy"
                            onClick={onUnlockNeon}
                            disabled={neonUnlocked}
                        >
                            {neonUnlocked ? 'Unlocked' : 'Unlock'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ShopModal;
