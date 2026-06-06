import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { loadCars, saveCars } from '../services/storage';
import { computeMetrics } from '../workers/metrics.worker';

// Contexto global que permite compartir el estado de automoviles entre todos los componentes.
const CarContext = createContext();

// Estado inicial de la aplicacion: datos, banderas de interfaz, metricas y tasas de cambio.
const initialState = {
  cars: [],
  loading: true,
  error: null,
  selectedCar: null,
  showForm: false,
  showDetail: false,
  showDelete: false,
  toast: null,
  metrics: {
    total: 0,
    valorTotal: 0,
    promedio: 0,
    porEstado: {},
    anioMasAntiguo: null
  },
  searchTerm: '',
  rates: null,
  ratesBase: 'USD'
};

// Reducer centralizado para actualizar el estado global de forma predecible.
// Cada accion representa una operacion concreta de la aplicacion.
function carReducer(state, action) {
  switch (action.type) {
    case 'SET_CARS':
      return { ...state, cars: action.payload, loading: false };
    case 'ADD_CAR':
      return { ...state, cars: [...state.cars, action.payload] };
    case 'UPDATE_CAR':
      return {
        ...state,
        cars: state.cars.map(car =>
          car.id === action.payload.id ? action.payload : car
        )
      };
    case 'DELETE_CAR':
      return {
        ...state,
        cars: state.cars.filter(car => car.id !== action.payload)
      };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_RATES':
      return { ...state, rates: action.payload.rates, ratesBase: action.payload.base };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'TOGGLE_FORM':
      return {
        ...state,
        showForm: !state.showForm,
        selectedCar: action.payload || null
      };

    case 'TOGGLE_DETAIL':
      return {
        ...state,
        showDetail: !state.showDetail,
        selectedCar: action.payload || null
      };

    case 'TOGGLE_DELETE':
      return {
        ...state,
        showDelete: !state.showDelete,
        selectedCar: action.payload || null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Proveedor principal del contexto. Carga datos persistidos, guarda cambios y expone acciones CRUD.
export function CarProvider({ children }) {
  const [state, dispatch] = useReducer(carReducer, initialState);

  // Carga la coleccion desde localStorage cuando la aplicacion se monta por primera vez.
  useEffect(() => {
    try {
      const cars = loadCars();
      dispatch({ type: 'SET_CARS', payload: cars });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Persiste los automoviles y recalcula metricas cada vez que cambia la coleccion.
  useEffect(() => {
    if (!state.loading) {
      saveCars(state.cars);
      updateMetrics(state.cars);
    }
  }, [state.cars, state.loading]);

  const updateMetrics = useCallback(async (cars) => {
    try {
      const metrics = await computeMetrics(cars);
      dispatch({ type: 'SET_METRICS', payload: metrics });
    } catch (error) {
      console.error('Error computing metrics:', error);
    }
  }, []);

  // Registra un nuevo automovil y notifica al usuario la operacion realizada.
  const addCar = useCallback((car) => {
    dispatch({ type: 'ADD_CAR', payload: car });
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Automóvil registrado exitosamente', variant: 'success' } });
  }, []);

  // Actualiza un automovil existente manteniendo su identificador.
  const updateCar = useCallback((car) => {
    dispatch({ type: 'UPDATE_CAR', payload: car });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Automóvil actualizado exitosamente', variant: 'success' } });
  }, []);

  // Elimina un automovil por id y cierra el modal de confirmacion.
  const deleteCar = useCallback((id) => {
    dispatch({ type: 'DELETE_CAR', payload: id });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Automóvil eliminado correctamente', variant: 'success' } });
    dispatch({ type: 'TOGGLE_DELETE' });
  }, []);

  // Muestra mensajes temporales para informar resultados o advertencias.
  const showToast = useCallback((message, variant = 'primary') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, variant } });
  }, []);

  // Limpia la notificacion activa.
  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  const value = {
    state,
    dispatch,
    addCar,
    updateCar,
    deleteCar,
    showToast,
    hideToast
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
}

// Hook de acceso seguro al contexto. Evita usar el estado fuera del proveedor correspondiente.
export function useCarContext() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
}
