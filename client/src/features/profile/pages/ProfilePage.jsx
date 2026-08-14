import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import AvatarUpload from '../components/AvatarUpload';
import {uploadAvatar} from '../../../services/uploadService';
import ProfileForm from '../components/ProfileForm';
import SubscriptionCard from '../../subscription/components/SubscriptionCard';
import MyListGrid from '../../my-list/components/MyListGrid';
import { useFavorites } from '../../../hooks/useFavorites';
import {useDetailModal} from '../../../hooks/useDetailModal';
import useAuthStore from '../../auth/store/authStore';
import {useFilmData} from '../../../hooks/useFilmData';

function ProfilePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {films} = useFilmData();
  const { getFavoriteItems } = useFavorites();
  const favoriteItems = getFavoriteItems(films).slice(0, 9);
  useDetailModal();
  const avatarSrc = user?.avatar_url || '/assets/images/profile.png';
  // const isSubscribed = true;
  const isSubscribed = Boolean(user?.isPremium);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);
  if (!user) {
    return (
      <div className="min-h-screen bg-chill-dark flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSave = async (updates) => {
    const payload = {...updates};

    if (avatarFile) {
      try {
        const uploadResult = await uploadAvatar(avatarFile);
        payload.avatar_url = uploadResult.data.url;
      } catch (error) {
        console.error('Upload failed:', error);
        return {success: false, message: 'Gagal upload foto'};
      }
    }

    const result = await useAuthStore.getState().updateProfile(payload)

    if (result.success) {
      setAvatarFile(null);
    }
    return result;
  }

  return (
    <div className="min-h-screen bg-chill-dark text-white flex flex-col">
      <Navbar />
      <div className="w-full max-w-450 mx-auto px-[clamp(0.5rem,2vw,1.5rem)]">

      <main className="flex-1 pt-24 md:pt-28">
        <section className="container-responsive pt-8 md:pt-14 pb-12 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(320px,560px)] gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <AvatarUpload 
                  avatarSrc={avatarSrc}
                  onAvatarChange={setAvatarFile} 
                />
              <ProfileForm
                  user={user}
                  onSave={handleSave}
              />
            </div>
            <div className="order-1 md:order-2 md:pt-16">
              <SubscriptionCard isSubscribed={isSubscribed} plan={user?.subscriptionPlan} />
            </div>
          </div>
        </section>
        <section className="container-responsive pb-12 md:pb-20">
          <div className="mb-5 md:mb-8 flex items-center justify-between">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Daftar Saya
            </h2>
          </div>
          <MyListGrid 
              items={favoriteItems}
              emptyMessage="Belum ada item di daftar Anda" 
          />
        </section>
      </main>

      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;