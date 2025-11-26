import React, { useState, useEffect } from 'react';
import BusquedaInteligente from './BusquedaInteligente';

interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  cantidadTeorica: number;
  cantidadFisica: number;
  fechaActualizacion: string;
  estado: 'OK' | 'FALTA' | 'SOBRA' | 'NUEVO';
}

interface EstadisticasInventario {
  totalArticulos: number;
  articulosOK: number;
  articulosFaltantes: number;
  articulosSobrantes: number;
  articulosNuevos: number;
  porcentajeOK: number;
  valorTotalTeorico: number;
  valorTotalFisico: number;
  diferenciaPorcentual: number;
}

const InventarioMejorado: React.FC = () => {
  // Estados principales
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosOriginales, setArticulosOriginales] = useState<Articulo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasInventario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de interfaz
  const [vistaActual, setVistaActual] = useState<'tabla' | 'tarjetas'>('tabla');
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(true);
  const [exportandoPDF, setExportandoPDF] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [articulosPorPagina] = useState(20);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      // Simulamos datos mientras el backend se inicia
      const datosSimulados: Articulo[] = [
        {
          id: 1,
          nombre: 'Laptop ASUS X515EA',
          descripcion: 'Laptop para desarrollo con procesador Intel i5',
          categoria: 'Equipos de Cómputo',
          ubicacion: 'Laboratorio 1',
          cantidadTeorica: 10,
          cantidadFisica: 10,
          fechaActualizacion: '2024-11-25',
          estado: 'OK'
        },
        {
          id: 2,
          nombre: 'Monitor Samsung 24"',
          descripcion: 'Monitor LED Full HD para estaciones de trabajo',
          categoria: 'Equipos de Cómputo',
          ubicacion: 'Laboratorio 1',
          cantidadTeorica: 15,
          cantidadFisica: 14,
          fechaActualizacion: '2024-11-25',
          estado: 'FALTA'
        },
        {
          id: 3,
          nombre: 'Teclado Logitech K380',
          descripcion: 'Teclado inalámbrico bluetooth',
          categoria: 'Accesorios',
          ubicacion: 'Almacén',
          cantidadTeorica: 25,
          cantidadFisica: 27,
          fechaActualizacion: '2024-11-25',
          estado: 'SOBRA'
        },
        {
          id: 4,
          nombre: 'Proyector Epson PowerLite',
          descripcion: 'Proyector multimedia para aulas',
          categoria: 'Equipos Audiovisuales',
          ubicacion: 'Aula 101',
          cantidadTeorica: 3,
          cantidadFisica: 4,
          fechaActualizacion: '2024-11-25',
          estado: 'NUEVO'
        }
      ];

      const estadisticasSimuladas: EstadisticasInventario = {
        totalArticulos: 4,
        articulosOK: 1,
        articulosFaltantes: 1,
        articulosSobrantes: 1,
        articulosNuevos: 1,
        porcentajeOK: 25.0,
        valorTotalTeorico: 100000,
        valorTotalFisico: 102000,
        diferenciaPorcentual: 2.0
      };
      
      setArticulos(datosSimulados);
      setArticulosOriginales(datosSimulados);
      setEstadisticas(estadisticasSimuladas);

      // Intentar cargar datos reales del backend
      try {
        const [articulosResponse, estadisticasResponse] = await Promise.all([
          fetch('http://localhost:8080/api/articulos'),
          fetch('http://localhost:8080/api/articulos/estadisticas')
        ]);

        if (articulosResponse.ok && estadisticasResponse.ok) {
          const articulosData = await articulosResponse.json();
          const estadisticasData = await estadisticasResponse.json();
          
          setArticulos(articulosData);
          setArticulosOriginales(articulosData);
          setEstadisticas(estadisticasData);
        }
      } catch (backendError) {
        console.log('Backend no disponible, usando datos simulados');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando datos:', err);
    } finally {
      setCargando(false);
    }
  };

  // Funciones de exportación
  const exportarPDF = async () => {
    setExportandoPDF(true);
    try {
      const response = await fetch('http://localhost:8080/api/articulos/exportar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulos)
      });

      if (response.ok) {
        const htmlContent = await response.text();
        
        // Crear ventana emergente para el PDF
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          // Esperar a que se cargue y luego imprimir
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        throw new Error('Error al generar PDF');
      }
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al exportar PDF: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExportandoPDF(false);
    }
  };

  const exportarExcel = async () => {
    setExportandoExcel(true);
    try {
      const response = await fetch('http://localhost:8080/api/inventario/exportar-excel');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Error al generar Excel');
      }
    } catch (error) {
      console.error('Error exportando Excel:', error);
      alert('Error al exportar Excel: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExportandoExcel(false);
    }
  };

  // Funciones de filtrado y búsqueda
  const manejarResultadosBusqueda = (resultados: Articulo[]) => {
    setArticulos(resultados);
    setPaginaActual(1);
  };

  const limpiarBusqueda = () => {
    setArticulos(articulosOriginales);
    setPaginaActual(1);
  };

  // Obtener color según el estado
  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'OK': return 'text-green-600 bg-green-50';
      case 'FALTA': return 'text-red-600 bg-red-50';
      case 'SOBRA': return 'text-yellow-600 bg-yellow-50';
      case 'NUEVO': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Obtener emoji según el estado
  const obtenerEmojiEstado = (estado: string) => {
    switch (estado) {
      case 'OK': return '✅';
      case 'FALTA': return '❌';
      case 'SOBRA': return '⚠️';
      case 'NUEVO': return '🆕';
      default: return '❓';
    }
  };

  // Cálculos de paginación
  const indiceUltimoArticulo = paginaActual * articulosPorPagina;
  const indicePrimerArticulo = indiceUltimoArticulo - articulosPorPagina;
  const articulosActuales = articulos.slice(indicePrimerArticulo, indiceUltimoArticulo);
  const totalPaginas = Math.ceil(articulos.length / articulosPorPagina);

  // Renderizado de loading
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-red-600 text-center mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">Error al cargar</h3>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={cargarDatos}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header principal */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                📦 Inventario ADSO
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión inteligente de inventario físico
              </p>
            </div>
            
            {/* Controles de vista y exportación */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Toggle de vista */}
              <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
                <button
                  onClick={() => setVistaActual('tabla')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    vistaActual === 'tabla'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-7 8h7m-7 4h7m-7-8H3m4-4H3" />
                  </svg>
                  Tabla
                </button>
                <button
                  onClick={() => setVistaActual('tarjetas')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    vistaActual === 'tarjetas'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                  Tarjetas
                </button>
              </div>
              
              {/* Botones de exportación */}
              <div className="flex space-x-2">
                <button
                  onClick={exportarExcel}
                  disabled={exportandoExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
                >
                  {exportandoExcel ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  Excel
                </button>
                
                <button
                  onClick={exportarPDF}
                  disabled={exportandoPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
                >
                  {exportandoPDF ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Estadísticas */}
        {estadisticas && mostrarEstadisticas && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📊 Estadísticas del Inventario</h2>
              <button
                onClick={() => setMostrarEstadisticas(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{estadisticas.totalArticulos}</div>
                <div className="text-sm text-gray-600">Total Artículos</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{estadisticas.articulosOK}</div>
                <div className="text-sm text-green-600">✅ Correctos</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{estadisticas.articulosFaltantes}</div>
                <div className="text-sm text-red-600">❌ Faltantes</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.articulosSobrantes}</div>
                <div className="text-sm text-yellow-600">⚠️ Sobrantes</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.articulosNuevos}</div>
                <div className="text-sm text-blue-600">🆕 Nuevos</div>
              </div>
            </div>
            
            <div className="mt-4 bg-green-100 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700">
                  {estadisticas.porcentajeOK.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">Precisión del Inventario</div>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar estadísticas si están ocultas */}
        {!mostrarEstadisticas && (
          <button
            onClick={() => setMostrarEstadisticas(true)}
            className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="text-gray-600">📊 Mostrar Estadísticas</span>
          </button>
        )}

        {/* Búsqueda inteligente */}
        <BusquedaInteligente
          onResultados={manejarResultadosBusqueda}
          onLimpiar={limpiarBusqueda}
        />

        {/* Información de resultados */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Mostrando {articulos.length > 0 ? indicePrimerArticulo + 1 : 0} - {Math.min(indiceUltimoArticulo, articulos.length)} de {articulos.length} artículos
            {articulos.length !== articulosOriginales.length && (
              <span className="text-green-600 font-medium">
                {' '}(filtrados de {articulosOriginales.length} total)
              </span>
            )}
          </div>
          
          {articulos.length > articulosPorPagina && (
            <div className="text-sm text-gray-600">
              Página {paginaActual} de {totalPaginas}
            </div>
          )}
        </div>

        {/* Contenido principal - Vista de Tabla */}
        {vistaActual === 'tabla' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articulosActuales.map((articulo) => (
                    <tr key={articulo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {articulo.nombre}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {articulo.descripcion}
                          </div>
                          {/* Información adicional en móviles */}
                          <div className="sm:hidden mt-1 space-y-1">
                            <div className="text-xs text-gray-500">
                              📂 {articulo.categoria}
                            </div>
                            <div className="text-xs text-gray-500">
                              📍 {articulo.ubicacion}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {articulo.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {articulo.ubicacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="space-y-1">
                          <div className="text-gray-900">
                            Teórico: <span className="font-medium">{articulo.cantidadTeorica}</span>
                          </div>
                          <div className="text-gray-900">
                            Físico: <span className="font-medium">{articulo.cantidadFisica}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorEstado(articulo.estado)}`}>
                          {obtenerEmojiEstado(articulo.estado)} {articulo.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vista de Tarjetas */}
        {vistaActual === 'tarjetas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articulosActuales.map((articulo) => (
              <div key={articulo.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Header de la tarjeta */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
                      {articulo.nombre}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(articulo.estado)}`}>
                      {obtenerEmojiEstado(articulo.estado)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {articulo.descripcion}
                  </p>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                    </svg>
                    {articulo.categoria}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {articulo.ubicacion}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {articulo.cantidadTeorica}
                      </div>
                      <div className="text-xs text-gray-500">Teórico</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {articulo.cantidadFisica}
                      </div>
                      <div className="text-xs text-gray-500">Físico</div>
                    </div>
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="px-4 py-3 bg-gray-50">
                  <div className="text-xs text-gray-500 text-center">
                    Actualizado: {new Date(articulo.fechaActualizacion).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {articulos.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros de búsqueda o cargar nuevos datos.
            </p>
            <button
              onClick={limpiarBusqueda}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setPaginaActual(pag => Math.max(1, pag - 1))}
              disabled={paginaActual === 1}
              className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPaginas))].map((_, i) => {
                const numPagina = i + 1;
                return (
                  <button
                    key={numPagina}
                    onClick={() => setPaginaActual(numPagina)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      paginaActual === numPagina
                        ? 'bg-green-600 text-white border border-green-600'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {numPagina}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPaginaActual(pag => Math.min(totalPaginas, pag + 1))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventarioMejorado;