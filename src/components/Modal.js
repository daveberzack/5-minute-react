import { useState } from 'react';

function Modal({ isOpen, onClose, message, title = "Friend's Message" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card p-4 sm:p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
        </div>
        <p className="text-gray-700 text-center text-sm leading-relaxed mb-3">{message}</p>
        <button
          onClick={onClose}
          className="w-full btn-gradient py-2 px-4 rounded-lg font-medium text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Custom hook for modal functionality
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState("Friend's Message");

  const showModal = (messageText, titleText = "Friend's Message") => {
    setMessage(messageText);
    setTitle(titleText);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage('');
    setTitle("Friend's Message");
  };

  const handleShowMessage = (e, messageText, friendName = '') => {
    e.stopPropagation(); // Prevent navigation
    showModal(messageText, friendName ? `${friendName}'s Message` : "Friend's Message");
  };

  return {
    isOpen,
    message,
    title,
    showModal,
    closeModal,
    handleShowMessage
  };
}

export default Modal;