import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

interface BusquedaInteligenteProps {
  onResultados: (resultados: any[]) => void;
  placeholder?: string;
  className?: string;
}

const BusquedaInteligente: React.FC<BusquedaInteligenteProps> = ({
  onResultados,
  placeholder = "🔍 Buscar artículos por descripción, código, placa o ubicación...",
  className = ""
}) => {
  const [termino, setTermino] = useState('');
  const [cargando, setCargando] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
  const [filtros, setFiltros] = useState({
    descripcion: '',
    estado: '',
    clasificacion: '',
    ubicacion: ''
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const sugerenciasRef = useRef<HTMLDivElement>(null);

  // Búsqueda con debounce para evitar muchas llamadas
  const buscarArticulos = useRef(
    debounce(async (terminoBusqueda: string) => {
      if (terminoBusqueda.length < 2) {
        setSugerencias([]);
        setMostrarSugerencias(false);
        onResultados([]);
        return;
      }

      setCargando(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/articulos/busqueda?q=${encodeURIComponent(terminoBusqueda)}`
        );
        
        if (response.ok) {
          const resultados = await response.json();
          setSugerencias(resultados.slice(0, 5)); // Máximo 5 sugerencias
          setMostrarSugerencias(true);
          onResultados(resultados);
        } else {
          console.error('Error en búsqueda:', response.statusText);
          setSugerencias([]);
          onResultados([]);
        }
      } catch (error) {
        console.error('Error al buscar:', error);
        setSugerencias([]);
        onResultados([]);
      } finally {
        setCargando(false);
      }
    }, 300)
  ).current;

  // Búsqueda avanzada
  const busquedaAvanzada = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.append(key, value.trim());
        }
      });

      const response = await fetch(
        `http://localhost:8080/api/articulos/busqueda-avanzada?${params.toString()}`
      );
      
      if (response.ok) {
        const resultados = await response.json();
        onResultados(resultados);
        setMostrarSugerencias(false);
      } else {
        console.error('Error en búsqueda avanzada:', response.statusText);
        onResultados([]);
      }
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
      onResultados([]);
    } finally {
      setCargando(false);
    }
  };

  // Efecto para búsqueda automática
  useEffect(() => {
    if (termino.trim()) {
      buscarArticulos(termino);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
      onResultados([]);
    }
  }, [termino]);

  // Manejar clic fuera para cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        sugerenciasRef.current &&
        !sugerenciasRef.current.contains(event.target as Node)
      ) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const seleccionarSugerencia = (articulo: any) => {
    setTermino(`${articulo.codigoArticulo} - ${articulo.descripcion}`);
    setMostrarSugerencias(false);
    onResultados([articulo]);
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setFiltros({
      descripcion: '',
      estado: '',
      clasificacion: '',
      ubicacion: ''
    });
    setSugerencias([]);
    setMostrarSugerencias(false);
    onResultados([]);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            onFocus={() => sugerencias.length > 0 && setMostrarSugerencias(true)}
          />
          
          {/* Icono de búsqueda */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {cargando ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {/* Botones de acción */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {termino && (
              <button
                onClick={limpiarBusqueda}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Limpiar búsqueda"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <button
              onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
              className={`p-1.5 rounded transition-colors ${
                filtrosAvanzados 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Filtros avanzados"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sugerencias de búsqueda */}
        {mostrarSugerencias && sugerencias.length > 0 && (
          <div
            ref={sugerenciasRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {sugerencias.map((articulo, index) => (
              <div
                key={articulo.id || index}
                onClick={() => seleccionarSugerencia(articulo)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-semibold">
                        {articulo.codigoArticulo?.charAt(0) || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {articulo.codigoArticulo} - {articulo.descripcion}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      📍 {articulo.ubicacion || 'Sin ubicación'} • 
                      📊 Cantidad: {articulo.cantidadTeorica || 0} • 
                      🏷️ {articulo.estado || 'Sin estado'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtros avanzados */}
      {filtrosAvanzados && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filtros Avanzados
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
              <input
                type="text"
                value={filtros.descripcion}
                onChange={(e) => setFiltros({...filtros, descripcion: e.target.value})}
                placeholder="Buscar en descripción..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="DAÑADO">Dañado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Clasificación</label>
              <input
                type="text"
                value={filtros.clasificacion}
                onChange={(e) => setFiltros({...filtros, clasificacion: e.target.value})}
                placeholder="Ej: Muebles, Electrónicos..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ubicación</label>
              <input
                type="text"
                value={filtros.ubicacion}
                onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
                placeholder="Ej: Oficina, Almacén..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={busquedaAvanzada}
              disabled={cargando}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              🔍 Buscar con Filtros
            </button>
            <button
              onClick={() => {
                setFiltros({
                  descripcion: '',
                  estado: '',
                  clasificacion: '',
                  ubicacion: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusquedaInteligente;