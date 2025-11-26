import './Preloader.css';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="preloader-logo">
                    <div className="logo-x">X</div>
                    <div className="logo-o">O</div>
                </div>
                <div className="preloader-text">LOADING SYSTEM...</div>
                <div className="preloader-spinner">
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
