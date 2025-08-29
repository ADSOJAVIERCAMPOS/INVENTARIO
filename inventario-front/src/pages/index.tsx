import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header con logo SENA */}
      <header className="bg-white shadow-md border-b-4 border-green-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/logoSena.png"
              alt="Logo SENA"
              width={120}
              height={120}
              className="object-contain"
            />
            <div className="text-center">
              <h1 className="text-4xl font-bold text-green-700 text-center">
                COORDINACIÓN ADSO
              </h1>
              <h2 className="text-green-700 font-semibold text-center text-3xl mb-2">
                CENTRO DE SERVICIOS FINANCIEROS
              </h2>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Link
            href="/inventario"
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Image
              src="/inventario.png"
              alt="Acceder al Sistema de Inventario"
              width={40}
              height={40}
              className="object-contain"
            />
            Acceder al Sistema de Inventario
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-center">📁</div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Importar Excel</h3>
              <p className="text-gray-600 text-center">
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <Image
                src="/sincronizar.png"
                alt="Sincronizar"
                width={40}
                height={40}
                className="object-contain mx-auto mb-4"
              />
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Sincronizar</h3>
              <p className="text-gray-600 text-center">
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4 text-center">📊</div>
              <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Exportar Reportes</h3>
              <p className="text-gray-600 text-center">
              </p>
            </div>
          </div>

          {/* Información institucional */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-3xl mt-8">
            <div className="text-center">
                <h3 className="font-bold text-2xl text-green-800 mb-4 uppercase">
                  ANÁLISIS Y DESARROLLO DE SOFTWARE
                </h3>
                <p className="text-green-700 text-2xl uppercase">
                  BOGOTÁ
                </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span>🚀</span>
            <span className="text-2xl font-bold uppercase"> JAVIER CAMPOS </span>
          </div>
          <p className="text-lg text-gray-400 font-bold">
            2025
          </p>
        </div>
      </footer>
    </div>
  );
}