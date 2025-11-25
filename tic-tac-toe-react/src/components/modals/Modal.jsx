import './Modal.css';

function Modal({ title, children, onClose, className = '' }) {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`modal ${className}`} onClick={handleOverlayClick}>
            <div className="modal-content">
                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export default Modal;
