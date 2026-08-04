import { useState } from "react";
import Icon from "../../../components/ui/Icon";

function EditFavoriteModal({isOpen, film, onClose, onSave}) {

    const [formData, setFormData] = useState({
    title: film?.title || '',
    genres: film?.genres || [],
    rating: film?.rating?.split('/')[0] || '',
    image: film?.image || ''
});


    // handle form
    const handleSubmit = (e) => {
        e.preventDefault();

        const ratingNum = parseFloat(formData.rating);
        if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            alert('Rating must be a number between 0 and 5');
            return;
        }

        const updates = {
            title: formData.title,
            genres: formData.genres,
            rating: `${formData.rating}/5`,
        };

        if (formData.image) {
            updates.image = formData.image;
        }

        onSave(film.id, updates);
        onClose();
    };

    if (!isOpen || !film) return null;

    return (
        <div className="flex fixed inset-0 z-50 items-center justify-center bg-black/60 
                    backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="bg-chill-dark rounded-md p-8 max-w-3xl w-full mx-4 max-h-[80vh
                            overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">
                        Edit Film
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                        aria-label="Close modal"
                    >
                        <Icon name="x" className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Judul Film */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Judul Film
                        </label>
                        <input 
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-chill-dark/70 border border-gray-700 rounded-lg 
                                        text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                                        focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="e.g. The Batman"
                            required
                        />
                    </div>

                    {/* Genre & Rating - 2 Column Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Genre Column */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Genre
                            </label>
                            <input 
                                type="text"
                                value={formData.genres.join(', ')}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                                }))}
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                                            text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                                            focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="Action"
                            />
                        </div>

                        {/* Rating Column */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rating
                            </label>
                            <input 
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                                            text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
                                            focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="8.5"
                                required
                            />
                        </div>
                    </div>

                    {/* URL Gambar Poster */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            URL Gambar Poster
                        </label>
                        <input 
                            type="url"
                            pattern="https?://.+"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                                        text-white placeholder-gray-500 focus:outline-none focus:border-red-500 
                                        focus:ring-1 focus:ring-red-500 transition"
                            placeholder="https://via.placeholder.com/150"
                        />
                    </div>

                    {/* Actions Buttons */}
                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 
                                        text-white rounded-lg font-medium transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 
                                        text-white rounded-lg font-medium transition"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default EditFavoriteModal