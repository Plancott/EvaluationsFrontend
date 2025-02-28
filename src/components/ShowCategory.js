import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CategoryCrud = () => {
    const url = 'http://localhost:8080/category/v1/api';
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const response = await axios.get(url);
        setCategories(response.data);
    };

    const openModal = (op, id = '', name = '') => {
        setId(id || '');
        setName(name || '');
        setOperation(op);
        setTitle(op === 2 ? 'Edit Category' : 'Add Category');
    };

    const validar = () => {
        if (name.trim() === '') {
            Swal.fire('El nombre de la categoría es obligatorio', '', 'warning');
        } else {
            const parametros = { name: name.trim() };
            const metodo = operation === 1 ? 'POST' : 'PUT';
            enviarSolicitud(parametros, metodo);
        }
    };

    const enviarSolicitud = async (parametros, metodo) => {
        try {
            const endpoint = metodo === 'PUT' ? `${url}/${id}` : url;
            const response = await axios({ method: metodo, url: endpoint, data: parametros });
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Operación realizada con éxito', '', 'success');
                document.getElementById('btnCerrar').click();
                getCategories();
            }
        } catch (error) {
            Swal.fire('Error en la solicitud', '', 'error');
        }
    };

    const deleteCategory = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${url}/${id}`);
                    if (response.status === 200) {
                        Swal.fire('Categoría eliminada correctamente', '', 'success');
                        getCategories();
                    }
                } catch (error) {
                    Swal.fire('Error en la solicitud de eliminación', '', 'error');
                }
            }
        });
    };

    return (
        <div className='container mt-3'>
            <div className='d-grid mx-auto mb-3'>
                <button className='btn btn-dark' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalCategories'>
                    <i className='fa-solid fa-circle-plus'></i> Add Category
                </button>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button className='btn btn-warning' onClick={() => openModal(2, category.id, category.name)} data-bs-toggle='modal' data-bs-target='#modalCategories'>
                                        <i className='fa-solid fa-edit'></i>
                                    </button>
                                    &nbsp;
                                    <button className='btn btn-danger' onClick={() => deleteCategory(category.id)}>
                                        <i className='fa-solid fa-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div id='modalCategories' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-tag'></i></span>
                                <input type='text' id='name' className='form-control' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button className='btn btn-success' onClick={validar}>
                                    <i className='fa-solid fa-floppy-disk'></i> Save
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Botón para regresar a productos */}
            <div className='d-grid mx-auto mt-3'>
                <button className='btn btn-primary' onClick={() => window.location.href = '/'}>
                    <i className='fa-solid fa-arrow-left'></i> Back to Products
                </button>
            </div>
        </div>
    );
};

export default CategoryCrud;
