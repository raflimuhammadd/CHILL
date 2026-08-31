import useFavoritesStore from '../features/my-list/store/favoritesStore';
import useAuthStore from '../features/auth/store/authStore';

export function useFavorites() {
  const favStore = useFavoritesStore();
  const user = useAuthStore((state) => state.user);

  return {
    ...favStore,
    favorites: user?.favorites || [],
    isFavorite: (id) => useAuthStore.getState().isFavorite(id),
    getFavoriteItems: favStore.getFavoriteItems,
  };
}