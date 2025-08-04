import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import EstadisticasInventario from '../components/EstadisticasInventario';

interface InventarioItem {
  id?: number;
  descripcion: string;
  categoria: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  cantidadFisica: number;
  cantidadSistema: number;
  diferencia: number;
  observaciones: string;
  fechaInventario: string;
}

export default function Inventario() {
  const [inventarioData, setInventarioData] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Configuración del dropzone para archivos Excel
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          
          // Mapear los datos del Excel al formato esperado
          const formattedData: InventarioItem[] = jsonData.map((row, index) => ({
            descripcion: row['Descripcion'] || row['descripcion'] || '',
            categoria: row['Categoria'] || row['categoria'] || '',
            marca: row['Marca'] || row['marca'] || '',
            modelo: row['Modelo'] || row['modelo'] || '',
            numeroSerie: row['Numero Serie'] || row['numeroSerie'] || `SERIE-${index + 1}`,
            cantidadFisica: Number(row['Cantidad Fisica'] || row['cantidadFisica'] || 0),
            cantidadSistema: Number(row['Cantidad Sistema'] || row['cantidadSistema'] || 0),
            diferencia: Number(row['Diferencia'] || row['diferencia'] || 0),
            observaciones: row['Observaciones'] || row['observaciones'] || '',
            fechaInventario: new Date().toISOString().split('T')[0]
          }));

          setInventarioData(formattedData);
          setMessage(`✅ Archivo Excel cargado exitosamente. ${formattedData.length} elementos encontrados.`);
        } catch (error) {
          setMessage('❌ Error al procesar el archivo Excel');
          console.error('Error:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  // Función para obtener datos del backend
  const obtenerInventario = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/inventario', {
        timeout: 10000, // 10 segundos de timeout
      });
      setInventarioData(response.data);
      setMessage(`✅ Datos cargados desde el servidor. ${response.data.length} elementos encontrados.`);
    } catch (error: any) {
      console.error('Error completo:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setMessage('❌ No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080');
      } else if (error.response) {
        setMessage(`❌ Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
      } else if (error.request) {
        setMessage('❌ Sin respuesta del servidor. Verifica la conexión y que el backend esté corriendo.');
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar datos al backend
  const enviarInventario = async () => {
    if (inventarioData.length === 0) {
      setMessage('❌ No hay datos para enviar');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/inventario/batch', inventarioData, {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setMessage('✅ Datos enviados exitosamente al servidor');
    } catch (error: any) {
      console.error('Error completo:', error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setMessage('❌ No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080');
      } else if (error.response) {
        setMessage(`❌ Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
      } else if (error.request) {
        setMessage('❌ Sin respuesta del servidor. Verifica la conexión y que el backend esté corriendo.');
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar a Excel
  const exportarExcel = () => {
    if (inventarioData.length === 0) {
      setMessage('❌ No hay datos para exportar');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(inventarioData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
      
      // Generar nombre de archivo con fecha
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `inventario-${fecha}.xlsx`;
      
      XLSX.writeFile(workbook, nombreArchivo);
      setMessage(`✅ Archivo Excel exportado: ${nombreArchivo}`);
    } catch (error) {
      setMessage('❌ Error al exportar archivo Excel');
      console.error('Error:', error);
    }
  };

  // Función para limpiar datos
  const limpiarDatos = () => {
    setInventarioData([]);
    setMessage('🗑️ Datos limpiados');
  };

  // Función para verificar conexión con el backend
  const verificarConexion = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/actuator/health', {
        timeout: 5000,
      });
      setMessage('✅ Conexión con el backend exitosa');
    } catch (error) {
      try {
        // Intentar endpoint alternativo
        const response = await axios.get('http://localhost:8080/api/inventario', {
          timeout: 5000,
        });
        setMessage('✅ Backend conectado (endpoint de inventario disponible)');
      } catch (error2) {
        setMessage('❌ No se puede conectar al backend. Asegúrate de que esté corriendo en http://localhost:8080');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          📊 Gestión de Inventario
        </h1>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 border rounded-lg ${
            message.includes('✅') ? 'bg-green-100 border-green-400 text-green-700' :
            message.includes('❌') ? 'bg-red-100 border-red-400 text-red-700' :
            message.includes('🗑️') ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
            'bg-blue-100 border-blue-400 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Estado del Backend */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔌 Estado del Backend</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>URL del Backend:</strong> http://localhost:8080
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Endpoints:</strong>
            </p>
            <ul className="text-sm text-gray-600 ml-4 space-y-1">
              <li>• GET /api/inventario - Obtener inventario</li>
              <li>• POST /api/inventario/batch - Enviar inventario</li>
            </ul>
            <div className="mt-3">
              <span className="text-sm font-medium">Usa el botón "Verificar Conexión" para probar la conectividad</span>
            </div>
          </div>
        </div>

        {/* Área de carga de archivos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📁 Cargar Archivo Excel</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-4xl mb-4">📄</div>
            {isDragActive ? (
              <p className="text-blue-600">Suelta el archivo aquí...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-400">
                  Formatos soportados: .xlsx, .xls
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">⚡ Acciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={verificarConexion}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>🔌</span>
              {loading ? 'Verificando...' : 'Verificar Conexión'}
            </button>

            <button
              onClick={obtenerInventario}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📥</span>
              {loading ? 'Cargando...' : 'Obtener del Servidor'}
            </button>

            <button
              onClick={enviarInventario}
              disabled={loading || inventarioData.length === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📤</span>
              {loading ? 'Enviando...' : 'Enviar al Servidor'}
            </button>

            <button
              onClick={exportarExcel}
              disabled={inventarioData.length === 0}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📊</span>
              Exportar Excel
            </button>

            <button
              onClick={limpiarDatos}
              disabled={inventarioData.length === 0}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>🗑️</span>
              Limpiar Datos
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {inventarioData.length > 0 && (
          <EstadisticasInventario datos={inventarioData} />
        )}

        {/* Tabla de datos */}
        {inventarioData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                📋 Datos del Inventario ({inventarioData.length} elementos)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Física
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Sistema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diferencia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventarioData.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.marca}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.modelo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.cantidadFisica}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.cantidadSistema}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.diferencia > 0 ? 'text-green-600' : 
                        item.diferencia < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.diferencia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inventarioData.length > 10 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Mostrando los primeros 10 elementos de {inventarioData.length} total.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
