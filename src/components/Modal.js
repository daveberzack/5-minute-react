import { useState } from 'react';

function Modal({ isOpen, onClose, message, title = "Friend's Message" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card p-4 sm:p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-gray-700 text-center text-sm leading-relaxed">{message}</p>
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