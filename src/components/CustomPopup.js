import { motion } from 'framer-motion';

const CustomPopup = ({ message, button1, button2 }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-center space-x-4">
          {button1}
          {button2}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomPopup;

