import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

interface Props {
  onLeitura: (codigo: string) => void
  onFechar: () => void
}

export default function LeitorCodigo({ onLeitura, onFechar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [erro, setErro] = useState('')
  const leuRef = useRef(false)

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    leuRef.current = false

    reader.decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
      if (result && !leuRef.current) {
        leuRef.current = true
        BrowserMultiFormatReader.releaseAllStreams()
        onLeitura(result.getText())
      }
    }).catch(() => {
      setErro('Não foi possível acessar a câmera. Verifique as permissões.')
    })

    return () => {
      BrowserMultiFormatReader.releaseAllStreams()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden">
        <div className="relative">
          <video ref={videoRef} className="w-full" autoPlay muted playsInline />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-24 border-2 border-white rounded-lg opacity-60" />
          </div>
        </div>

        {erro && (
          <p className="text-red-400 text-sm text-center px-4 py-3">{erro}</p>
        )}

        <div className="p-4">
          <p className="text-gray-400 text-xs text-center mb-3">
            Aponte para o código de barras
          </p>
          <button
            onClick={() => {
              BrowserMultiFormatReader.releaseAllStreams()
              onFechar()
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}