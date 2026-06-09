import React, { useEffect, useState } from 'react';
import { useCarContext } from '../context/CarContext';

// modal para confirmacion de eliminacion de un automovil
function ConfirmDelete() {
  const { state, dispatch, deleteCar, showToast } = useCarContext();
  const { showDelete, selectedCar } = state;
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showDelete && selectedCar) {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 50);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '17px';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      setTimeout(() => setIsAnimating(false), 300);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showDelete, selectedCar]);

  // evento de eliminacion de automovil seleccionaddo
  const handleConfirm = () => {
    try {
      if (selectedCar) {
        deleteCar(selectedCar.id);
        showToast('Automóvil eliminado correctamente', 'success');
      }
    } catch (error) {
      showToast('Error al eliminar: ' + error.message, 'danger');
    }
    handleClose();
  };

  
  //n evento de cerrar el modal
  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    setTimeout(() => {
      dispatch({ type: 'TOGGLE_DELETE' });
      setIsAnimating(false);
    }, 300);
  };

  // cerramos el modal en caso que el usuario haga click por afuera del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };


  if (!showDelete && !isAnimating) return null;

  return (
    <>
      <div 
        className={`modal-backdrop fade ${isVisible ? 'show' : ''}`} 
        style={{ 
          display: isVisible ? 'block' : 'none',
          zIndex: 1050
        }}
        onClick={handleClose}
      />
      
      <div 
        className={`modal fade ${isVisible ? 'show' : ''}`} 
        style={{ 
          display: isVisible ? 'block' : 'none',
          zIndex: 1055
        }}
        tabIndex="-1"
        role="dialog"
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar eliminación
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                aria-label="Cerrar"
                onClick={handleClose}
              />
            </div>
            
            <div className="modal-body">
              <p className="mb-2">¿Seguro que deseas eliminar este automóvil?</p>
              <p className="text-danger mb-0">
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
              {selectedCar && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small>
                    <strong>{selectedCar.marca} {selectedCar.modelo}</strong> ({selectedCar.anio})
                  </small>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleConfirm}
              >
                <i className="bi bi-trash me-1"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDelete;
