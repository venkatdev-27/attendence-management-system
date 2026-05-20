const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
  if (fullScreen) return <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-50">{spinner}</div>
  return <div className="flex items-center justify-center p-8">{spinner}</div>
}
export default LoadingSpinner