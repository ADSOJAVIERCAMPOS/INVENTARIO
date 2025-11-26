import { useState, useEffect } from 'react';

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

interface EstadisticasInventarioProps {
  datos: InventarioItem[];
}

interface Estadisticas {
  totalElementos: number;
  elementosConDiferencia: number;
  diferenciasPositivas: number;
  diferenciasNegativas: number;
  categorias: { [key: string]: number };
  marcas: { [key: string]: number };
  valorTotalFisico: number;
  valorTotalSistema: number;
}

export default function EstadisticasInventario({ datos }: EstadisticasInventarioProps) {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalElementos: 0,
    elementosConDiferencia: 0,
    diferenciasPositivas: 0,
    diferenciasNegativas: 0,
    categorias: {},
    marcas: {},
    valorTotalFisico: 0,
    valorTotalSistema: 0
  });

  useEffect(() => {
    if (datos.length === 0) {
      setEstadisticas({
        totalElementos: 0,
        elementosConDiferencia: 0,
        diferenciasPositivas: 0,
        diferenciasNegativas: 0,
        categorias: {},
        marcas: {},
        valorTotalFisico: 0,
        valorTotalSistema: 0
      });
      return;
    }

    const nuevasEstadisticas: Estadisticas = {
      totalElementos: datos.length,
      elementosConDiferencia: 0,
      diferenciasPositivas: 0,
      diferenciasNegativas: 0,
      categorias: {},
      marcas: {},
      valorTotalFisico: 0,
      valorTotalSistema: 0
    };

    datos.forEach(item => {
      // Contar diferencias
      if (item.diferencia !== 0) {
        nuevasEstadisticas.elementosConDiferencia++;
        if (item.diferencia > 0) {
          nuevasEstadisticas.diferenciasPositivas++;
        } else {
          nuevasEstadisticas.diferenciasNegativas++;
        }
      }

      // Contar por categorías
      nuevasEstadisticas.categorias[item.categoria] = 
        (nuevasEstadisticas.categorias[item.categoria] || 0) + 1;

      // Contar por marcas
      nuevasEstadisticas.marcas[item.marca] = 
        (nuevasEstadisticas.marcas[item.marca] || 0) + 1;

      // Sumar cantidades
      nuevasEstadisticas.valorTotalFisico += item.cantidadFisica;
      nuevasEstadisticas.valorTotalSistema += item.cantidadSistema;
    });

    setEstadisticas(nuevasEstadisticas);
  }, [datos]);

  const porcentajeDiferencias = estadisticas.totalElementos > 0 
    ? (estadisticas.elementosConDiferencia / estadisticas.totalElementos * 100).toFixed(1)
    : '0';

  const topCategorias = Object.entries(estadisticas.categorias)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topMarcas = Object.entries(estadisticas.marcas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  if (datos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Estadísticas del Inventario</h2>
        <p className="text-gray-500 text-center py-8">
          No hay datos para mostrar estadísticas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">📊 Estadísticas del Inventario</h2>
      
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{estadisticas.totalElementos}</div>
          <div className="text-sm text-blue-700">Total Elementos</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{estadisticas.elementosConDiferencia}</div>
          <div className="text-sm text-yellow-700">Con Diferencias</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{estadisticas.diferenciasPositivas}</div>
          <div className="text-sm text-green-700">Sobrantes</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{estadisticas.diferenciasNegativas}</div>
          <div className="text-sm text-red-700">Faltantes</div>
        </div>
      </div>

      {/* Porcentaje de diferencias */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">Porcentaje de elementos con diferencias:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${porcentajeDiferencias}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{porcentajeDiferencias}%</span>
          </div>
        </div>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">📦 Cantidad Total Física</h3>
          <div className="text-2xl font-bold text-green-600">{estadisticas.valorTotalFisico}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800 mb-2">💻 Cantidad Total Sistema</h3>
          <div className="text-2xl font-bold text-indigo-600">{estadisticas.valorTotalSistema}</div>
        </div>
      </div>

      {/* Top categorías y marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">🏷️ Top Categorías</h3>
          <div className="space-y-2">
            {topCategorias.map(([categoria, cantidad]) => (
              <div key={categoria} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">{categoria}</span>
                <span className="font-medium text-blue-600">{cantidad}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">🏭 Top Marcas</h3>
          <div className="space-y-2">
            {topMarcas.map(([marca, cantidad]) => (
              <div key={marca} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">{marca}</span>
                <span className="font-medium text-green-600">{cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
