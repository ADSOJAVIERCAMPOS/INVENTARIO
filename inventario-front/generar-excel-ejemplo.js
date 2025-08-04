// Script para generar un archivo Excel de ejemplo
// Puedes ejecutar este script con Node.js para crear un archivo de prueba

const XLSX = require('xlsx');

// Datos de ejemplo para el inventario
const datosInventario = [
  {
    'Descripcion': 'Laptop Dell Inspiron 15',
    'Categoria': 'Computadoras',
    'Marca': 'Dell',
    'Modelo': 'Inspiron 15 3000',
    'Numero Serie': 'DL001234',
    'Cantidad Fisica': 5,
    'Cantidad Sistema': 6,
    'Diferencia': -1,
    'Observaciones': 'Falta una unidad'
  },
  {
    'Descripcion': 'Monitor LG 24 pulgadas',
    'Categoria': 'Monitores',
    'Marca': 'LG',
    'Modelo': '24MK430H',
    'Numero Serie': 'LG567890',
    'Cantidad Fisica': 10,
    'Cantidad Sistema': 8,
    'Diferencia': 2,
    'Observaciones': 'Dos unidades adicionales encontradas'
  },
  {
    'Descripcion': 'Teclado mecánico',
    'Categoria': 'Periféricos',
    'Marca': 'Logitech',
    'Modelo': 'MX Keys',
    'Numero Serie': 'LT456789',
    'Cantidad Fisica': 15,
    'Cantidad Sistema': 15,
    'Diferencia': 0,
    'Observaciones': 'Inventario correcto'
  },
  {
    'Descripcion': 'Mouse inalámbrico',
    'Categoria': 'Periféricos',
    'Marca': 'Logitech',
    'Modelo': 'MX Master 3',
    'Numero Serie': 'LM789012',
    'Cantidad Fisica': 12,
    'Cantidad Sistema': 14,
    'Diferencia': -2,
    'Observaciones': 'Faltan dos unidades'
  },
  {
    'Descripcion': 'Impresora láser',
    'Categoria': 'Impresoras',
    'Marca': 'HP',
    'Modelo': 'LaserJet Pro M404n',
    'Numero Serie': 'HP345678',
    'Cantidad Fisica': 3,
    'Cantidad Sistema': 3,
    'Diferencia': 0,
    'Observaciones': 'En buen estado'
  }
];

// Crear el libro de trabajo
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(datosInventario);

// Agregar la hoja al libro
XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

// Guardar el archivo
XLSX.writeFile(wb, 'inventario-ejemplo.xlsx');

console.log('✅ Archivo inventario-ejemplo.xlsx creado exitosamente');
console.log('📋 Contiene', datosInventario.length, 'elementos de ejemplo');
