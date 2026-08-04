import { useState } from 'react';
import Icon from '../../../components/ui/Icon';
import { Input } from '../../../components/ui';

function ProfileField({ label, value, name, editing, onChange, onEdit }) {
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
          <p className="text-lg md:text-xl leading-snug text-white">
            {value || '-'}
          </p>
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

  const handleEdit = (fieldName) => {
    setEditingField(editingField === fieldName ? null : fieldName);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updates = {};
    if (formData.full_name !== user?.full_name) updates.full_name = formData.full_name;
    if (formData.email !== user?.email) updates.email = formData.email;
    if (formData.password) updates.password = formData.password;
    onSave(updates);
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