import { useFavorites } from './useFavorites';
import filmData from '../data/filmData';

export const useFilmData = () => {
  const { getMergedFilm } = useFavorites();
  
  // Get single film by ID (merged)
  const getFilmById = (id) => {
    return getMergedFilm(id) || null;
  };
  
  // Get all films (merged)
  const getAllFilms = () => {
    return Object.keys(filmData).map(key => {
      const film = filmData[key];
      return getMergedFilm(film.id) || film;
    });
  };
  
  // Filter films by criteria (merged)
  const getFilmsByType = (type) => {
    const allFilms = getAllFilms();
    
    if (type === 'series') {
      return allFilms.filter(f => f.episodes);
    }
    if (type === 'film') {
      return allFilms.filter(f => f.duration);
    }
    return allFilms;
  };
  
  return {
    getFilmById,
    getAllFilms,
    getFilmsByType
  };
};