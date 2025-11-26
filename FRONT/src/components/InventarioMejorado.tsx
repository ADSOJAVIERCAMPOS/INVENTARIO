import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import BusquedaInteligente from './BusquedaInteligente';
import QRScanner from './QRScanner';

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

const InventarioMejorado: React.FC = () => {
  // Estados principales
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Estados de UI
  const [editMode, setEditMode] = useState(false);
  const [articuloEditando, setArticuloEditando] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarQRScanner, setMostrarQRScanner] = useState(false);
  const [vistaCompacta, setVistaCompacta] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [articulosPorPagina] = useState(10);
  
  // Estados de filtros y ordenación
  const [ordenPor, setOrdenPor] = useState<string>('id');
  const [direccionOrden, setDireccionOrden] = useState<'asc' | 'desc'>('asc');
  
  // Nuevo artículo para formulario
  const [nuevoArticulo, setNuevoArticulo] = useState<Partial<Articulo>>({
    nombre: '',
    descripcion: '',
    categoria: '',
    ubicacion: '',
    cantidadTeorica: 0,
    cantidadFisica: 0,
    estado: 'NUEVO'
  });

  // Cargar artículos al iniciar
  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:8080/api/articulos');
      if (response.ok) {
        const data = await response.json();
        setArticulos(data);
        setArticulosFiltrados(data);
      } else {
        throw new Error('Error al cargar artículos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los artículos. Verifique la conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Manejar resultados de búsqueda
  const manejarResultadosBusqueda = (resultados: Articulo[]) => {
    setArticulosFiltrados(resultados.length > 0 ? resultados : articulos);
    setPaginaActual(1); // Resetear a primera página
  };

  // Manejar escaneo QR/Código de barras
  const manejarEscaneoQR = async (codigo: string) => {
    setCargando(true);
    try {
      // Primero intentar buscar por código de barras
      let response = await fetch(`http://localhost:8080/api/articulos/codigo-barras/${encodeURIComponent(codigo)}`);
      
      if (!response.ok) {
        // Si no se encuentra, buscar por código QR
        response = await fetch(`http://localhost:8080/api/articulos/qr/${encodeURIComponent(codigo)}`);
      }
      
      if (response.ok) {
        const articulo = await response.json();
        setArticulosFiltrados([articulo]);
        alert(`✅ Artículo encontrado: ${articulo.descripcion}`);
      } else {
        // Si no se encuentra, preguntar si quiere crear uno nuevo
        const crearNuevo = window.confirm(
          `No se encontró un artículo con el código: ${codigo}\\n\\n¿Desea crear un nuevo artículo con este código?`
        );
        
        if (crearNuevo) {
          setNuevoArticulo({
            ...nuevoArticulo,
            codigoBarras: codigo,
            qrCode: codigo
          });
          setMostrarFormulario(true);
        }
      }
    } catch (error) {
      console.error('Error al buscar por código:', error);
      alert('❌ Error al buscar el artículo');
    } finally {
      setCargando(false);
      setMostrarQRScanner(false);
    }
  };

  // Guardar artículo (nuevo o editado)
  const guardarArticulo = async (articulo: Articulo) => {
    try {
      const url = articulo.id 
        ? `http://localhost:8080/api/articulos/${articulo.id}`
        : 'http://localhost:8080/api/articulos';
      
      const method = articulo.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articulo),
      });

      if (response.ok) {
        await cargarArticulos(); // Recargar lista
        alert(articulo.id ? '✅ Artículo actualizado' : '✅ Artículo creado');
        setMostrarFormulario(false);
        setArticuloEditando(null);
        setNuevoArticulo({
          codigoArticulo: '',
          descripcion: '',
          cantidadTeorica: 0,
          placa: '',
          observaciones: '',
          estado: 'ACTIVO',
          clasificacion: '',
          ubicacion: '',
          codigoBarras: '',
          qrCode: ''
        });
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar el artículo');
    }
  };

  // Eliminar artículo
  const eliminarArticulo = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este artículo?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/articulos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await cargarArticulos();
        alert('✅ Artículo eliminado');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar el artículo');
    }
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(articulosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `inventario_${fecha}.xlsx`);
  };

  // Exportar a PDF
  const exportarPDF = async () => {
    try {
      const filtro = articulosFiltrados.length !== articulos.length ? 'filtered' : '';
      const response = await fetch(`http://localhost:8080/api/articulos/exportar/pdf?filtro=${filtro}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('✅ PDF descargado exitosamente');
      } else {
        throw new Error('Error al generar PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al exportar PDF');
    }
  };

  // Ordenar artículos
  const ordenarArticulos = (campo: string) => {
    const nuevaDireccion = ordenPor === campo && direccionOrden === 'asc' ? 'desc' : 'asc';
    setOrdenPor(campo);
    setDireccionOrden(nuevaDireccion);
  };

  // Artículos ordenados y paginados
  const articulosProcesados = useMemo(() => {
    let articulosOrdenados = [...articulosFiltrados];
    
    // Ordenar
    articulosOrdenados.sort((a, b) => {
      let aVal = a[ordenPor as keyof Articulo];
      let bVal = b[ordenPor as keyof Articulo];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return direccionOrden === 'asc' ? -1 : 1;
      if (aVal > bVal) return direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginar
    const inicio = (paginaActual - 1) * articulosPorPagina;
    const fin = inicio + articulosPorPagina;
    
    return {
      articulosPaginados: articulosOrdenados.slice(inicio, fin),
      totalPaginas: Math.ceil(articulosOrdenados.length / articulosPorPagina)
    };
  }, [articulosFiltrados, ordenPor, direccionOrden, paginaActual, articulosPorPagina]);

  if (cargando && articulos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando inventario...</h2>
          <p className="text-gray-500">Por favor espere</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={cargarArticulos}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado y responsive */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                📦 Inventario ADSO
                <span className="text-sm font-normal text-gray-500 hidden sm:inline">
                  ({articulosFiltrados.length} artículos)
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-1 sm:hidden">
                {articulosFiltrados.length} artículos encontrados
              </p>
            </div>
            
            {/* Botones de acción principales */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMostrarQRScanner(true)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-1"
              >
                📱 <span className="hidden sm:inline">Escanear QR</span>
              </button>
              
              <button
                onClick={() => setMostrarFormulario(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
              >
                ➕ <span className="hidden sm:inline">Nuevo</span>
              </button>
              
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={exportarExcel}
                  className="px-3 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  📊 <span className="hidden sm:inline">Excel</span>
                </button>
                <button
                  onClick={exportarPDF}
                  className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  📄 <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de búsqueda inteligente */}
        <div className="mb-6">
          <BusquedaInteligente 
            onResultados={manejarResultadosBusqueda}
            className="w-full"
          />
        </div>

        {/* Controles de vista */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVistaCompacta(!vistaCompacta)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                vistaCompacta 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {vistaCompacta ? '📋 Vista Normal' : '📱 Vista Compacta'}
            </button>
            
            <span className="text-sm text-gray-600">
              Página {paginaActual} de {articulosProcesados.totalPaginas}
            </span>
          </div>
          
          <button
            onClick={cargarArticulos}
            disabled={cargando}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {cargando ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            ) : (
              '🔄'
            )}
            Actualizar
          </button>
        </div>

        {/* Tabla responsive */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {!vistaCompacta && (
                    <th 
                      onClick={() => ordenarArticulos('id')}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        ID
                        {ordenPor === 'id' && (
                          <span className="text-blue-600">
                            {direccionOrden === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  )}
                  
                  <th 
                    onClick={() => ordenarArticulos('codigoArticulo')}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Código
                      {ordenPor === 'codigoArticulo' && (
                        <span className="text-blue-600">
                          {direccionOrden === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  
                  <th 
                    onClick={() => ordenarArticulos('descripcion')}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Descripción
                      {ordenPor === 'descripcion' && (
                        <span className="text-blue-600">
                          {direccionOrden === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  
                  {!vistaCompacta && (
                    <>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placa
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación
                      </th>
                    </>
                  )}
                  
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {articulosProcesados.articulosPaginados.map((articulo, index) => (
                  <tr 
                    key={articulo.id || index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {!vistaCompacta && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {articulo.id}
                      </td>
                    )}
                    
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {articulo.codigoArticulo}
                      </div>
                      {vistaCompacta && (
                        <div className="text-xs text-gray-500">
                          ID: {articulo.id} • {articulo.estado}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900">
                        {articulo.descripcion}
                      </div>
                      {vistaCompacta && (
                        <div className="text-xs text-gray-500">
                          📍 {articulo.ubicacion} • 📊 Cant: {articulo.cantidadTeorica}
                        </div>
                      )}
                    </td>
                    
                    {!vistaCompacta && (
                      <>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {articulo.cantidadTeorica}
                          </span>
                        </td>
                        
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {articulo.placa || '-'}
                        </td>
                        
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            articulo.estado === 'ACTIVO' 
                              ? 'bg-green-100 text-green-800'
                              : articulo.estado === 'INACTIVO'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {articulo.estado}
                          </span>
                        </td>
                        
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {articulo.ubicacion || '-'}
                        </td>
                      </>
                    )}
                    
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setNuevoArticulo(articulo);
                            setMostrarFormulario(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        
                        <button
                          onClick={() => articulo.id && eliminarArticulo(articulo.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {articulosProcesados.totalPaginas > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPaginaActual(Math.min(articulosProcesados.totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === articulosProcesados.totalPaginas}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">
                      {(paginaActual - 1) * articulosPorPagina + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-medium">
                      {Math.min(paginaActual * articulosPorPagina, articulosFiltrados.length)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium">{articulosFiltrados.length}</span>{' '}
                    resultados
                  </p>
                </div>
                
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                      disabled={paginaActual === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ←
                    </button>
                    
                    {Array.from({ length: Math.min(5, articulosProcesados.totalPaginas) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPaginaActual(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            paginaActual === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPaginaActual(Math.min(articulosProcesados.totalPaginas, paginaActual + 1))}
                      disabled={paginaActual === articulosProcesados.totalPaginas}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal QR Scanner */}
      <QRScanner
        isActive={mostrarQRScanner}
        onScanSuccess={manejarEscaneoQR}
        onClose={() => setMostrarQRScanner(false)}
        onError={(error) => {
          console.error('Error QR:', error);
          alert(`Error en escáner: ${error}`);
        }}
      />

      {/* Modal Formulario (simplificado por espacio) */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {nuevoArticulo.id ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}
                </h3>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                guardarArticulo(nuevoArticulo);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Artículo *
                    </label>
                    <input
                      type="text"
                      required
                      value={nuevoArticulo.codigoArticulo}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, codigoArticulo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad Teórica *
                    </label>
                    <input
                      type="number"
                      required
                      value={nuevoArticulo.cantidadTeorica}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, cantidadTeorica: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={nuevoArticulo.descripcion}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa
                    </label>
                    <input
                      type="text"
                      value={nuevoArticulo.placa}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, placa: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={nuevoArticulo.estado}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, estado: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                      <option value="MANTENIMIENTO">Mantenimiento</option>
                      <option value="DAÑADO">Dañado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clasificación
                    </label>
                    <input
                      type="text"
                      value={nuevoArticulo.clasificacion}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, clasificacion: e.target.value})}
                      placeholder="Ej: Muebles, Electrónicos..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={nuevoArticulo.ubicacion}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, ubicacion: e.target.value})}
                      placeholder="Ej: Oficina 101, Almacén..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Barras
                    </label>
                    <input
                      type="text"
                      value={nuevoArticulo.codigoBarras || ''}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, codigoBarras: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código QR
                    </label>
                    <input
                      type="text"
                      value={nuevoArticulo.qrCode || ''}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, qrCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      value={nuevoArticulo.observaciones}
                      onChange={(e) => setNuevoArticulo({...nuevoArticulo, observaciones: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {nuevoArticulo.id ? '✅ Actualizar' : '➕ Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioMejorado;