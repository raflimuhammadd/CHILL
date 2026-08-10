import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import PaymentMethodOption from '../components/PaymentMethodOption';
import CountdownBox from '../components/CountdownBox';
import { Icon } from '../../../components';
import subscriptionPlans from '../data/subscriptionPlans';
import useAuthStore from '../../auth/store/authStore';

function PaymentPage() {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('checkout');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [countdown, setCountdown] = useState(15 * 60);
    const [paymentSession, setPaymentSession] = useState(null);
    const setPremium = useAuthStore((s) => s.setPremium);
    const location = useLocation();
    const selectedPlanId = location.state?.planId;

    useEffect(() => {
        if (!selectedPlanId) navigate('/premium');
    }, [selectedPlanId, navigate]);

    useEffect(() => {
        if (paymentStatus === 'waiting') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/premium');
                        return 0;
                    }
                    return prev -1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } 
    }, [paymentStatus, navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {mins: mins.toString().padStart(2, '0'), secs: secs.toString().padStart(2, '0')};
    };

    const handlePay = () => {
        // save to localstorage
        const session = {
            paymentCode: Math.random().toString(36).substring(2, 11).toUpperCase(),
            paymentMethod: selectedMethod,
            purchasedAt: new Date().toISOString(),
            expiresAt: Date.now() + 15 * 60 * 1000
        };
        localStorage.setItem('chill-payment', JSON.stringify(session));
        setPaymentSession(session);
        setPaymentStatus('waiting');
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const getPaymentMethodLabel = (method) => {
        if (method === 'bca') return 'BCA Virtual Account';
        if (method === 'card') return 'Kartu Kredit/Debit';
        return 'Metode Pembayaran';
    };

    const handleVoucherApply = () => {
        // just mock
        alert(`Voucher "${voucherCode}" applied!`)
    };

    const activePlan = subscriptionPlans.find(p => p.id === selectedPlanId)
        || subscriptionPlans[0]
        || {name: '-', price: '-', users: '-'};

    return (
        <div className="min-h-screen bg-chill-dark text-white flex flex-col">
            <Navbar />
            <div className="w-full max-w-450 mx-auto px-[clamp(0.5rem,2vw,1.5rem)]">


            <main className="container-responsive pt-24 md:pt-40 pb-16 md:pb-24">
                {paymentStatus === 'waiting' && (
                    <CountdownBox 
                        mins={formatTime(countdown).mins}
                        secs={formatTime(countdown).secs}
                    />
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
                    {paymentStatus === 'waiting' ? 'Pembayaran Sedang Berlangsung' : 'Pilih Metode Pembayaran'}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-[236px_1fr] gap-8 md:gap-16">
                    {/* left subs card  */}
                    <SubscriptionPlanCard 
                        plan={activePlan}
                        isSelected={true}
                        onSelect={() => {}}
                    />
                

                {/* right card pay */}
                <div className="md: order-last">
                    {paymentStatus === 'checkout' && (
                        <>
                            <section className="card-section mb-10">
                                <h2 className="text-xl font-bold mb-6">
                                    Metode Pembayaran
                                </h2>
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
                                            <span>Kartu Debit/Kredit</span>
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
                                </div>
                            </section>

                            {/* voucher */}
                            <section className="voucher-section mb-10">
                                <label className="block text-sm font-semibold mb-3">
                                    Kode Voucher (Jika ada)
                                </label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        placeholder="Masukkan kode voucher..."
                                        className="flex-1 h-12 rounded border border-white/70 
                                        bg-transparent px-4 text-sm"
                                    />
                                    <button
                                        onClick={handleVoucherApply}
                                        className="rounded-full bg-[#3D4142] px-7 font-bold text-sm
                                        hover:bg-[#4A4D4E] transition"
                                    >
                                        Gunakan
                                    </button>
                                </div>
                            </section>

                            {/* Transaction Summary */}
                            <section className="mb-10 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Paket Premium {activePlan?.name}</span>
                                    <span>{activePlan?.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Biaya Admin</span>
                                    <span>Rp3.000</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/20">
                                    <span>Total Pembayaran</span>
                                    <span>
                                    Rp{parseInt(activePlan?.price.replace(/\D/g, '')) + 3000}.00
                                    </span>
                                </div>
                            </section>

                            {/* pay */}
                            <div className="w-full md:w-45">
                                <button
                                    onClick={handlePay}
                                    className="btn-pay w-full rounded-full bg-[#0586FF] py-4 
                                    font-bold text-lg hover:bg-[#0367DB] active:bg-[#024DB7] transition"
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        </>
                    )}

                    {paymentStatus === 'waiting' && paymentSession && (
                        <>
                            {/* Metode Pembayaran */}
                        <section className="mb-6">
                            <h2 className="text-lg font-bold mb-3">Metode Pembayaran</h2>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/30 bg-[#2F3334]/30">
                                {paymentSession.paymentMethod === 'bca' && (
                                    <Icon name="bca" className="w-6 h-6" />
                                )}
                                {paymentSession.paymentMethod === 'card' && (
                                    <div className="flex gap-2">
                                        <Icon name="visa" className="w-8 h-6" />
                                        <Icon name="mastercard" className="w-8 h-6" />
                                    </div>
                                )}
                                <span className="font-semibold">
                                    {getPaymentMethodLabel(paymentSession.paymentMethod)}
                                </span>
                            </div>
                        </section>

                        {/* Tanggal Pembelian */}
                        <section className="mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white/70">Tanggal Pembelian</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold">
                                        {formatDate(paymentSession.purchasedAt)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Kode Pembayaran */}
                        <section className="mb-10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white/70">Kode Pembayaran</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-lg">
                                        {paymentSession.paymentCode}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(paymentSession.paymentCode)}
                                        className="p-2 rounded hover:bg-white/10 transition"
                                        title="Salin kode"
                                    >
                                        <Icon name="clipboard" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Ringkasan Transaksi */}
                        <section className="mb-10">
                            <h2 className="text-lg font-bold mb-4">Ringkasan Transaksi</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Paket Premium {activePlan?.name}</span>
                                    <span>{activePlan?.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Biaya Admin</span>
                                    <span>Rp3.000</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/20">
                                    <span>Total Pembayaran</span>
                                    <span>
                                        Rp{parseInt(activePlan?.price.replace(/\D/g, '')) + 3000}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Tata Cara Pembayaran */}
                        <section>
                            <h2 className="text-lg font-bold mb-4">Tata Cara Pembayaran</h2>
                            <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
                                {paymentSession.paymentMethod === 'bca' && (
                                    <>
                                        <li>Buka aplikasi BCA Mobile Banking atau akses BCA Internet Banking.</li>
                                        <li>Login ke akun Anda.</li>
                                        <li>Pilih menu "Transfer" atau "Pembayaran".</li>
                                        <li>Pilih opsi "Virtual Account" atau "Virtual Account Number".</li>
                                        <li>Masukkan nomor virtual account dan jumlah pembayaran, lalu konfirmasikan pembayaran.</li>
                                    </>
                                )}
                                {paymentSession.paymentMethod === 'card' && (
                                    <>
                                        <li>Isi data kartu kredit/debit Anda dengan lengkap.</li>
                                        <li>Masukkan kode CVV yang tertera di belakang kartu.</li>
                                        <li>Klik tombol "Bayar" untuk memproses pembayaran.</li>
                                        <li>Tunggu konfirmasi pembayaran dari bank Anda.</li>
                                    </>
                                )}
                            </ol>
                        </section>

                        {/* premium test */}
                        <button
                            onClick={() => {
                                setPremium(selectedPlanId);
                                navigate('/profile')
                            }}
                            className="mt-6 w-45 py-4 rounded-full bg-green-600 font-bold
                            text-lg hover:bg-green-500 transition"
                        >
                            Test Premium
                        </button>
                        </>
                    )}
                </div> 
                </div>
            </main>
            </div>
            <Footer/>
        </div>
    )
}

export default PaymentPage;