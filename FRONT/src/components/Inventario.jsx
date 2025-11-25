import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Inventario() {
    const [inventario, setInventario] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Cargar datos del archivo Excel al iniciar el sistema
        fetch('/Inventario Fisico ADSO.xlsx')
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setInventario(jsonData);
            })
            .catch((error) => console.error('Error al cargar el archivo Excel:', error));
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedInventario = [...inventario];
        updatedInventario[index][field] = value;
        setInventario(updatedInventario);
    };

    const handleSave = () => {
        console.log('Datos guardados:', inventario);
        alert('Cambios guardados correctamente.');
    };

    return (
        <div>
            <h1>Sistema de Inventario</h1>
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Salir del Modo Edición' : 'Entrar en Modo Edición'}
            </button>
            <table border="1">
                <thead>
                    <tr>
                        {inventario.length > 0 &&
                            Object.keys(inventario[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {inventario.map((item, index) => (
                        <tr key={index}>
                            {Object.keys(item).map((field, i) => (
                                <td key={i}>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={item[field]}
                                            onChange={(e) =>
                                                handleInputChange(index, field, e.target.value)
                                            }
                                        />
                                    ) : (
                                        item[field]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {editMode && <button onClick={handleSave}>Guardar Cambios</button>}
        </div>
    );
}

export default Inventario;