import React, { useEffect, useState, useCallback } from 'react';
import { useCarContext } from '../context/CarContext';

// componente de notificacion
function Toast() {
  const { state, hideToast } = useCarContext();
  const { toast } = state;
  const [show, setShow] = useState(false);

  useEffect(() => {
    // cuando existe un toas en automatico se muestra y se cierra la notificacion
    if (toast) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          hideToast();
        }, 300); // Espera a que termine la animacion.
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  // evento para cierre manual de la notificacion
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      hideToast();
    }, 300);
  };

  if (!toast && !show) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
      <div 
        className={`toast align-items-center text-bg-${toast?.variant || 'primary'} border-0 ${show ? 'show' : 'hide'}`}
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ display: toast ? 'block' : 'none' }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {toast?.message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            aria-label="Cerrar"
            onClick={handleClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
