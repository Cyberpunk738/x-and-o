import Modal from './Modal';

function NotificationModal({ data, onClose }) {
    return (
        <Modal onClose={onClose} className="notification-modal">
            <div className="notification-content">
                <div className="notification-icon">
                    <i className={data.icon}></i>
                </div>
                <h2>{data.title}</h2>
                <p>{data.message}</p>
                <button className="btn-notification" onClick={onClose}>
                    <i className="fas fa-redo"></i>
                    Play Again
                </button>
            </div>
        </Modal>
    );
}

export default NotificationModal;
