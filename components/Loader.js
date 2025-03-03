import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-lg z-50">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Outer Glowing Circle */}
        <motion.div
          className="absolute w-20 h-20 bg-blue-600/20 rounded-full animate-ping"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Rotating Gradient Loader */}
        <motion.div
          className="w-16 h-16 border-[6px] border-transparent border-t-blue-600 border-b-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;
