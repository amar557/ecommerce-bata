/**
 * Shared beautiful loading indicator for storefront + dashboard.
 *
 * @param {"sm"|"md"|"lg"} [size="md"]
 * @param {string} [message]
 * @param {boolean} [fullScreen=false] — centered min-height page overlay style
 * @param {boolean} [overlay=false] — absolute cover of parent
 * @param {string} [className]
 */
export default function LoadingIndicator({
  size = "md",
  message = "Loading...",
  fullScreen = false,
  overlay = false,
  className = "",
}) {
  const sizes = {
    sm: { wrap: "w-10 h-10", ring: "border-2", dot: "w-1.5 h-1.5", text: "text-xs" },
    md: { wrap: "w-16 h-16", ring: "border-[3px]", dot: "w-2 h-2", text: "text-sm" },
    lg: { wrap: "w-24 h-24", ring: "border-4", dot: "w-2.5 h-2.5", text: "text-base" },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <div className={`relative ${s.wrap}`}>
        {/* Soft glow */}
        <div className="absolute inset-0 rounded-full bg-deepRed-600/10 blur-md animate-pulse" />

        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full ${s.ring} border-deepRed-100 border-t-deepRed-600 animate-spin`}
          style={{ animationDuration: "0.85s" }}
        />

        {/* Inner counter ring */}
        <div
          className={`absolute inset-2 rounded-full ${s.ring} border-transparent border-b-deepRed-400 animate-spin`}
          style={{ animationDuration: "1.35s", animationDirection: "reverse" }}
        />

        {/* Center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <span
              className={`${s.dot} rounded-full bg-deepRed-600 shadow-[0_0_12px_rgba(122,10,10,0.45)]`}
              style={{
                animation: "bazar-loader-pulse 1.2s ease-in-out infinite",
              }}
            />
            <span
              className={`absolute ${s.dot} rounded-full bg-deepRed-300/80`}
              style={{
                animation: "bazar-loader-orbit 1.2s linear infinite",
              }}
            />
          </div>
        </div>
      </div>

      {message ? (
        <div className="text-center space-y-1">
          <p className={`${s.text} font-semibold tracking-wide text-gray-800`}>
            {message}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-deepRed-600 animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1 h-1 rounded-full bg-deepRed-500 animate-bounce [animation-delay:-0.1s]" />
            <span className="w-1 h-1 rounded-full bg-deepRed-400 animate-bounce" />
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes bazar-loader-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.7; }
        }
        @keyframes bazar-loader-orbit {
          0% { transform: rotate(0deg) translateX(10px) rotate(0deg); opacity: 0.9; }
          100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-deepRed-50/30 px-4">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
        {content}
      </div>
    );
  }

  return content;
}
