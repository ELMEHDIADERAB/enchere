import React from 'react';

function Modal({ isOpen, onCancel, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;