import { useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import ImageCropper from './ImageCropper'

/**
 * Composant pour l'upload d'image (fichier ou caméra)
 * Mobile-first avec support de la caméra - Redesign Moderne
 */
function ImageUpload({ onImageUpload }) {
  const { t, language } = useLanguage()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)

  /**
   * Gère la sélection de fichier
   */
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Créer une preview et ouvrir le rogneur
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageToCrop(reader.result)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    } else {
      alert(t('invalidImage'))
    }
  }

  /**
   * Gère la confirmation du rognage
   */
  const handleCropConfirm = (croppedFile) => {
    setShowCropper(false)
    setImageToCrop(null)
    setPreview(null)
    onImageUpload(croppedFile)
  }

  /**
   * Annule le rognage
   */
  const handleCropCancel = () => {
    setShowCropper(false)
    setImageToCrop(null)
    setPreview(null)
    // Réinitialiser les inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  /**
   * Gère le clic sur le bouton d'upload
   */
  const handleButtonClick = (e) => {
    if (e) {
      e.stopPropagation() // Empêcher la propagation au parent
    }
    fileInputRef.current?.click()
  }

  const handleCameraClick = (e) => {
    if (e) {
      e.stopPropagation() // Empêcher la propagation au parent
    }
    cameraInputRef.current?.click()
  }

  /**
   * Gère le drag and drop
   */
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  /**
   * Gère le drop de fichier
   */
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-12 sm:p-20
          transition-all duration-300 ease-out shadow-xl
          ${dragActive 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 scale-[1.02] shadow-2xl shadow-blue-500/20' 
            : 'border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0])
            }
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0])
            }
          }}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Animated Icon Container */}
          <div className={`
            w-24 h-24 rounded-3xl flex items-center justify-center
            transition-all duration-500 shadow-lg
            ${dragActive 
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rotate-12 scale-110 shadow-2xl shadow-blue-500/40' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl'
            }
          `}>
            <svg 
              className="w-12 h-12 transition-transform duration-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              {language === 'fr' ? 'Glissez votre image ici' : 'Drop your image here'}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              {t('uploadSubtitle')}{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold underline decoration-2 underline-offset-2 decoration-blue-400 hover:decoration-blue-600 transition-colors cursor-pointer">
                {t('browse')}
              </span>
            </p>
          </div>

          {/* Format Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-sm">JPG</span>
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-sm">PNG</span>
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-sm">WEBP</span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {t('qualityTip')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mt-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => handleButtonClick(e)}
              className="flex-1 px-6 py-4 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 font-bold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('chooseFile')}
            </button>
            <button
              type="button"
              onClick={(e) => handleCameraClick(e)}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('takePhoto')}
            </button>
          </div>
        </div>

        {/* Preview Overlay */}
        {preview && (
          <div className="absolute inset-0 z-10 bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-[80%] rounded-lg shadow-lg object-contain mb-4"
            />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">
              {t('processing')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de rognage */}
      {showCropper && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCrop={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}

export default ImageUpload
