import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import EstadisticasInventario from '../components/EstadisticasInventario';

interface InventarioItem {
  regional: number;
  centro: number;
  placa: string;
  valor: number;
  ambiente: string;
  stockFisico: string;
  descripcion: string;
  observacion: string;
}

export default function Inventario() {
  const [inventarioData, setInventarioData] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchPlaca, setSearchPlaca] = useState('');
  const [editItem, setEditItem] = useState<InventarioItem | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

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
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
          const formattedData: InventarioItem[] = jsonData.map((row) => ({
            regional: Number(row['Regional'] ?? 0),
            centro: Number(row['Centro'] ?? 0),
            placa: String(row['Placa'] ?? ''),
            valor: Number(row['Valor'] ?? 0),
            ambiente: String(row['Ambiente'] ?? ''),
            stockFisico: String(row['Stock fisico'] ?? ''),
            descripcion: String(row['Descripción'] ?? ''),
            observacion: String(row['Observación'] ?? ''),
          }));
          setInventarioData(formattedData);
          setMessage(`✅ Archivo Excel cargado exitosamente. ${formattedData.length} elementos encontrados.`);
        } catch (error) {
          setMessage('❌ Error al leer el archivo Excel');
          console.error(error);
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

  // Cargar por defecto el archivo Excel desde /public al montar el componente
  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch('/InventarioFisicoADSO.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as Record<string, unknown>[];
        // Eliminar filas que contengan 'De acuerdo' en cualquier columna (fragmentado o no)
        const filteredData = jsonData.filter(row => {
          const rowString = Object.values(row).map(val => String(val)).join(' ').replace(/\s+/g, ' ').toLowerCase();
          return !rowString.startsWith('registros:');
        });
        // Forzar placa a string en la carga automática también
        const normalizedData: InventarioItem[] = filteredData.map((row: Record<string, unknown>) => ({
          regional: Number(row['Regional'] ?? 0),
          centro: Number(row['Centro'] ?? 0),
          placa: String(row['Placa'] ?? ''),
          valor: Number(row['Valor'] ?? 0),
          ambiente: String(row['Ambiente'] ?? ''),
          stockFisico: String(row['Stock fisico'] ?? ''),
          descripcion: String(row['Descripción'] ?? ''),
          observacion: String(row['Observación'] ?? ''),
        }));
        setInventarioData(normalizedData);
        setMessage(`✅ Archivo Excel cargado automáticamente. ${normalizedData.length} elementos encontrados.`);
      } catch (error) {
        setMessage('❌ Error al cargar el archivo Excel por defecto');
        console.error(error);
      }
    };
    fetchExcel();
  }, []);

  // Función para obtener datos del backend
  const obtenerInventario = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/inventario', {
        timeout: 10000, // 10 segundos de timeout
      });
      setInventarioData(response.data);
      setMessage(`✅ Datos cargados desde el servidor. ${response.data.length} elementos encontrados.`);
    } catch (error: unknown) {
      console.error('Error completo:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as Record<string, unknown>).code === 'string' &&
        ((error as Record<string, unknown>).code === 'ECONNREFUSED' || ((error as Record<string, unknown>).message && typeof (error as Record<string, unknown>).message === 'string' && (error as Record<string, unknown>).message.includes('Network Error')))
      ) {
        setMessage('❌ No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as Record<string, unknown>).response
      ) {
        const err = error as { response: { status: number; data?: { message?: string } } };
        setMessage(`❌ Error del servidor: ${err.response.status} - ${err.response.data?.message || 'Error desconocido'}`);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'request' in error &&
        (error as Record<string, unknown>).request
      ) {
        setMessage('❌ Sin respuesta del servidor. Verifica la conexión y que el backend esté corriendo.');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
      ) {
        setMessage(`❌ Error: ${(error as { message: string }).message}`);
      } else {
        setMessage('❌ Error desconocido.');
      }
    } finally {
      setLoading(false);
    }
  };


  // Función para guardar cambios en el backend
  const guardarCambios = async () => {
    try {
      await axios.post('http://localhost:8080/api/inventario/update', inventarioData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage('✅ Cambios guardados exitosamente.');
    } catch (error) {
      setMessage('❌ Error al guardar los cambios.');
      console.error(error);
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

      // Generar nombre de archivo con fecha y autor
      const fecha = new Date().toISOString().split('T')[0];
  const nombreArchivo = `inventario-${fecha}-JAVIER CAMPOS.xlsx`;

      XLSX.writeFile(workbook, nombreArchivo);
      setMessage(`✅ Archivo Excel exportado: ${nombreArchivo}`);
    } catch (error) {
      setMessage('❌ Error al exportar archivo Excel');
      console.error('Error:', error);
    }
  };



  // Función para buscar un elemento por placa
  // Mejorar búsqueda: insensible a mayúsculas, ignora espacios, permite coincidencia parcial
  const buscarPorPlaca = (codigo?: string) => {
    // Búsqueda exacta: compara como string, sin eliminar ceros a la izquierda
    const normalizarPlaca = (p: string | number | undefined) => {
      return (p ?? '').toString().replace(/\s+/g, '').toLowerCase();
    };
    const placaBuscada = normalizarPlaca(codigo ?? searchPlaca);
    let idxEncontrado = -1;
  let itemEncontrado: InventarioItem | null = null;
    for (let idx = 0; idx < inventarioData.length; idx++) {
  const placaNormalizada = normalizarPlaca(inventarioData[idx].placa);
      if (placaNormalizada === placaBuscada) {
        idxEncontrado = idx;
        itemEncontrado = inventarioData[idx];
        break;
      }
    }
    if (itemEncontrado && idxEncontrado !== -1) {
      setEditItem(itemEncontrado);
      setHighlightedRow(idxEncontrado);
      setMessage(`✅ Elemento encontrado: ${itemEncontrado.descripcion ?? ''} (Placa: ${itemEncontrado.placa ?? ''})`);
      setTimeout(() => {
        const row = document.getElementById(`row-${idxEncontrado}`);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setEditItem(null);
      setHighlightedRow(null);
      setMessage('❌ No se encontró ningún elemento con esa placa. Prueba con otra o revisa el formato.');
    }
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (field: keyof InventarioItem, value: unknown) => {
    if (editItem) {
      setEditItem({ ...editItem, [field]: value });
    }
  };

  // Función para guardar los cambios del elemento editado
  const guardarEdicion = () => {
    if (editItem) {
      // Limpiar stockFisico: solo permitir 'Encontrado' o 'No encontrado'
      const cleanEditItem = {
        ...editItem,
        stockFisico:
          String(editItem.stockFisico).trim().toLowerCase() === 'no encontrado' || String(editItem.stockFisico).trim() === '0'
            ? 'No encontrado'
            : 'Encontrado',
      };
      const updatedData = inventarioData.map((item) =>
        item.placa === editItem.placa ? cleanEditItem : item
      );
      setInventarioData(updatedData);
      setEditItem(null);
      setMessage('✅ Cambios guardados localmente.');
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

        {/* Campo de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Buscar por Placa</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <input
              type="text"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value)}
              placeholder="Ingrese el número de placa"
              title="Buscar por número de placa"
              className="border rounded-lg px-4 py-2 w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={() => buscarPorPlaca()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        {editItem && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">✏️ Editar Elemento</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ambiente</label>
                <input
                  type="text"
                  value={editItem.ambiente}
                  onChange={(e) => handleEditChange('ambiente', e.target.value)}
                  placeholder="Ingrese el ambiente"
                  title="Editar ambiente"
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock físico</label>
                <select
                  aria-label="Seleccionar estado de stock físico"
                  value={(() => {
                    const v = String(editItem.stockFisico).trim().toLowerCase();
                    return v === '0' || v === 'no encontrado' ? 'No encontrado' : 'Encontrado';
                  })()}
                  onChange={e => handleEditChange('stockFisico', e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                >
                  <option value="Encontrado">Encontrado</option>
                  <option value="No encontrado">No encontrado</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Observación</label>
                <input
                  type="text"
                  value={editItem.observacion}
                  onChange={(e) => handleEditChange('observacion', e.target.value)}
                  placeholder="Ingrese la observación"
                  title="Editar observación"
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={guardarEdicion}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditItem(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Área de carga de archivos (oculta temporalmente) */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
        </div> */}

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">⚡ Acciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Botón de exportar Excel permanece */}
            <button
              onClick={exportarExcel}
              disabled={inventarioData.length === 0}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>📊</span>
              Exportar Excel
            </button>

          </div>
        </div>

        {/* Tabla de datos */}
        {inventarioData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto w-full">
            <div className="w-full min-w-[900px]">
              <table className="w-full table-auto divide-y divide-gray-200 text-xs md:text-sm lg:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    {/* Columna para número de fila, sin encabezado */}
                    <th className="w-6 p-0 m-0 bg-gray-50"></th>
                    {Object.keys(inventarioData[0])
                      .filter((col) => col.toLowerCase() !== 'modulo')
                      .map((col) => (
                        <th
                          key={col}
                          className={
                            col.toLowerCase() === 'valor'
                              ? 'px-4 py-2 whitespace-nowrap text-center'
                              : 'px-4 py-2 whitespace-nowrap text-center'
                          }
                        >
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {inventarioData.map((item, idx) => (
                    <tr
                      key={idx}
                      id={`row-${idx}`}
                      className={`border-b hover:bg-gray-50 ${highlightedRow === idx ? 'bg-green-200 ring-2 ring-green-400' : ''}`}
                    >
                      {/* Celda de número de fila */}
                      <td className="w-6 p-0 m-0 text-xs text-gray-400 text-center select-none">{idx + 1}</td>
                      {Object.keys(item)
                        .filter((col) => col.toLowerCase() !== 'modulo')
                        .map((col) => {
                          if (["Ambiente", "Stock fisico", "Observación"].includes(col)) {
                            if (col === "Stock fisico") {
                              const valor = String(item[col as keyof typeof item]).trim().toLowerCase();
                              // Solo mostrar 'No encontrado' si es exactamente '0' o 'no encontrado', todo lo demás es 'Encontrado'
                              const mostrar = (valor === '0' || valor === 'no encontrado') ? 'No encontrado' : 'Encontrado';
                              return (
                                <td key={col} className="px-4 py-2">{mostrar}</td>
                              );
                            }
                            return (
                              <td key={col} className="px-4 py-2">
                                {item[col as keyof typeof item] as string | number}
                              </td>
                            );
                          } else if (col.toLowerCase() === 'modulo') {
                            // Forzar que siempre muestre 'INVE' en la tabla
                            return (
                              <td key={col} className="px-4 py-2">
                                INVE
                              </td>
                            );
                          } else if (col.toLowerCase() === 'valor') {
                            // Normalizar el valor quitando cualquier signo $ y espacios
                            let rawValue = item[col as keyof typeof item] as string | number;
                            if (typeof rawValue === 'string') {
                              rawValue = rawValue.replace(/\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(/,/g, '');
                            }
                            let numValue = Number(rawValue);
                            // Poner 0 si la celda está vacía en las filas indicadas
                            const filasCero = [64,65,71,72,470,471,472,473,561,562,699];
                            if (filasCero.includes(idx + 1) && (!rawValue || isNaN(numValue) || numValue === 0)) {
                              numValue = 0;
                            }
                            // Asignar valor específico a la fila 493 si está vacía
                            if (idx + 1 === 493 && (!rawValue || isNaN(numValue) || numValue === 0)) {
                              numValue = 4971399;
                            }
                            // Ajustar filas específicas eliminando los dos últimos dígitos si es necesario
                            const filasAjustar2 = [66,70,190];
                            const filasAjustar = [52,67,68,73,74,75,76,77,78,79,186,187,188,260,261,268,269,270,271,272,273,274,275,276,343,344,345,416,491,558,564,572,602,688,691,692,693,696,697,698,762,763];
                            if (filasAjustar.includes(idx + 1) && !isNaN(numValue) && numValue > 0) {
                              numValue = Math.floor(numValue / 100);
                            }
                            // Forzar valor exacto para la fila 70
                            if (idx + 1 === 70) {
                              numValue = 922925;
                            }
                            return (
                              <td
                                key={col}
                                className="px-4 py-2 text-right text-black"
                              >
                                {!isNaN(numValue) && numValue > 0
                                  ? Math.round(numValue).toLocaleString('es-CO')
                                  : ''}
                              </td>
                            );
                          } else {
                            return (
                              <td
                                key={col}
                                className="px-4 py-2"
                              >
                                {item[col as keyof typeof item] as string | number}
                              </td>
                            );
                          }
                        })}
                </tr>
              ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}