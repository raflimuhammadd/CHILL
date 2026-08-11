import { useState } from 'react';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import FilmDetailModal from '../../../components/shared/FilmDetailModal';
import EditFavoriteModal from '../components/EditFavoriteModal';
import ClearAllButton from '../components/ClearAllButton';
import ConfirmClearModal from '../components/ConfirmClearModal';
import { useFavorites } from '../../../hooks/useFavorites';
import MyListGrid from '../components/MyListGrid';
import { useFilmData } from '../../../hooks/useFilmData';
import useEditModalStore from '../../../store/editModalStore';

function MyListPage () {
  const {getFavoriteItems, updateFavoriteItem, clearFavorites} = useFavorites();
  const {films} = useFilmData();
  const [activeTab, setActiveTab] = useState('all');
  const { isOpen: isEditOpen, editingItem, closeEditModal } = useEditModalStore();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // get all favorite items
  const allItems = getFavoriteItems(films);

  // filter logic
  const filteredItems = {
    all: allItems,
    series: allItems.filter(item => item.episodes && item.episodes.includes(
      'Episode'
    )),
    film: allItems.filter(item => item.duration !== undefined)
  };

  // items to display based active tab
  const displayItems = filteredItems[activeTab];

  // empty message
  const emptyMessages = {
    all: 'Belum ada item di daftar Anda',
    series: 'Belum ada seri di daftar Anda',
    film: 'Belum ada film di daftar Anda'
  };

  const handleSaveEdit = (id, updates) => {
    updateFavoriteItem(id, updates);
    closeEditModal();
  };

  const handleCloseEditModal = () => {
    closeEditModal();
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      clearFavorites();
      console.log('Semua favorites berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus semua favorites:', error);
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false);
    }
  };


  return (
    <div className="min-h-screen bg-chill-dark">
      <Navbar />

      <main className="container-fluid pt-24 pb-8 sm:pb-12">
        <h1 className="header text-3xl sm:text-4xl md:text-5xl font-semibold text-white
        mb-4 sm:mb-6">
          Daftar Saya
        </h1>

        <ClearAllButton 
          onClick={() => setIsClearModalOpen(true)}
          disabled={!allItems.length}
          className="mb-4 sm:mb-6"
          isLoading={isClearing}
        />

         <div className="tabs-wrapper mb-4 sm:mb-6 flex gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-button pb-3 px-2 text-sm sm:text-base font-medium transition
              ${activeTab === 'all' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`tab-button pb-3 px-2 text-sm sm:text-base font-medium transition
              ${activeTab === 'series' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab('film')}
            className={`tab-button pb-3 px-2 text-sm sm:text-base font-medium transition
              ${activeTab === 'film' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Film
          </button>
        </div>
        
        {/* Grid */}
        <MyListGrid 
          items={displayItems}
          emptyMessage={emptyMessages[activeTab]}
        />
      </main>

      <EditFavoriteModal 
        key={editingItem?.id}
        isOpen={isEditOpen}
        film={editingItem}
        onSave={handleSaveEdit}
        onClose={handleCloseEditModal}
      />

      <ConfirmClearModal 
        isOpen={isClearModalOpen}
        onConfirm={handleClearAll}
        onClose={() => setIsClearModalOpen(false)}
        isLoading={isClearing}
      />

      <FilmDetailModal />
      <Footer />
    </div>
  )
}

export default MyListPage;