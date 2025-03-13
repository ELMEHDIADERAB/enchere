const Modal = ({ isOpen, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};
