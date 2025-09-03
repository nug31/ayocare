import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraIcon, ExclamationTriangleIcon, XMarkIcon, UserIcon, UserGroupIcon, BuildingOfficeIcon, ChartBarSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { HandlerLevel, HANDLER_LEVELS, getHandlerForCategory } from '../types/escalation';

const categories = [
  { value: 'classroom', label: 'Ruang Kelas' },
  { value: 'workshop-tkr', label: 'Workshop TKR' },
  { value: 'workshop-elind', label: 'Workshop ELIND' },
  { value: 'workshop-listrik', label: 'Workshop Listrik' },
  { value: 'workshop-tsm', label: 'Workshop TSM' },
  { value: 'workshop-tki', label: 'Workshop TKI' },
  { value: 'library', label: 'Perpustakaan' },
  { value: 'teacher-room', label: 'Ruang Guru' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'canteen', label: 'Kantin' },
  { value: 'toilet', label: 'Toilet' },
  { value: 'corridor', label: 'Koridor' },
  { value: 'yard', label: 'Halaman' },
  { value: 'parking', label: 'Parkiran' },
  { value: 'other', label: 'Lainnya' },
];

const priorities = [
  { value: 'low', label: 'Rendah', color: 'text-green-600', desc: 'Tidak mengganggu aktivitas' },
  { value: 'medium', label: 'Sedang', color: 'text-yellow-600', desc: 'Perlu perhatian' },
  { value: 'high', label: 'Tinggi', color: 'text-orange-600', desc: 'Mengganggu aktivitas' },
  { value: 'emergency', label: 'Darurat', color: 'text-red-600', desc: 'Berbahaya, butuh tindakan segera' },
];

