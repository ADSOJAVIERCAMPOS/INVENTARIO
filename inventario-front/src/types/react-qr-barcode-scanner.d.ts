// Declaración mínima para evitar errores de TypeScript con el paquete
// Puedes mejorarla según la documentación del paquete si lo deseas

declare module 'react-qr-barcode-scanner' {
  import * as React from 'react';
  export interface BarcodeScannerProps {
    width?: number;
    height?: number;
    onUpdate: (err: any, result: { text: string } | null) => void;
    facingMode?: 'user' | 'environment';
    className?: string;
    style?: React.CSSProperties;
  }
  const BarcodeScannerComponent: React.FC<BarcodeScannerProps>;
  export default BarcodeScannerComponent;
}
