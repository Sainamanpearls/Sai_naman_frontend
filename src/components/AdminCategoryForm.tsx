import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AdminCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';

export default function AdminCategoryForm({ isOpen, onClose, onSuccess, initialData }: AdminCategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        image_url: initialData.image_url || '',
      });
    } else if (isOpen) {
      setFormData({ name: '', image_url: '' });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError('');
      setSuccess('Uploading image...');

      // Get Cloudinary signature
      const sigRes = await fetch(`${API_BASE}/api/get-signature`, { method: 'POST' });
      const sigData = await sigRes.json();

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sigData.apiKey);
      form.append('timestamp', sigData.timestamp.toString());
      form.append('signature', sigData.signature);

      // Upload to Cloudinary
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/upload`, {
        method: 'POST',
        body: form,
      });
      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) throw new Error('Cloudinary upload failed');

      console.log('Uploaded image URL:', cloudData.secure_url);

      setFormData(prev => ({ ...prev, image_url: cloudData.secure_url }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (uploading) {
      setError('Please wait for the image to finish uploading');
      setLoading(false);
      return;
    }

    if (!formData.name) {
      setError('Category name is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const method = initialData ? 'PUT' : 'POST';
      const url = initialData
        ? `${API_BASE}/api/admin/categories/${initialData._id}`
        : `${API_BASE}/api/admin/categories`;

      const payload = {
        ...formData,
        slug: generateSlug(formData.name),
      };

      console.log('Submitting payload:', payload);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Payload to backend:', payload)

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save category');

      setSuccess(initialData ? 'Category updated successfully!' : 'Category created successfully!');
      setFormData({ name: '', image_url: '' });

      setTimeout(() => {
        onSuccess?.(); // Refresh categories in parent
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <div className="bg-zinc-950 border border-zinc-800 p-8 m-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-light tracking-widest text-white">
              {initialData ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
            </h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 mb-6 text-sm">{error}</div>}
          {success && <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-3 mb-6 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">CATEGORY NAME *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                placeholder="Necklace"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">IMAGE</label>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  className="text-sm text-white"
                />
                {uploading && <Loader2 className="animate-spin text-white w-5 h-5" />}
                {formData.image_url && !uploading && (
                  <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (initialData ? 'UPDATING...' : 'CREATING...') : initialData ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
