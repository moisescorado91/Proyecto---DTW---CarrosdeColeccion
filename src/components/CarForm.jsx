import React, { useState, useEffect, useRef } from 'react';
import { useCarContext } from '../context/CarContext';
import { processImage } from '../services/imageUtils';
import { fetchCarMakes, fetchCountries } from '../services/api';

// Estructura inicial del formulario
const initialState = {
  marca: '',
  modelo: '',
  anio: '',
  estado: '',
  pais: '',
  valor: '',
  descripcion: '',
  imagen: null
};

// Venata de formulario para registrar o editar
function CarForm() {
  const { state, dispatch, addCar, updateCar, showToast } = useCarContext();
  const { showForm, selectedCar } = state;
  const [form, setForm] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [paises, setPaises] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  // Obtiene sugerencias desde APIs publicas en paralelo para reducir el tiempo de espera.
  const loadSuggestions = async () => {
    try {
      const [marcasList, paisesList] = await Promise.all([
        fetchCarMakes(),
        fetchCountries()
      ]);
      setMarcas(marcasList);
      setPaises(paisesList);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    }
  };

  useEffect(() => {
    if (showForm) {
      if (selectedCar) {
        // en caso que presionen editar se carga la informacion del elemento seleccionado
        setForm({
          marca: selectedCar.marca || '',
          modelo: selectedCar.modelo || '',
          anio: selectedCar.anio?.toString() || '',
          estado: selectedCar.estado || '',
          pais: selectedCar.pais || '',
          valor: selectedCar.valor?.toString() || '',
          descripcion: selectedCar.descripcion || '',
          imagen: selectedCar.imagen || null
        });
        setImagePreview(selectedCar.imagen || null);
      } else {
        // en caso que sea nuevo restablecemos el formulario
        setForm(initialState);
        setImagePreview(null);
      }
      setValidated(false);
      setIsVisible(true);
      document.body.classList.add('modal-open');
    } else {
      // Al cerrar el modal se retiran los estilos temporales del documento.
      setIsVisible(false);
      document.body.classList.remove('modal-open');
    }
  }, [showForm, selectedCar]);

  // se limpia clases del body si el componente se desmonta con el modal abierto.
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // se actualiza el campo modificado cada vez que se escribe
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  // Procesa la imagen seleccionada, genera una vista previa y guarda el resultado optimizado.
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const processedImage = await processImage(file);
      setImagePreview(processedImage);
      setForm(prev => ({ ...prev, imagen: processedImage }));
      showToast('Imagen cargada y optimizada', 'success');
    } catch (error) {
      showToast(error.message, 'danger');
    }
  };

  // Permite quitar la imagen cargada y limpiar el input de archivo.
  const handleRemoveImage = () => {
    setImagePreview(null);
    setForm(prev => ({ ...prev, imagen: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // validamos las entradas del formulario
  const validateForm = () => {
    const errors = {};
    
    if (!form.marca.trim()) errors.marca = 'Ingresa una marca válida.';
    if (!form.modelo.trim()) errors.modelo = 'Ingresa un modelo.';
    
    const anio = parseInt(form.anio);
    if (!form.anio || isNaN(anio) || anio < 1886 || anio > 2030) {
      errors.anio = 'Año entre 1886 y 2030.';
    }
    
    if (!form.estado) errors.estado = 'Selecciona un estado.';
    if (!form.pais.trim()) errors.pais = 'Ingresa el país o ubicación.';
    
    const valor = parseFloat(form.valor);
  
    // validamos la entrada del valor del carro
    if (!form.valor || isNaN(valor) || valor <= 0) {
      errors.valor = 'Ingresa un valor mayor a 0.';
    }
    
    return errors;
  };

  // evento para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // para que no se recargue la pagina
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidated(true);
      showToast('Revisa los campos resaltados en el formulario', 'warning');
      return;
    }

    // creamos un objeto con la informacion del automovil
    const carData = {
      id: selectedCar?.id || crypto.randomUUID(),
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      anio: parseInt(form.anio),
      estado: form.estado,
      pais: form.pais.trim(),
      valor: parseFloat(form.valor),
      descripcion: form.descripcion.trim(),
      imagen: form.imagen
    };

    // creamos bloques para capturar posibles excepciones
    try {
      // validamos la opcion a hacer si es actualizacion o creacion
      if (selectedCar) {
        updateCar(carData);
        showToast('Automóvil actualizado exitosamente', 'success');
      } else {
        addCar(carData);
        showToast('Automóvil registrado exitosamente', 'success');
      }
      
     // cerramos el modal despues de hacer la operacion
      handleClose();
    } catch (error) {
      showToast('Error al guardar: ' + error.message, 'danger');
    }
  };

  // funcion que se encarga de cerrar el modal del formulario
  const handleClose = () => {
    setIsVisible(false);
    document.body.classList.remove('modal-open');
    
    setTimeout(() => {
      dispatch({ type: 'TOGGLE_FORM', payload: null });
    }, 300);
  };

  if (!showForm) return null;

  return (
    <>
      <div 
        className={`modal-backdrop fade ${isVisible ? 'show' : ''}`} 
        style={{ display: isVisible ? 'block' : 'none' }}
        onClick={handleClose}
      />
      
      <div 
        className={`modal fade ${isVisible ? 'show' : ''}`} 
        style={{ display: isVisible ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedCar ? 'Editar automóvil' : 'Nuevo automóvil'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Cerrar"
                onClick={handleClose}
              />
            </div>
            
            <form onSubmit={handleSubmit} noValidate className={validated ? 'was-validated' : ''}>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Marca del automovil, y agregamos datalist para sugerencias. */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="marca">
                      Marca *
                    </label>
                    <input 
                      className="form-control" 
                      id="marca" 
                      value={form.marca}
                      onChange={handleChange}
                      required 
                      maxLength="40" 
                      autoComplete="off"
                      list="marcas-list"
                      placeholder="Ej: Toyota, Ford, BMW..."
                    />
                    <datalist id="marcas-list">
                      {marcas.map((marca, index) => (
                        <option key={index} value={marca} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">Ingresa una marca válida.</div>
                  </div>

  
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="modelo">
                      Modelo *
                    </label>
                    <input 
                      className="form-control" 
                      id="modelo" 
                      value={form.modelo}
                      onChange={handleChange}
                      required 
                      maxLength="40"
                      placeholder="Ej: Corolla, Mustang..."
                    />
                    <div className="invalid-feedback">Ingresa un modelo.</div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="anio">
                      Año *
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="anio" 
                      value={form.anio}
                      onChange={handleChange}
                      min="1886" 
                      max="2030" 
                      required 
                      placeholder="Ej: 2020"
                    />
                    <div className="invalid-feedback">Año entre 1886 y 2030.</div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="estado">
                      Estado *
                    </label>
                    <select 
                      className="form-select" 
                      id="estado" 
                      value={form.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option>Restaurado</option>
                      <option>Original</option>
                      <option>En restauración</option>
                      <option>Para piezas</option>
                      <option>Subasta</option>
                    </select>
                    <div className="invalid-feedback">Selecciona un estado.</div>
                  </div>

                  {/* Valor estimado en USD; debe ser mayor a cero. */}
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="valor">
                      Valor estimado (USD) *
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="valor" 
                      value={form.valor}
                      onChange={handleChange}
                      min="1" 
                      step="100" 
                      required 
                      placeholder="Ej: 50000"
                    />
                    <div className="invalid-feedback">Ingresa un valor mayor a 0.</div>
                  </div>

                  {/* ubiacion del automovil con sugerencias precargadas. */}
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="pais">
                      País / ubicación *
                    </label>
                    <input 
                      className="form-control" 
                      id="pais" 
                      value={form.pais}
                      onChange={handleChange}
                      required 
                      maxLength="60" 
                      autoComplete="off"
                      list="paises-list"
                      placeholder="Ej: España, México, Argentina..."
                    />
                    <datalist id="paises-list">
                      {paises.map((pais, index) => (
                        <option key={index} value={pais} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">Ingresa el país o ubicación.</div>
                    {form.pais && paises.length > 0 && (
                      <div className="form-text">
                        <i className="bi bi-check-circle text-success"></i>{' '}
                        {paises.includes(form.pais) 
                          ? 'País reconocido' 
                          : 'País personalizado (no está en la lista)'}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="descripcion">
                      Descripción
                    </label>
                    <textarea 
                      className="form-control" 
                      id="descripcion" 
                      value={form.descripcion}
                      onChange={handleChange}
                      rows="3" 
                      maxLength="400" 
                      placeholder="Detalles del vehículo, historia, motor, etc."
                    />
                    <div className="form-text">
                      {form.descripcion.length}/400 caracteres
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="imagen">
                      <i className="bi bi-image"></i> Imagen
                      
                    </label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="imagen" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <div className="invalid-feedback">Selecciona una imagen válida (JPG, PNG, WEBP).</div>
                    
                    {/* vista previa de la imagen cuando de haya cargado */}
                    {imagePreview && (
                      <div className="mt-2 text-center">
                        <img 
                          src={imagePreview} 
                          className="img-thumbnail" 
                          alt="Vista previa" 
                          style={{ maxHeight: '200px' }}
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger mt-2"
                          onClick={handleRemoveImage}
                        >
                          <i className="bi bi-x-circle"></i> Quitar imagen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check2"></i> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarForm;
