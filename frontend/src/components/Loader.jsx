import { FaSpinner } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-4">
        <FaSpinner className="animate-spin text-primary text-3xl" />
        <p className="text-gray-600">Завантаження...</p>
      </div>
    </div>
  );
};

export default Loader;
