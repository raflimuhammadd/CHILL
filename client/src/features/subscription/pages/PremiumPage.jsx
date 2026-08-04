import { useState } from 'react';
import { Icon } from '../../../components';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import subscriptionPlans from '../data/subscriptionPlans';

function FeatureCard({ icon, title }) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <Icon name={icon} className="w-12 h-12 md:w-16 md:h-16" />
      <h3 className="text-sm md:text-base font-semibold text-white leading-tight">
        {title}
      </h3>
    </div>
  );
}

function PremiumPage() {
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  return (
    <div className="min-h-screen bg-chill-dark text-white flex flex-col mt-20">
      <Navbar />
    
    <section className="why-subscribe container-responsive pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-3xl md:text-5xl font-bold mb-6 md:mb-8">
            Kenapa Harus Berlangganan?
            </h2>
            <p className="text-center text-base md:text-lg text-white/60 mb-12 md:mb-16 px-4">
            Dapatkan pengalaman menonton yang lebih baik dengan beberapa keuntungan melanjutkan langganan premium kami.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 md:gap-y-16 gap-x-6 md:gap-x-8">
                <FeatureCard icon="download" title="Download Konten Pilihan" />
                <FeatureCard icon="ads" title="Tidak ada iklan" />
                <FeatureCard icon="streams" title="Tonton Semua Konten" />
                <FeatureCard icon="fourK" title="Kualitas Maksimal Sampai Dengan 4K" />
                <FeatureCard icon="platforms" title="Tonton di Tv, Tablet, Mobile, dan Laptop" />
                <FeatureCard icon="subtitle" title="Subtitle Untuk Konten Pilihan" />
            </div>
        </div>
    </section>

      <main className="flex-1 pt-24 md:pt-28">
        <section className="flex-1 pb-16 md:pb-20">
            <div className="bg-chill-gray rounded-none md:rounded-t-4xl mx-0 md:mx-4 lg:mx-8">
                <div className="container-responsive pt-12 md:pt-16 pb-12 md:pb-20">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                    Pilih Paketmu
                    </h1>
                    <p className="text-base md:text-lg text-white/60 mb-10 md:mb-14">
                    Temukan paket sesuai kebutuhanmu!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {subscriptionPlans.map((plan) => (
                        <SubscriptionPlanCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlanId === plan.id}
                        onSelect={setSelectedPlanId}
                        />
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PremiumPage;