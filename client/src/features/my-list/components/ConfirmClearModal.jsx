import Icon from '../../../components/ui/Icon';

function ConfirmClearModal({ isOpen, onConfirm, onClose, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-chill-gray rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Hapus Semua dari Daftar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Tutup modal"
            disabled={isLoading}
          >
            <Icon name="x" className="h-6 w-6"/>
          </button>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-gray-300 text-base">
            Apakah Anda yakin ingin menghapus semua item dari daftar favorit Anda?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                        font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Icon name="delete" className="h-5 w-5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Icon name="delete" className="h-5 w-5" />
                <span>Hapus Semua</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmClearModal;