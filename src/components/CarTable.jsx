import React, { useMemo } from 'react';
import { useCarContext } from '../context/CarContext';

// Tabla principal de administracion de automoviles.
// Permite buscar registros y acceder a las acciones de ver, editar o eliminar.
function CarTable() {
  const { state, dispatch } = useCarContext();
  const { cars, searchTerm } = state;

  // Memoriza el filtrado para recalcular resultados solo cuando cambian los autos o la busqueda.
  const filteredCars = useMemo(() => {
    if (!searchTerm.trim()) return cars;
    
    const term = searchTerm.toLowerCase();
    return cars.filter(car => 
      car.marca.toLowerCase().includes(term) ||
      car.modelo.toLowerCase().includes(term) ||
      car.pais.toLowerCase().includes(term)
    );
  }, [cars, searchTerm]);

  // Presenta los valores economicos con formato de moneda USD.
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Actualiza el termino de busqueda en el contexto global.
  const handleSearch = (e) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  // Abre el formulario en modo creacion.
  const handleNew = () => {
    dispatch({ type: 'TOGGLE_FORM' });
  };

  // Abre el modal de detalle para el automovil seleccionado.
  const handleView = (car) => {
    dispatch({ type: 'TOGGLE_DETAIL', payload: car });
  };

  // Abre el formulario en modo edicion con los datos actuales del automovil.
  const handleEdit = (car) => {
    dispatch({ type: 'TOGGLE_FORM', payload: car });
  };

  // Abre el modal de confirmacion antes de eliminar.
  const handleDelete = (car) => {
    dispatch({ type: 'TOGGLE_DELETE', payload: car });
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="mb-0"><i className="bi bi-list-ul"></i> Automóviles registrados</h2>
        <div className="d-flex gap-2 flex-wrap">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar marca, modelo, país..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary" onClick={handleNew}>
            <i className="bi bi-plus-lg"></i> Nuevo
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {/* La tabla se vuelve desplazable en pantallas pequenas gracias a table-responsive. */}
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Foto</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Estado</th>
              <th>País</th>
              <th className="text-end">Valor (USD)</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.length === 0 ? (
              // Mensaje contextual cuando no existen registros o no hay coincidencias de busqueda.
              <tr>
                <td colSpan="9" className="text-center text-muted py-4">
                  {cars.length === 0 
                    ? 'No hay automóviles registrados'
                    : 'Sin resultados para tu búsqueda'}
                </td>
              </tr>
            ) : (
              filteredCars.map((car, index) => (
                <tr key={car.id}>
                  <td>{index + 1}</td>
                  <td>
                    {car.imagen ? (
                      <img 
                        src={car.imagen} 
                        className="car-thumb" 
                        alt={`${car.marca} ${car.modelo}`}
                        onClick={() => handleView(car)}
                        style={{ cursor: 'pointer', maxWidth: '50px' }}
                      />
                    ) : (
                      <span className="car-thumb-placeholder">
                        <i className="bi bi-card-image"></i>
                      </span>
                    )}
                  </td>
                  <td><strong>{car.marca}</strong></td>
                  <td>{car.modelo}</td>
                  <td>{car.anio}</td>
                  <td><span className="badge bg-secondary">{car.estado}</span></td>
                  <td>{car.pais}</td>
                  <td className="text-end">{formatCurrency(car.valor)}</td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-info me-1" 
                      onClick={() => handleView(car)}
                      title="Ver detalle"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-warning me-1" 
                      onClick={() => handleEdit(car)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => handleDelete(car)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CarTable;
