import toast from "react-hot-toast";

const toastConfig = {
  position: "top-right",
  duration: 4000,
  style: {
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    padding: "12px",
    fontSize: "14px",
  },
  success: {
    style: { background: "#22c55e" }, 
    icon: "✅",
  },
  error: {
    style: { background: "#ef4444" },
    icon: "❌",
  },
  loading: {
    style: { background: "#f59e0b" }, 
    icon: "⏳",
  },
};

export const showToast = (type, message) => {
  if (type === "success") toast.success(message, toastConfig.success);
  else if (type === "error") toast.error(message, toastConfig.error);
  else if (type === "loading") toast.loading(message, toastConfig.loading);
  else toast(message, toastConfig);
};

export default toastConfig;
