import React, { useState, useEffect } from 'react';

function Inventario() {
    const [inventario, setInventario] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Cargar datos del archivo Excel al iniciar el sistema
        fetch('http://localhost:8080/api/inventario')
            .then(response => response.json())
            .then(data => setInventario(data));
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedInventario = [...inventario];
        updatedInventario[index][field] = value;
        setInventario(updatedInventario);
    };

    const handleSave = () => {
        fetch('http://localhost:8080/api/inventario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inventario),
        })
            .then(response => response.text())
            .then(message => alert(message));
    };

    return (
        <div>
            <h1>Sistema de Inventario</h1>
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Salir del Modo Edición' : 'Entrar en Modo Edición'}
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Número de Placa</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {inventario.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={item.numeroPlaca}
                                        onChange={(e) =>
                                            handleInputChange(index, 'numeroPlaca', e.target.value)
                                        }
                                    />
                                ) : (
                                    item.numeroPlaca
                                )}
                            </td>
                            <td>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={item.descripcion}
                                        onChange={(e) =>
                                            handleInputChange(index, 'descripcion', e.target.value)
                                        }
                                    />
                                ) : (
                                    item.descripcion
                                )}
                            </td>
                            <td>
                                {editMode ? (
                                    <input
                                        type="number"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            handleInputChange(index, 'cantidad', e.target.value)
                                        }
                                    />
                                ) : (
                                    item.cantidad
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editMode && <button onClick={handleSave}>Guardar Cambios</button>}
        </div>
    );
}

export default Inventario;