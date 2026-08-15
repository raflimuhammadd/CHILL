import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import PaymentMethodOption from '../components/PaymentMethodOption';
import { Icon } from '../../../components';
import subscriptionPlans from '../data/subscriptionPlans';
import useAuthStore from '../../auth/store/authStore';
import { createPayment, verifyPayment } from '../../../services/paymentService';

function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedPlanId = location.state?.planId;

    const fetchMe = useAuthStore((s) => s.fetchMe);

    const [paymentStatus, setPaymentStatus] = useState('checkout');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedPlanId) navigate('/premium');
    }, [selectedPlanId, navigate]);

        const getMethodLabel = (method) => {
        if (method === 'bca') return 'BCA Virtual Account';
        if (method === 'card') return 'Kartu Kredit/Debit';
        if (method === 'qris') return 'QRIS';
        return 'Metode Pembayaran';
    };

    const formatAmount = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

    const formatDate = (iso) => {
        if (!iso) return 'Tidak ada batas waktu';
        const date = new Date(iso);
        if (isNaN(date.getTime())) return 'Tidak ada batas waktu';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Tersalin!');
    };

    const extractPrice = (priceString) => {
        if (typeof priceString === 'number') return priceString;
        return parseInt(priceString?.replace?.(/\D/g, '') || '0');
    };

    const handlePay = async () => {
        if (!selectedMethod) return toast.error('Pilih metode pembayaran dulu');
        setIsLoading(true);
        try {
            const body = await createPayment({
                plan_slug: selectedPlanId,
                payment_method: selectedMethod,
            });
            setSession(body.data);
            setPaymentStatus('waiting');
            if (selectedMethod === 'card' && body.data?.order?.code) {
                await checkStatusAsync(body.data.order.code, false);
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Gagal membuat pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    const checkStatusAsync = async (orderCode, silent = false) => {
        if (!orderCode) return;
        try {
            const body = await verifyPayment(orderCode);
            const status = body.data?.status;

            if (status === 'succeeded') {
                await fetchMe();
                setPaymentStatus('success');
            } else if (status === 'failed') {
                setPaymentStatus('failed');
            } else if (status === 'expired') {
                setPaymentStatus('expired');
            } else if (!silent) {
                toast('Pembayaran belum terdeteksi, coba lagi nanti');
            }
        } catch (e) {
            if (!silent) toast.error(e?.response?.data?.message || 'Gagal cek status');
        }
    };

    useEffect(() => {
        if (paymentStatus !== 'waiting' || !session) return;
        const timer = setInterval(() => checkStatusAsync(session.order.code, true), 5000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentStatus, session]);

    const activePlan = subscriptionPlans.find((p) => p.id === selectedPlanId)
        || subscriptionPlans[0]
        || { name: '-', price: '0' };


    return (
        <div className="min-h-screen bg-chill-dark text-white flex flex-col">
            <Navbar />
            <div className="w-full max-w-450 mx-auto px-[clamp(0.5rem,2vw,1.5rem)]">
                <main className="container-responsive pt-24 md:pt-40 pb-16 md:pb-24">
                    <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
                        {paymentStatus === 'waiting' ? 'Pembayaran Sedang Berlangsung' : 'Pilih Metode Pembayaran'}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-[236px_1fr] gap-8 md:gap-16">
                        <SubscriptionPlanCard
                            plan={activePlan}
                            isSelected={true}
                            onSelect={() => {}}
                        />

                        <div className="md:order-last">
                            {paymentStatus === 'checkout' && (
                                <>
                                    <section className="card-section mb-10">
                                        <h2 className="text-xl font-bold mb-6">Metode Pembayaran</h2>
                                        <div className="space-y-4">
                                            <PaymentMethodOption
                                                selected={selectedMethod === 'card'}
                                                onClick={() => setSelectedMethod('card')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-2">
                                                        <Icon name="visa" className="w-10 h-7" />
                                                        <Icon name="mastercard" className="w-10 h-7" />
                                                        <Icon name="jcb" className="w-10 h-7" />
                                                        <Icon name="american" className="w-10 h-7" />
                                                    </div>
                                                    <span>Kartu Debit/Krebit</span>
                                                </div>
                                            </PaymentMethodOption>

                                            <PaymentMethodOption
                                                selected={selectedMethod === 'bca'}
                                                onClick={() => setSelectedMethod('bca')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon name="bca" className="w-6 h-6" />
                                                    <span>BCA Virtual Account</span>
                                                </div>
                                            </PaymentMethodOption>

                                            <PaymentMethodOption
                                                selected={selectedMethod === 'qris'}
                                                onClick={() => setSelectedMethod('qris')}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon name="qris" className="w-6 h-6" />
                                                    <span>QRIS</span>
                                                </div>
                                            </PaymentMethodOption>
                                        </div>
                                    </section>

                                    <section className="mb-10 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Paket Premium {activePlan?.name}</span>
                                            <span>{activePlan?.price}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/20">
                                            <span>Total Pembayaran</span>
                                            <span>{formatAmount(session?.order?.amount || extractPrice(activePlan?.price))}</span>
                                        </div>
                                    </section>

                                    <div className="w-full md:w-45">
                                        <button
                                            onClick={handlePay}
                                            disabled={isLoading || !selectedMethod}
                                            className="btn-pay w-full rounded-full bg-[#0586FF] py-4 font-bold text-lg
                                                       hover:bg-[#0367DB] active:bg-[#024DB7] transition
                                                       disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {paymentStatus === 'waiting' && session && (
                                <>
                                    <section className="mb-6">
                                        <h2 className="text-lg font-bold mb-3">Metode Pembayaran</h2>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/30 bg-[#2F3334]/30">
                                            {selectedMethod === 'bca' && <Icon name="bca" className="w-6 h-6" />}
                                            {selectedMethod === 'card' && (
                                                <div className="flex gap-2">
                                                    <Icon name="visa" className="w-8 h-6" />
                                                    <Icon name="mastercard" className="w-8 h-6" />
                                                </div>
                                            )}
                                            {selectedMethod === 'qris' && <Icon name="qris" className="w-6 h-6" />}
                                            <span className="font-semibold">{getMethodLabel(selectedMethod)}</span>
                                        </div>
                                    </section>

                                    <section className="mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white/70">Kode Pesanan</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold text-lg">{session?.order?.code}</span>
                                                <button
                                                    onClick={() => copyToClipboard(session?.order?.code)}
                                                    className="p-2 rounded hover:bg-white/10 transition"
                                                    title="Salin kode"
                                                >
                                                    <Icon name="clipboard" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="mb-10">
                                        <h2 className="text-lg font-bold mb-4">Cara Pembayaran</h2>
                                        {session?.payment?.type === 'va' && (
                                            <div className="space-y-4">
                                                <p className="text-sm text-white/80">
                                                    Transfer ke Virtual Account berikut melalui BCA Mobile / KlikBCA / ATM:
                                                </p>
                                                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/30">
                                                    <span className="font-mono font-bold text-xl">{session?.payment?.va_number}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(session?.payment?.va_number)}
                                                        className="p-2 rounded hover:bg-white/10 transition"
                                                    >
                                                        <Icon name="clipboard" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-white/60">
                                                    Berlaku hingga {formatDate(session?.payment?.expiry_time)}
                                                </p>
                                            </div>
                                        )}

                                        {session?.payment?.type === 'qris' && (
                                            <div className="space-y-4">
                                                <p className="text-sm text-white/80">Scan QRIS berikut dengan aplikasi pembayaran kamu:</p>
                                                {session?.payment?.qr_url ? (
                                                    <img
                                                        src={session.payment.qr_url}
                                                        alt="QRIS"
                                                        className="w-56 h-56 mx-auto rounded-xl bg-white p-3"
                                                    />
                                                ) : (
                                                    <p className="text-sm text-white/60">QR Code tidak tersedia</p>
                                                )}
                                                <p className="text-xs text-white/60 text-center">
                                                    Berlaku hingga {formatDate(session?.payment?.expiry_time)}
                                                </p>
                                            </div>
                                        )}

                                        {session?.payment?.type === 'card' && (
                                            <p className="text-sm text-white/80">Transaksi kartu sedang diproses...</p>
                                        )}
                                    </section>

                                    <button
                                        onClick={() => checkStatusAsync(session?.order?.code, false)}
                                        disabled={isLoading}
                                        className="w-full rounded-full bg-[#3D4142] py-4 font-bold text-lg
                                                   hover:bg-[#4A4D4E] transition disabled:opacity-50"
                                    >
                                        {isLoading ? 'Memeriksa...' : 'Cek Status Pembayaran'}
                                    </button>
                                    <p className="text-center text-xs text-white/60 mt-3">
                                        Sudah bayar tapi belum aktif? Klik tombol di atas — sistem akan cek langsung ke Midtrans.
                                    </p>
                                </>
                            )}

                            {paymentStatus === 'success' && (
                                <div className="text-center space-y-6 py-10">
                                    <Icon name="check" className="w-16 h-16 mx-auto text-green-500" />
                                    <h2 className="text-2xl font-bold">Pembayaran Berhasil</h2>
                                    <p className="text-white/70">Selamat menikmati Chill Streams Premium!</p>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="rounded-full bg-[#0586FF] px-10 py-3 font-bold hover:bg-[#0367DB] transition"
                                    >
                                        Lanjut ke Profil
                                    </button>
                                </div>
                            )}

                            {(paymentStatus === 'failed' || paymentStatus === 'expired') && (
                                <div className="text-center space-y-6 py-10">
                                    <h2 className="text-2xl font-bold text-red-500">
                                        {paymentStatus === 'failed' ? 'Pembayaran Gagal' : 'Pembayaran Kedaluwarsa'}
                                    </h2>
                                    <p className="text-white/70">
                                        {paymentStatus === 'failed'
                                            ? 'Transaksi tidak berhasil. Silakan pilih paket lagi.'
                                            : 'Waktu pembayaran habis. Silakan buat pesanan baru.'}
                                    </p>
                                    <button
                                        onClick={() => navigate('/premium')}
                                        className="rounded-full bg-[#0586FF] px-10 py-3 font-bold hover:bg-[#0367DB] transition"
                                    >
                                        Pilih Paket Lagi
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentPage;