function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="glass-card p-6 rounded-xl shadow-xl text-center">
        <div className="loading-spinner mx-auto mb-3"></div>
        <h3 className="text-lg font-semibold text-gradient mb-1">Loading</h3>
        <p className="text-gray-600 text-sm">Please wait while we prepare your experience...</p>
      </div>
    </div>
  );
}

export default Loading;