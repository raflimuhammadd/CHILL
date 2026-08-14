import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../../services/client';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const noToken = !token;
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (noToken) return;
        let cancelled = false;
        const verifyEmail = async () => {
            try {
                const response = await apiClient.post('/auth/verify-email', { token });
                if (cancelled) return;
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verifikasi email gagal');
            }
        };

        verifyEmail();
        return () => {
            cancelled = true;
        }
    }, [token, noToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-white mb-2">Memverifikasi Email</h1>
                        <p className="text-gray-400">Mohon tunggu sebentar...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h1 className="text-2xl font-bold text-white mb-2">Berhasil!</h1>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <a 
                            href="/login" 
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Login Sekarang
                        </a>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Gagal</h1>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <a 
                            href="/login" 
                            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Kembali ke Login
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmailPage;