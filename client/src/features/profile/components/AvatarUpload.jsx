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

    const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 150;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const sourceSize = Math.min(img.width, img.height);
            const offsetX = (img.width - sourceSize) / 2;
            const offsetY = (img.height - sourceSize) / 2;

            ctx.drawImage(img, offsetX, offsetY, sourceSize, sourceSize, 0, 0, size, size);

            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            setPreview(compressed);
            onAvatarChange?.(compressed);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };


//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPreview(event.target.result);
//       onAvatarChange?.(event.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

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