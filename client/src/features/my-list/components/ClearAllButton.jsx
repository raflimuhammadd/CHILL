import Icon from '../../../components/ui/Icon';

function ClearAllButton({ onClick, disabled = false, className = '', isLoading = false }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        border-2 rounded-full transition-colors flex items-center gap-2
        py-2 px-4 text-sm sm:text-base font-semibold
        ${disabled 
          ? 'border-red-500/50 text-red-500/50 opacity-50 cursor-not-allowed' 
          : isLoading
            ? 'border-red-400 text-red-400 cursor-wait'
            : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
        }
        ${className}
      `}
      aria-label="Hapus semua item dari daftar"
    >
      <Icon 
        name="delete" 
        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
      />
      <span>{isLoading ? 'Menghapus...' : 'Hapus Semua'}</span>
    </button>
  );
}

export default ClearAllButton;