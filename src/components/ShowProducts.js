import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { showAlert } from '../functions'
import { useNavigate } from "react-router-dom"

const ShowProducts = () => {
    const url = 'http://localhost:8080/products/v1/api';
    const categoryUrl = 'http://localhost:8080/category/v1/api';
    const navigate = useNavigate();


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    const getProducts = async () => {
        const response = await axios.get(url);
        setProducts(response.data);
    };

    const getCategories = async () => {
        const response = await axios.get(categoryUrl);
        setCategories(response.data);
    };

    const openModal = (op, id = '', name = '', price = '', stock = '', categoryId = '') => {
        setId(id || '');
        setName(name || '');
        setPrice(price || '');
        setStock(stock || '');
        setCategory(categoryId ? String(categoryId) : ''); // Convertimos a string

        setOperation(op);
        setTitle(op === 2 ? 'Edit Product' : 'Add Product');

        setTimeout(() => {
            document.getElementById('name').focus();
        }, 500);

    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            showAlert('El nombre del producto es obligatorio', 'warning');

        }
        else if (price === '' || isNaN(price) || price <= 0) {
            showAlert('El precio debe ser un número mayor a 0', 'warning');

        }
        else if (stock === '' || isNaN(stock) || stock < 0) {
            showAlert('El stock debe ser un número válido', 'warning');

        }
        else if (!category || category === '') {
            showAlert('Debes seleccionar una categoría', 'warning');

        }
        else {
            if (operation === 1) {
                parametros = {
                    name: name.trim(),
                    price: price,
                    stock: stock,
                    category: {
                        id: category.trim()
                    }
                };
                metodo = 'POST';
            }
            else {
                parametros = {
                    name: name.trim(),
                    price: price,
                    stock: stock,
                    category: {
                        id: category.trim()
                    }
                }

                metodo = 'PUT';
            }
            enviarSolicitud(parametros, metodo);
        }
    }
    const enviarSolicitud = async (parametros, metodo) => {
        try {
            const endpoint = metodo === 'PUT' ? `${url}/${id}` : url;
            const response = await axios({
                method: metodo,
                url: endpoint,
                data: parametros
            });

            console.log('Respuesta completa:', response); // Debugging

            // Usamos el status de la respuesta para determinar el mensaje
            if (response.status === 200 || response.status === 201) {
                showAlert('Operación realizada con éxito', 'success');

                // Cierra el modal
                document.getElementById('btnCerrar').click();

                // Recarga los productos
                getProducts();
            } else {
                showAlert('No se pudo completar la operación', 'error');
            }
        } catch (error) {
            showAlert('Error en la solicitud', 'error');
            console.error('Error en la solicitud:', error);
        }
    };

    const deleteProduct = async (id) => {
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

                    // Verificar si la eliminación fue exitosa
                    if (response.status === 200) {
                        showAlert('Producto eliminado correctamente', 'success');
                        getProducts(); // Recargar la tabla
                    } else {
                        showAlert('No se pudo eliminar el producto', 'error');
                    }
                } catch (error) {
                    showAlert('Error en la solicitud de eliminación', 'error');
                    console.error('Error eliminando el producto:', error);
                }
            }
        });
    };
    const handleFilters = (newSearch, newCategory) => {
        setSearch(newSearch);
        setSelectedCategory(newCategory);
        SearchProducts(newSearch, newCategory);
    };

    const SearchProducts = async (query = '', categoryId = '') => {
        let endpoint = url;

        if (query.trim() !== '') {
            endpoint = `${url}/search?query=${query}`;
        } else if (categoryId) {
            endpoint = `${url}/category/${categoryId}`;
        }

        try {
            const response = await axios.get(endpoint);
            setProducts(response.data);
        } catch (error) {
            showAlert('Error al obtener productos', 'error');
            console.error('Error al filtrar productos:', error);
        }
    };

    return (
        <div className='App'>
            <div className='container mt-3'>
                <div className='d-grid mx-auto mb-3'>
                    <button className='btn btn-dark' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalProducts'>
                        <i className='fa-solid fa-circle-plus'></i> Add Product
                    </button>
                </div>

                <div className='row mb-3'>
                    <div className='col-md-6'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Buscar producto...'
                            value={search}
                            onChange={(e) => handleFilters(e.target.value, selectedCategory)}
                        />
                    </div>
                    <div className='col-md-6'>
                        <select
                            className='form-control'
                            value={selectedCategory}
                            onChange={(e) => handleFilters(search, e.target.value)}
                        >
                            <option value=''>Todas las categorías</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${new Intl.NumberFormat('es-mx').format(product.price)}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.category?.name}</td>
                                    <td>
                                        <button
                                            className='btn btn-warning'
                                            onClick={() => openModal(2, product.id, product.name, product.price, product.stock, product.category?.id)}
                                            data-bs-toggle='modal'
                                            data-bs-target='#modalProducts'
                                        >
                                            <i className='fa-solid fa-edit'></i>
                                        </button>
                                        &nbsp;
                                        <button className='btn btn-danger' onClick={() => deleteProduct(product.id)}>
                                            <i className='fa-solid fa-trash'></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='d-grid mx-auto mt-3'>
                    <button className='btn btn-primary' onClick={() => window.location.href = '/categories'}>
                        Go to Categories   <i className='fa-solid fa-arrow-right'></i> 
                    </button>
                </div>

            </div>

            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>

                        <div className='modal-body'>
                            <input type='hidden' id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-tag'></i></span>
                                <input
                                    type='text'
                                    id='name'
                                    className='form-control'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input
                                    type='text'
                                    id='price'
                                    className='form-control'
                                    placeholder='Price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-boxes-stacked'></i></span>
                                <input
                                    type='text'
                                    id='stock'
                                    className='form-control'
                                    placeholder='Stock'
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-tags'></i></span>
                                <select
                                    id='category'
                                    className='form-control'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value=''>Seleccione una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='d-grid col-6 mx-auto'>
                                <button className='btn btn-success' onClick={() => { validar() }}>
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


        </div>
    );
};

export default ShowProducts;
