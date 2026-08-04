import MovieCard from '../../../components/shared/MovieCard';
import Icon from '../../../components/ui/Icon';

/**
 * Grid component for favorites
 * 
 * @param {Array} items
 * @param {string} emptyMessage
 */
function MyListGrid({ items, emptyMessage }) {
  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="my-list-empty-state text-center py-20">
        <div className="empty-state-icon mb-6">
          <Icon name="crown" className="h-12 w-12 mx-auto stroke-gray-400" />
        </div>
        <p className="empty-state-message text-gray-400 text-base sm:text-lg max-w-md mx-auto">
          {emptyMessage || "Belum ada item di daftar Anda"}
        </p>
      </div>
    );
  }

  // Grid with items
  return (
    <div className="my-list-grid">
      <div className="grid grid-cols-2 justify-items-center sm:grid-cols-3 md:grid-cols-4 
                      lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {items.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            variant="portrait"
            showNewEpisode={item.hasNewEpisode}
            hoverVariant='mylist'
          />
        ))}
      </div>
    </div>
  );
}

export default MyListGrid;