import { FaPen } from 'react-icons/fa';

function CreateButton({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-primary text-black w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-10
        transition-all duration-300 ease-in-out transform hover:scale-110
      `}
      aria-label="Create new post"
    >
      {icon || <FaPen className="text-lg" />}
    </button>
  );
}

export default CreateButton;