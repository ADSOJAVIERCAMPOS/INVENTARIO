import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (codigoEscaneado: string) => void;
  onError?: (error: string) => void;
  isActive: boolean;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onScanSuccess, 
  onError, 
  isActive, 
  onClose 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [manualInput, setManualInput] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [isActive]);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      
      // Configuración del escáner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 1,
        disableFlip: false
      };

      // Crear escáner
      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner-container",
        config,
        false
      );

      // Iniciar escáner
      scannerRef.current.render(
        (decodedText: string, decodedResult: any) => {
          // Éxito al escanear
          console.log('QR/Código escaneado:', decodedText);
          setScanResult(decodedText);
          onScanSuccess(decodedText);
          stopScanner();
        },
        (errorMessage: string) => {
          // Error o no se detectó código
          // No hacer nada, es normal durante el escaneo
        }
      );

    } catch (error) {
      console.error('Error al iniciar el escáner:', error);
      setIsScanning(false);
      if (onError) {
        onError('Error al acceder a la cámara. Verifique los permisos.');
      }
    }
  };

  const stopScanner = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.warn('Error al limpiar el escáner:', error);
        });
        scannerRef.current = null;
      }
      
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch((error) => {
          console.warn('Error al detener QR scanner:', error);
        });
        qrCodeRef.current = null;
      }
      
      setIsScanning(false);
    } catch (error) {
      console.warn('Error al detener el escáner:', error);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
      setManualInput('');
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              📱 Escáner QR/Código de Barras
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Instrucciones */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📸 Coloca el código QR o de barras dentro del área de escaneo
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 Asegúrate de tener buena iluminación
            </p>
          </div>

          {/* Área del escáner */}
          <div className="mb-4">
            <div 
              id="qr-scanner-container" 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center"
            >
              {!isScanning && (
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-2">📷</div>
                  <p>Iniciando cámara...</p>
                </div>
              )}
            </div>
          </div>

          {/* Entrada manual como alternativa */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              ✏️ O ingresa manualmente:
            </h4>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Código de barras o QR..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓
              </button>
            </form>
          </div>

          {/* Resultado del escaneo */}
          {scanResult && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                ✅ Código detectado:
              </p>
              <p className="text-sm text-green-700 font-mono break-all">
                {scanResult}
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            {!isScanning && (
              <button
                onClick={startScanner}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📷 Reiniciar Escáner
              </button>
            )}
          </div>

          {/* Información sobre permisos */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>🔒 Se requiere acceso a la cámara para escanear códigos</p>
            <p>Los códigos no se almacenan en nuestros servidores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;