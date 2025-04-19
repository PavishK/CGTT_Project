import { useEffect, useState } from "react";

const LoaderOverlay = ({ loading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300); // Match fade-out duration
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 transition-opacity duration-300
        ${loading ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="flex gap-2 animate-pulse duration-75 border-b-4 border-b-white rounded-b-sm p-1">
        <div className="w-4 h-4 bg-white rounded-sm  duration-300 animate-spin"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-300 animate-bounce"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-100 animate-spin"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-100 animate-bounce"></div>
      </div>

    </div>
  );
};

export default LoaderOverlay;