export default function ReportForm() {
  const navigate = useNavigate();
  const { dispatch } = useReports();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    reporterName: '',
    reporterPosition: '',
    photos: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill data guru yang sedang login
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        reporterName: user.name,
        reporterPosition: user.subject ? `Guru ${user.subject}` : 'Guru'
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoUrls: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            photoUrls.push(e.target.result as string);
            if (photoUrls.length === files.length) {
              setFormData(prev => ({ ...prev, photos: [...prev.photos, ...photoUrls] }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Camera functions
  const openCamera = async () => {
    if (formData.photos.length >= 5) {
      alert('Maksimal 5 foto yang dapat diupload');
      return;
    }

    try {
      // First try with back camera, then fallback to any camera
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera if available
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (backCameraError) {
        console.log('Back camera not available, trying any camera...');
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      }
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait a bit for the modal to appear before setting video source
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(playError => {
            console.error('Error playing video:', playError);
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Tidak dapat mengakses kamera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Izin kamera ditolak. Silakan izinkan akses kamera di browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan di perangkat ini.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Kamera sedang digunakan oleh aplikasi lain.';
      } else {
        errorMessage += 'Pastikan browser memiliki izin menggunakan kamera.';
      }
      
      alert(errorMessage);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0);
        
        // Convert canvas to data URL
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Add photo to form data
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, photoDataUrl]
        }));
        
        // Close camera
        closeCamera();
      }
    }
  };

  // Initialize video stream when camera modal opens
  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [showCamera, stream]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Judul laporan wajib diisi';
    if (!formData.location.trim()) newErrors.location = 'Lokasi wajib diisi';
    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    if (!formData.reporterName.trim()) newErrors.reporterName = 'Nama pelapor wajib diisi';
    if (!formData.reporterPosition.trim()) newErrors.reporterPosition = 'Posisi/Jabatan wajib diisi';

    if (formData.description.length < 20) {
      newErrors.description = 'Deskripsi minimal 20 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({
        type: 'ADD_REPORT',
        payload: formData,
      });

      // Show success message
      alert('Laporan berhasil dikirim! Tim akan segera menindaklanjuti.');
      
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Laporan Baru</h1>
        <p className="text-gray-600">
          Laporkan kondisi abnormal atau berbahaya yang Anda temukan di lingkungan sekolah
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul Laporan *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: Engsel Pintu Rusak/Patah"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Lokasi *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih kategori...</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Spesifik *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: Workshop TKR Lantai 2, dekat area mesin"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>
        </div>

        {/* Priority Level */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tingkat Prioritas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {priorities.map(priority => (
              <label
                key={priority.value}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                  formData.priority === priority.value
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-center justify-center mb-2">
                  {priority.value === 'emergency' && (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <h3 className={`font-medium text-center ${priority.color}`}>{priority.label}</h3>
                <p className="text-xs text-gray-600 text-center mt-1">{priority.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Detail</h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Jelaskan kondisi yang Anda temukan *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Berikan deskripsi detail tentang kondisi yang Anda temukan, seperti: apa yang terlihat/terdengar, sejak kapan, seberapa sering terjadi, dll."
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              <p className="text-sm text-gray-500">{formData.description.length}/500 karakter</p>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto Bukti</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload foto kondisi (opsional, maksimal 5 foto)
              </label>
              
              {/* Camera and Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Camera Button */}
                <button
                  type="button"
                  onClick={openCamera}
                  disabled={formData.photos.length >= 5}
                  className={`border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-blue-50 ${
                    formData.photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <CameraIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">Ambil Foto Langsung</p>
                  <p className="text-xs text-blue-600 mt-1">Gunakan kamera perangkat</p>
                </button>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={formData.photos.length >= 5}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`cursor-pointer ${formData.photos.length >= 5 ? 'opacity-50' : ''}`}
                  >
                    <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Upload dari Galeri</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, maksimal 10MB per foto</p>
                  </label>
                </div>
              </div>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Handler Information */}
        {formData.category && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Informasi Penanganan</h2>
            </div>
            
            <div className="space-y-4">
              {(() => {
                const handlerLevel = getHandlerForCategory(formData.category);
                const handlerInfo = HANDLER_LEVELS[handlerLevel];
                
                const HandlerIcon = {
                  [HandlerLevel.USER]: UserIcon,
                  [HandlerLevel.WALAS]: UserGroupIcon,
                  [HandlerLevel.GA]: BuildingOfficeIcon,
                  [HandlerLevel.TOP_MANAGEMENT]: ChartBarSquareIcon,
                }[handlerLevel];
                
                const handlerColor = {
                  [HandlerLevel.USER]: 'bg-blue-50 border-blue-200 text-blue-800',
                  [HandlerLevel.WALAS]: 'bg-green-50 border-green-200 text-green-800',
                  [HandlerLevel.GA]: 'bg-orange-50 border-orange-200 text-orange-800',
                  [HandlerLevel.TOP_MANAGEMENT]: 'bg-red-50 border-red-200 text-red-800',
                }[handlerLevel];

                return (
                  <div className={`border rounded-lg p-4 ${handlerColor}`}>
                    <div className="flex items-start space-x-3">
                      <HandlerIcon className="h-6 w-6 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{handlerInfo.name}</h3>
                          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">Handler Awal</span>
                        </div>
                        <p className="text-sm mb-3">{handlerInfo.description}</p>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-1">Kemampuan penanganan:</h4>
                          <div className="flex flex-wrap gap-1">
                            {handlerInfo.capabilities.map((capability, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-white/30 rounded">
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {handlerLevel !== HandlerLevel.TOP_MANAGEMENT && (
                          <div className="mt-2 text-xs opacity-75">
                            <strong>Info:</strong> Laporan akan otomatis dieskalasi ke level berikutnya 
                            jika tidak ditangani dalam {Math.round(handlerInfo.escalationThreshold / 60)} jam
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()} 
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Catatan:</strong> Sistem akan secara otomatis menentukan handler yang tepat berdasarkan 
                  kategori lokasi yang dipilih. Jika diperlukan, laporan dapat dieskalasi ke level yang lebih tinggi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reporter Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pelapor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="reporterName"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 ${
                  errors.reporterName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nama lengkap Anda"
                readOnly
              />
              {errors.reporterName && <p className="mt-1 text-sm text-red-600">{errors.reporterName}</p>}
            </div>

            <div>
              <label htmlFor="reporterPosition" className="block text-sm font-medium text-gray-700 mb-2">
                Mata Pelajaran/Bidang Keahlian *
              </label>
              <input
                type="text"
                id="reporterPosition"
                name="reporterPosition"
                value={formData.reporterPosition}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 ${
                  errors.reporterPosition ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: Guru Teknik Mesin, Guru Elektronika"
                readOnly
              />
              {errors.reporterPosition && <p className="mt-1 text-sm text-red-600">{errors.reporterPosition}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}</span>
          </button>
        </div>
      </form>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Ambil Foto</h3>
              <button
                onClick={closeCamera}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-80 md:h-96 object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play();
                    }
                  }}
                />
                
                {/* Loading overlay when no stream */}
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                      <p className="text-white text-sm">Mengaktifkan kamera...</p>
                    </div>
                  </div>
                )}
                
                {/* Camera overlay */}
                {stream && (
                  <div className="absolute inset-0 border-2 border-white border-opacity-50 m-4 rounded-lg pointer-events-none">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                  </div>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex justify-center space-x-6">
                <button
                  onClick={closeCamera}
                  className="px-6 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors min-w-[100px]"
                >
                  Batal
                </button>
                <button
                  onClick={takePhoto}
                  className="px-8 py-3 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 min-w-[140px] justify-center"
                >
                  <CameraIcon className="h-6 w-6" />
                  <span>Ambil Foto</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 text-center font-medium">
                Arahkan kamera ke objek yang ingin difoto, lalu klik "Ambil Foto"
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
