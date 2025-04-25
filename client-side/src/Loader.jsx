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
    <div className="flex items-center justify-center flex-col animate-pulse">

    <div className="flex w-fit gap-2 duration-75 rounded-b-sm p-1">
        <div className="w-4 h-4 bg-white rounded-sm  duration-300 animate-spin"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-300 animate-bounce"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-100 animate-spin"></div>
        <div className="w-4 h-4 bg-white rounded-sm  duration-100 animate-bounce"></div>
      </div>

      <div className="animate-line">

      </div>
  
    </div>
    </div>
  );
};

export default LoaderOverlay;
