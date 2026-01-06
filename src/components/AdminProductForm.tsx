import { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader2, Search, Edit, ArrowLeft } from 'lucide-react';

interface AdminProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';

export default function AdminProductForm({ isOpen, onClose, onSuccess }: AdminProductFormProps) {

  const [activeTab, setActiveTab] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [categories, setCategories] = useState<any[]>([]);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category_id: '',
    images: [''],
    in_stock: true,
    featured: false,
    hasSize: false,
    hasColor: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);


  useEffect(() => {
    resetForm();
    setSearchResults([]);
    setSearchQuery('');
    setSelectedProductId(null);
    setError('');
    setSuccess('');
  }, [activeTab]);

  const resetForm = () => {
    setFormData(initialFormState);
    setError('');
    setSuccess('');
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');

    try {

      const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();

        const results = Array.isArray(data) ? data : (data.products || []);
        setSearchResults(results);
        if (results.length === 0) setError('No products found.');
      } else {
        setError('Failed to fetch products.');
      }
    } catch (err) {
      setError('Error searching products.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProductId(product._id || product.id);

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : '',
      category_id: product.category_id || product.category?._id || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      in_stock: product.in_stock,
      featured: product.featured || false,
      hasSize: product.hasSize || false,
      hasColor: product.hasColor || false,
    });


    setSearchResults([]);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleArrayChange = (index: number, value: string, field: 'images') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'images') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (index: number, field: 'images') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleImageUpload = async (file: File, index: number) => {
    try {
      setUploadingIndex(index);
      setError('');

      const sigRes = await fetch(`${API_BASE}/api/get-signature`, { method: 'POST' });
      const sigData = await sigRes.json();

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sigData.apiKey);
      form.append('timestamp', sigData.timestamp.toString());
      form.append('signature', sigData.signature);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/upload`,
        { method: 'POST', body: form }
      );

      const cloudData = await cloudRes.json();
      handleArrayChange(index, cloudData.secure_url, 'images');
    } catch (err) {
      console.error('Image upload failed', err);
      setError('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const productData = {
        name: formData.name,
        slug,
        description: formData.description,
        price: parseFloat(formData.price),
        discountedPrice:
          formData.discountedPrice !== '' ? parseFloat(formData.discountedPrice) : undefined,
        category_id: formData.category_id || null,
        images: formData.images.filter((img) => img.trim() !== ''),
        in_stock: formData.in_stock,
        featured: formData.featured,
        hasSize: formData.hasSize,
        hasColor: formData.hasColor,
      };


      const url = activeTab === 'create'
        ? `${API_BASE}/api/admin/products`
        : `${API_BASE}/api/admin/products/${selectedProductId}`;

      const method = activeTab === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setSuccess(activeTab === 'create' ? 'Product created successfully!' : 'Product updated successfully!');

      if (activeTab === 'create') {
        setFormData(initialFormState);
      }

      setTimeout(() => {
        onSuccess?.();

        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const showSearch = activeTab === 'update' && !selectedProductId;
  const showForm = activeTab === 'create' || (activeTab === 'update' && selectedProductId);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50">
        <div className="bg-zinc-950 border border-zinc-800 p-8 m-4">


          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`text-lg tracking-widest transition-colors ${activeTab === 'create' ? 'text-white font-bold border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                CREATE
              </button>
              <button
                onClick={() => setActiveTab('update')}
                className={`text-lg tracking-widest transition-colors ${activeTab === 'update' ? 'text-white font-bold border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                UPDATE
              </button>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 mb-6 text-sm">{error}</div>}
          {success && <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-3 mb-6 text-sm">{success}</div>}


          {showSearch && (
            <div className="space-y-6">
              <div>
                <label className="block text-zinc-400 text-sm mb-2 tracking-wider">SEARCH PRODUCT TO EDIT</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="Enter product name..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={searching}
                    className="bg-white text-black px-6 hover:bg-zinc-200 transition-colors flex items-center"
                  >
                    {searching ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                  </button>
                </form>
              </div>


              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border border-zinc-800 divide-y divide-zinc-800">
                  {searchResults.map((product) => (
                    <div
                      key={product._id || product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-4 bg-black hover:bg-zinc-900 cursor-pointer flex justify-between items-center group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {product.images && product.images[0] && (
                          <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                        )}
                        <div>
                          <p className="text-white font-medium group-hover:text-blue-400 transition-colors">{product.name}</p>
                          <p className="text-zinc-500 text-sm">${product.price}</p>
                        </div>
                      </div>
                      <Edit className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6">


              {activeTab === 'update' && (
                <button
                  type="button"
                  onClick={() => { setSelectedProductId(null); setSearchResults([]); }}
                  className="flex items-center text-zinc-500 hover:text-white text-sm mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
                </button>
              )}

              <div>
                <label className="block text-zinc-400 text-sm mb-2 tracking-wider">PRODUCT NAME *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="Diamond Necklace"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2 tracking-wider">DESCRIPTION</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">PRICE * (INR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="299.99"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">DISCOUNTED PRICE</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    placeholder="Optional discounted price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2 tracking-wider">CATEGORY</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasSize"
                    checked={formData.hasSize}
                    onChange={handleChange}
                    className="w-5 h-5 bg-black border border-zinc-800"
                  />
                  <span className="text-zinc-400 text-sm tracking-wider">HAS SIZE</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasColor"
                    checked={formData.hasColor}
                    onChange={handleChange}
                    className="w-5 h-5 bg-black border border-zinc-800"
                  />
                  <span className="text-zinc-400 text-sm tracking-wider">HAS COLOR</span>
                </label>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2 tracking-wider">IMAGES</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                      className="flex-1 bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files[0], index)
                      }
                      className="text-sm text-white"
                    />
                    {uploadingIndex === index ? (
                      <Loader2 className="animate-spin text-white w-5 h-5" />
                    ) : (
                      image && <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    )}
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'images')}
                        className="bg-red-900/20 text-red-400 px-4 py-3 border border-red-900 hover:bg-red-900/30 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayField('images')}
                  className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="in_stock"
                    checked={formData.in_stock}
                    onChange={handleChange}
                    className="w-5 h-5 bg-black border border-zinc-800 text-white focus:ring-0"
                  />
                  <span className="text-zinc-400 text-sm tracking-wider">IN STOCK</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 bg-black border border-zinc-800 text-white focus:ring-0"
                  />
                  <span className="text-zinc-400 text-sm tracking-wider">FEATURED</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || uploadingIndex !== null}
                className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (activeTab === 'create' ? 'CREATING...' : 'UPDATING...')
                  : (activeTab === 'create' ? 'CREATE PRODUCT' : 'UPDATE PRODUCT')
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}