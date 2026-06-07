import React, { useEffect, useState } from 'react';
import { useCarContext } from '../context/CarContext';

//  modal para mostrar la informacion registrada de un automovil
function CarDetail() {
  const { state, dispatch } = useCarContext();
  const { showDetail, selectedCar } = state;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // bloqueamos el scroll cuando el modal este abirto dependiendo la accion
    if (showDetail && selectedCar) {
      setTimeout(() => setIsVisible(true), 50);
      document.body.classList.add('modal-open');
    } else {
      setIsVisible(false);
      document.body.classList.remove('modal-open');
    }
  }, [showDetail, selectedCar]);

  // formateamos el valor a moneda en formato USD
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value || 0);
  };


  // funcion para cerrar el modal
  const handleClose = () => {
    setIsVisible(false);
    document.body.classList.remove('modal-open');

    setTimeout(() => {
      dispatch({ type: 'TOGGLE_DETAIL' });
    }, 300);
  };

  // en caso que no existe la seccion de un modal, no renderizamoos nada
  if (!showDetail || !selectedCar) return null;

  return (
    <>

      <div 
        className={`modal-backdrop fade ${isVisible ? 'show' : ''}`} 
        style={{ display: isVisible ? 'block' : 'none' }}
        onClick={handleClose}
      />
      

      <div 
        className={`modal fade ${isVisible ? 'show' : ''}`} 
        style={{ 
          display: isVisible ? 'block' : 'none',
          paddingRight: '17px'
        }}
        tabIndex="-1"
        role="dialog"
        onClick={(e) => {
        
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-info-circle"></i> Detalle del automóvil
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Cerrar"
                onClick={handleClose}
              />
            </div>
            
            <div className="modal-body">
              {selectedCar.imagen && (
                <div className="text-center mb-3">
                  <img 
                    src={selectedCar.imagen} 
                    className="img-fluid rounded" 
                    alt={`${selectedCar.marca} ${selectedCar.modelo}`}
                    style={{ 
                      maxHeight: '300px', 
                      width: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              )}
              
              <dl className="row mb-0">
                <dt className="col-sm-4">Marca</dt>
                <dd className="col-sm-8">{selectedCar.marca}</dd>
                
                <dt className="col-sm-4">Modelo</dt>
                <dd className="col-sm-8">{selectedCar.modelo}</dd>
                
                <dt className="col-sm-4">Año</dt>
                <dd className="col-sm-8">{selectedCar.anio}</dd>
                
                <dt className="col-sm-4">Estado</dt>
                <dd className="col-sm-8">
                  <span className="badge bg-secondary">{selectedCar.estado}</span>
                </dd>
                
                <dt className="col-sm-4">País</dt>
                <dd className="col-sm-8">{selectedCar.pais}</dd>
                
                <dt className="col-sm-4">Valor estimado</dt>
                <dd className="col-sm-8">{formatCurrency(selectedCar.valor)}</dd>
                
                <dt className="col-sm-4">Descripción</dt>
                <dd className="col-sm-8">{selectedCar.descripcion || '—'}</dd>
              </dl>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarDetail;
