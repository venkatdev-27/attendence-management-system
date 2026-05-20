const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const spinner = <div className={`${sizes[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
  if (fullScreen) return <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-50">{spinner}</div>
  return <div className="flex items-center justify-center">{spinner}</div>
}
export default LoadingSpinner