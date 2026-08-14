import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/Icon';
import { Input } from '../../../components/ui';
import useAuthStore from '../../auth/store/authStore';

function ProfileField({ label, value, name, editing, onChange, onEdit, badge }) {
  if (editing) {
    return (
      <div className="rounded-lg border border-[#E7E3FC3B] bg-[#22282A] px-4 py-3 md:px-5 md:py-4">
        <p className="text-base md:text-lg leading-snug text-white/55 mb-2">
          {label}
        </p>
        <Input
          name={name}
          type={name === 'password' ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={`Masukkan ${label.toLowerCase()}`}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E7E3FC3B] bg-[#22282A] px-4 py-3 md:px-5 md:py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base md:text-lg leading-snug text-white/55">
            {label}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg md:text-xl leading-snug text-white">
              {value || '-'}
            </p>
            {badge}
          </div>
        </div>
        <button onClick={() => onEdit(name)} className="shrink-0">
          <Icon name="update" className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}


function ProfileForm({ user, onSave }) {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '',
  });
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [cooldown, setCooldown] = useState(0);
  const { resendVerification } = useAuthStore();

  const isEmailVerified = user?.email_verified === 1;
  const hasEmail = Boolean(formData.email);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    const result = await resendVerification();
    setStatusMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setResending(false);
    if (result.success) setCooldown(30);
  };

  const emailBadge = !hasEmail ? (
    <span className="text-xs md:text-sm text-white/40">Email belum diatur</span>
  ) : isEmailVerified ? (
    <span className="inline-flex items-center gap-1 text-xs md:text-sm text-green-400">
      <Icon name="check" className="h-4 w-4" /> Terverifikasi
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-xs md:text-sm">
      <span className="text-amber-400">
        Belum terverifikasi
      </span>
      <button
        type="button"
        onClick={handleResend}
        disabled={resending || cooldown > 0}
        className="text-blue-300 hover:text-blue-500 underline disabled:opacity-50"
      >
        {resending ? 'Mengirim ulang...' : cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang'}
    </button>
    </span>
  );

  const handleEdit = (fieldName) => {
    setEditingField(editingField === fieldName ? null : fieldName);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const updates = {};
    if (formData.full_name !== user?.full_name) updates.full_name = formData.full_name;
    if (formData.email !== user?.email) updates.email = formData.email;
    if (formData.password) updates.password = formData.password;

    setStatusMessage({ type: '', text: '' });
    const result = await onSave(updates);

    if (!result.success) {
      setStatusMessage({
        type: 'error',
        text: result?.message || 'Terjadi kesalahan saat menyimpan profil',
      });
    } else if (updates.email) {
      setStatusMessage({
        type: 'success',
        text: `Verifikasi email dikirim ke ${formData.email}. Cek inbox anda`,
      });
    }
    setEditingField(null);
  };

  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8">
        Profil Saya
      </h1>

      <div className="max-w-172.5 space-y-6">
        <ProfileField
          label="Nama Pengguna"
          value={user?.username || '-'}
        />
        <ProfileField
          label="Nama Lengkap"
          value={formData.full_name}
          name="full_name"
          editing={editingField === 'full_name'}
          onChange={handleChange}
          onEdit={handleEdit}
        />
        <ProfileField
          label="Email"
          value={formData.email}
          name="email"
          badge={emailBadge}
          editing={editingField === 'email'}
          onChange={handleChange}
          onEdit={handleEdit}
        />
        <ProfileField
          label="Kata Sandi"
          value={editingField === 'password' ? formData.password : '***************'}
          name="password"
          editing={editingField === 'password'}
          onChange={handleChange}
          onEdit={handleEdit}
        />
      </div>

      {statusMessage.text && (
        <div className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
          statusMessage.type === 'success'
            ? 'border-green-500 text-green-400'
            : 'border-red-500 text-red-400'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-8 rounded-full bg-[#0F1E93] hover:bg-[#09147A] px-8 py-3 text-base md:text-lg font-bold text-white transition"
      >
        Simpan
      </button>
    </div>
  );
}

export default ProfileForm;