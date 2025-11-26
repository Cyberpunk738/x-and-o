import Modal from './Modal';

const NotificationModal = ({ data, onClose }) => {
    return (
        <Modal title="" onClose={onClose} className="notification-modal">
            <div className="notification-content">
                <div className="notification-icon">
                    <i className={data.icon}></i>
                </div>
                <h2>{data.title}</h2>
                <p>{data.message}</p>
                <button className="btn-notification" onClick={onClose}>
                    CONTINUE
                </button>
            </div>
        </Modal>
    );
};

export default NotificationModal;
