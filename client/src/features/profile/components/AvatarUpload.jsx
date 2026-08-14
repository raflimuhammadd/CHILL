import { useRef, useState } from 'react';
import Icon from '../../../components/ui/Icon';

function AvatarUpload({ avatarSrc, onAvatarChange }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Format harus JPG, PNG, atau WebP');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Maksimal 2MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    onAvatarChange?.(file);
  };

  return (
    <div className="mb-8 flex items-center gap-4 md:gap-6">
      <img
        src={preview || avatarSrc}
        alt="Foto profil"
        className="h-20 w-20 md:h-36 md:w-36 rounded-full object-cover bg-[#C4CAE8]"
      />

      <div>
        <button
          onClick={handleClick}
          className="rounded-full border border-[#3254FF] px-5 md:px-8 py-2.5 text-base md:text-lg font-bold text-[#3254FF] hover:bg-[#3254FF]/10 transition"
        >
          Ubah Foto
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-3 flex items-center gap-2 text-sm md:text-base text-white/65">
          <Icon name="upload" className="h-4 w-4" />
          <span>Maksimal 2MB</span>
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload;