import React, { useState } from 'react';
import axios from 'axios';

function SubirArchivo() {
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleSubirArchivo = async () => {
        if (!archivo) {
            setMensaje('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', archivo);

        try {
            const response = await axios.post('http://localhost:8080/api/inventario/subir-excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMensaje(response.data);
        } catch (error) {
            setMensaje('Error al subir el archivo: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Subir Archivo Excel</h2>
            <input type="file" onChange={handleArchivoChange} />
            <button onClick={handleSubirArchivo}>Subir Archivo</button>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default SubirArchivo;