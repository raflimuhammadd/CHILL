import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';

function PremiumGateModal() {
  const navigate = useNavigate();

  const features = [
    { icon: 'download', title: 'Download Konten\nPilihan' },
    { icon: 'ads', title: 'Tidak Ada Iklan' },
    { icon: 'streams', title: 'Tonton Semua Konten' },
    { icon: 'fourK', title: 'Kualitas Maksimal\nSampai Dengan 4K' },
    { icon: 'platforms', title: 'Tonton di Tv, Tablet,\nMobile, dan Laptop' },
    { icon: 'subtitle', title: 'Subtitle Untuk Konten\nPilihan' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 text-white backdrop-blur-sm">
      <div className="w-full max-w-2xl px-6 text-center">
        <h2 className="mb-3 text-3xl font-bold">Layanan Premium🌟</h2>
        <p className="mb-16 text-lg text-white/90">
          Tingkatkan paket anda untuk dapat menonton video ini.
        </p>

        <h3 className="mb-6 text-lg font-medium">Kenapa Harus Berlangganan?</h3>

        <div className="mb-16 grid grid-cols-3 gap-x-14 gap-y-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-4">
              <Icon name={feature.icon} className="h-7 w-7 text-white" />
              <span className="whitespace-pre-line text-sm leading-6 text-white/80">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/premium')}
          className="rounded-full bg-[#09147A] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0B1CA8]"
        >
          Ubah Jadi Premium
        </button>
      </div>
    </div>
  );
}

export default PremiumGateModal;