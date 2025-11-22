import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Composant pour rogner une image avant l'upload
 */
function ImageCropper({ imageSrc, onCrop, onCancel }) {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (imageSrc && imageRef.current) {
      const img = new Image()
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height })
        setImageLoaded(true)
        
        // Attendre que le container soit rendu
        setTimeout(() => {
          if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth
            const containerHeight = containerRef.current.clientHeight
            const scale = Math.min(containerWidth / img.width, containerHeight / img.height, 1)
            const displayWidth = img.width * scale
            const displayHeight = img.height * scale
            // Zone de rognage initiale : 80% de l'image, centrée
            const cropWidth = displayWidth * 0.8
            const cropHeight = displayHeight * 0.8
            setCropArea({
              x: (displayWidth - cropWidth) / 2,
              y: (displayHeight - cropHeight) / 2,
              width: cropWidth,
              height: cropHeight
            })
          }
        }, 100)
      }
      img.src = imageSrc
    }
  }, [imageSrc])

  const getEventCoordinates = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handleStart = (e) => {
    if (!imageLoaded) return
    e.preventDefault()
    const coords = getEventCoordinates(e)
    const x = coords.x
    const y = coords.y
    
    // Vérifier si le clic/touch est dans la zone de rognage
    if (x >= cropArea.x && x <= cropArea.x + cropArea.width &&
        y >= cropArea.y && y <= cropArea.y + cropArea.height) {
      setIsDragging(true)
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
    }
  }

  const handleMove = (e) => {
    if (!isDragging || !imageLoaded) return
    e.preventDefault()
    const coords = getEventCoordinates(e)
    const x = coords.x - dragStart.x
    const y = coords.y - dragStart.y
    
    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight
    
    // Limiter le déplacement dans les limites de l'image
    const maxX = containerWidth - cropArea.width
    const maxY = containerHeight - cropArea.height
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    }))
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      return () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, dragStart, imageLoaded])

  const handleCrop = () => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    const img = imageRef.current
    
    // Calculer le ratio de l'image réelle vs affichée
    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight
    const scale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight, 1)
    const displayWidth = img.naturalWidth * scale
    const displayHeight = img.naturalHeight * scale
    
    // Convertir les coordonnées de rognage en coordonnées réelles (utiliser les dimensions naturelles)
    const cropX = Math.round((cropArea.x / displayWidth) * img.naturalWidth)
    const cropY = Math.round((cropArea.y / displayHeight) * img.naturalHeight)
    const cropWidth = Math.round((cropArea.width / displayWidth) * img.naturalWidth)
    const cropHeight = Math.round((cropArea.height / displayHeight) * img.naturalHeight)
    
    // S'assurer que les dimensions sont valides
    if (cropWidth <= 0 || cropHeight <= 0 || cropX < 0 || cropY < 0) {
      console.error('Invalid crop dimensions')
      return
    }
    
    // Configurer le canvas avec les dimensions réelles (pas de downscaling)
    canvas.width = cropWidth
    canvas.height = cropHeight
    
    // Améliorer la qualité du rendu
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Dessiner l'image rognée directement depuis les dimensions naturelles
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    )
    
    // Convertir en blob avec qualité maximale
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
        onCrop(file)
      }
    }, 'image/jpeg', 1.0) // Qualité maximale (1.0 au lieu de 0.95)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('cropImage') || 'Rogner l\'image'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Zone de rognage */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div
            ref={containerRef}
            className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            style={{ width: '100%', maxWidth: '600px', aspectRatio: '4/3' }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            {imageSrc && (
              <>
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop"
                  className="w-full h-full object-contain"
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
                
                {/* Overlay sombre */}
                <div className="absolute inset-0">
                  <div
                    className="absolute bg-black/50"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      clipPath: `polygon(
                        0% 0%,
                        0% 100%,
                        ${cropArea.x}px 100%,
                        ${cropArea.x}px ${cropArea.y}px,
                        ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                        ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                        ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                        ${cropArea.x}px 100%,
                        100% 100%,
                        100% 0%
                      )`
                    }}
                  />
                </div>

                {/* Zone de rognage visible */}
                <div
                  className="absolute border-2 border-blue-500 cursor-move"
                  style={{
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`
                  }}
                >
                  {/* Fonction helper pour créer une poignée de redimensionnement */}
                  {(['nw', 'ne', 'sw', 'se']).map((corner) => {
                    const getPosition = () => {
                      switch(corner) {
                        case 'nw': return { top: '-3px', left: '-3px', cursor: 'nw-resize', rounded: 'rounded-br-lg' }
                        case 'ne': return { top: '-3px', right: '-3px', cursor: 'ne-resize', rounded: 'rounded-bl-lg' }
                        case 'sw': return { bottom: '-3px', left: '-3px', cursor: 'sw-resize', rounded: 'rounded-tr-lg' }
                        case 'se': return { bottom: '-3px', right: '-3px', cursor: 'se-resize', rounded: 'rounded-tl-lg' }
                        default: return {}
                      }
                    }
                    const pos = getPosition()
                    
                    const handleResize = (e) => {
                      e.stopPropagation()
                      const rect = containerRef.current.getBoundingClientRect()
                      const startX = e.touches ? e.touches[0].clientX : e.clientX
                      const startY = e.touches ? e.touches[0].clientY : e.clientY
                      const startCrop = { ...cropArea }
                      
                      const handleResizeMove = (moveEvent) => {
                        moveEvent.preventDefault()
                        const currentX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX
                        const currentY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY
                        const mouseX = currentX - rect.left
                        const mouseY = currentY - rect.top
                        
                        let newCrop = { ...startCrop }
                        
                        if (corner === 'nw') {
                          // Coin nord-ouest : ajuster x, y, width, height
                          newCrop.width = startCrop.x + startCrop.width - mouseX
                          newCrop.height = startCrop.y + startCrop.height - mouseY
                          newCrop.x = mouseX
                          newCrop.y = mouseY
                        } else if (corner === 'ne') {
                          // Coin nord-est : ajuster y, width, height
                          newCrop.width = mouseX - startCrop.x
                          newCrop.height = startCrop.y + startCrop.height - mouseY
                          newCrop.y = mouseY
                        } else if (corner === 'sw') {
                          // Coin sud-ouest : ajuster x, width, height
                          newCrop.width = startCrop.x + startCrop.width - mouseX
                          newCrop.height = mouseY - startCrop.y
                          newCrop.x = mouseX
                        } else if (corner === 'se') {
                          // Coin sud-est : ajuster width, height
                          newCrop.width = mouseX - startCrop.x
                          newCrop.height = mouseY - startCrop.y
                        }
                        
                        // Contraintes minimales
                        const minSize = 100
                        if (newCrop.width < minSize) {
                          if (corner === 'nw' || corner === 'sw') {
                            newCrop.x = startCrop.x + startCrop.width - minSize
                          }
                          newCrop.width = minSize
                        }
                        if (newCrop.height < minSize) {
                          if (corner === 'nw' || corner === 'ne') {
                            newCrop.y = startCrop.y + startCrop.height - minSize
                          }
                          newCrop.height = minSize
                        }
                        
                        // S'assurer que la zone reste dans les limites
                        newCrop.x = Math.max(0, Math.min(newCrop.x, rect.width - newCrop.width))
                        newCrop.y = Math.max(0, Math.min(newCrop.y, rect.height - newCrop.height))
                        newCrop.width = Math.max(minSize, Math.min(newCrop.width, rect.width - newCrop.x))
                        newCrop.height = Math.max(minSize, Math.min(newCrop.height, rect.height - newCrop.y))
                        
                        setCropArea(newCrop)
                      }
                      
                      const handleResizeUp = () => {
                        document.removeEventListener('mousemove', handleResizeMove)
                        document.removeEventListener('mouseup', handleResizeUp)
                        document.removeEventListener('touchmove', handleResizeMove)
                        document.removeEventListener('touchend', handleResizeUp)
                      }
                      
                      document.addEventListener('mousemove', handleResizeMove)
                      document.addEventListener('mouseup', handleResizeUp)
                      document.addEventListener('touchmove', handleResizeMove, { passive: false })
                      document.addEventListener('touchend', handleResizeUp)
                    }
                    
                    return (
                      <div
                        key={corner}
                        className={`absolute w-6 h-6 bg-blue-500 ${pos.rounded} ${pos.cursor} touch-none z-10`}
                        style={pos}
                        onMouseDown={handleResize}
                        onTouchStart={handleResize}
                      />
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {t('cancel') || 'Annuler'}
          </button>
          <button
            onClick={handleCrop}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            {t('confirmCrop') || 'Confirmer'}
          </button>
        </div>

        {/* Canvas caché pour le rognage */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default ImageCropper

