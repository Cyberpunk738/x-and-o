import Modal from './Modal';

const ShopModal = ({ coins, onBuyEnergy, onBuyGem, onUnlockNeon, neonUnlocked, onClose, soundManager }) => {
    return (
        <Modal title="ITEM SHOP" onClose={onClose}>
            <div className="shop-content">
                <div className="shop-items">
                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-bolt"></i>
                            <div>
                                <div className="shop-title">ENERGY PACK</div>
                                <div className="shop-sub">+10 Energy</div>
                            </div>
                        </div>
                        <button className="btn-buy" onClick={onBuyEnergy} disabled={coins < 5}>
                            5 <i className="fas fa-coins"></i>
                        </button>
                    </div>

                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-gem"></i>
                            <div>
                                <div className="shop-title">GEM STONE</div>
                                <div className="shop-sub">+1 Gem</div>
                            </div>
                        </div>
                        <button className="btn-buy" onClick={onBuyGem} disabled={coins < 10}>
                            10 <i className="fas fa-coins"></i>
                        </button>
                    </div>

                    <div className="shop-item">
                        <div className="shop-item-info">
                            <i className="fas fa-palette"></i>
                            <div>
                                <div className="shop-title">NEON THEME</div>
                                <div className="shop-sub">Unlock Cyberpunk Style</div>
                            </div>
                        </div>
                        <button
                            className="btn-buy"
                            onClick={onUnlockNeon}
                            disabled={coins < 30 || neonUnlocked}
                        >
                            {neonUnlocked ? 'OWNED' : <span>30 <i className="fas fa-coins"></i></span>}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShopModal;
