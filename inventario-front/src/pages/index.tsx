import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header con logo SENA */}
      <header className="bg-white shadow-md border-b-4 border-green-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              SENA
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Inventario Coordinación ADSO
              </h1>
              <p className="text-lg text-green-600 font-semibold">
                Servicio Nacional de Aprendizaje - SENA
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📦 Gestión de Inventario
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramienta digital para la gestión completa del inventario de la Coordinación ADSO, 
            con funcionalidades de importación y exportación de datos en formato Excel
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Link
            href="/inventario"
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="text-2xl">📊</span>
            Acceder al Sistema de Inventario
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-center">📁</div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Importar Excel</h3>
              <p className="text-gray-600 text-center">
                Carga archivos Excel (.xlsx/.xls) con datos de inventario de forma rápida y segura
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-center">�</div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Sincronizar</h3>
              <p className="text-gray-600 text-center">
                Sincroniza datos con el servidor para mantener la información actualizada en tiempo real
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-center">📊</div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Exportar Reportes</h3>
              <p className="text-gray-600 text-center">
                Genera y descarga reportes detallados en formato Excel para análisis y seguimiento
              </p>
            </div>
          </div>

          {/* Información institucional */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-3xl mt-8">
            <div className="text-center">
              <h3 className="font-bold text-lg text-green-800 mb-2">
                Análisis y Desarrollo de Software 
              </h3>
              <p className="text-green-700">
                ADSO
              </p>
              <p className="text-sm text-green-600 mt-2">
                Centro de Servicios Financieros • Regional Bogotá
               </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span>🚀</span>
            <span> Next.js & Spring Boot</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
