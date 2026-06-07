import React, { useEffect } from 'react';
import { useCarContext } from '../context/CarContext';
import { fetchExchangeRates } from '../services/api';

// Panel de resumen de la coleccion.
// Muestra metricas calculadas y equivalencias del valor total en distintas monedas.
function Dashboard() {
  const { state, dispatch } = useCarContext();
  const { metrics, rates, ratesBase } = state;

  useEffect(() => {
    // Al montar el componente se solicitan tasas de cambio para mostrar conversiones.
    loadRates();
  }, []);

  // Carga tasas de cambio desde una API publica y las guarda en el contexto global.
  const loadRates = async () => {
    try {
      const data = await fetchExchangeRates();
      dispatch({ type: 'SET_RATES', payload: data });
    } catch (error) {
      console.warn('No se pudieron cargar tasas de cambio:', error);
    }
  };

  // Formatea valores numericos como moneda USD para mantener consistencia visual.
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Construye la lista de conversiones usando el valor total de la coleccion.
  const getConversionDisplay = (valorTotal) => {
    if (!rates || valorTotal === 0) {
      return <p className="text-muted mb-0">Tasas de cambio no disponibles.</p>;
    }

    const targets = ['EUR', 'GBP', 'JPY', 'MXN', 'GTQ'];
    return (
      <>
        <p className="mb-2 small text-muted">
          Equivalente al valor total ({formatCurrency(valorTotal)}), base {ratesBase}:
        </p>
        <ul className="list-group list-group-flush">
          {targets.map(code => {
            const rate = rates[code];
            if (!rate) return null;
            const converted = valorTotal * rate;
            return (
              <li key={code} className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 bg-transparent">
                <span><i className="bi bi-currency-exchange"></i> {code}</span>
                <strong>{converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  // Genera barras de progreso para representar la distribucion de automoviles por estado.
  const getEstadoBreakdown = () => {
    const entries = Object.entries(metrics.porEstado || {});
    if (entries.length === 0) {
      return <p className="text-muted mb-0">Sin datos</p>;
    }

    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([estado, count]) => {
        const pct = metrics.total ? Math.round((count / metrics.total) * 100) : 0;
        return (
          <div key={estado} className="mb-2">
            <div className="d-flex justify-content-between small">
              <span>{estado}</span>
              <span><strong>{count}</strong> ({pct}%)</span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${pct}%` }}
                aria-valuenow={pct} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        );
      });
  };

  return (
    <section className="mb-4">
      <h2 className="mb-3"><i className="bi bi-speedometer2"></i> Dashboard</h2>

      {/* Tarjetas principales con indicadores generales de la coleccion. */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card stat-card border-primary h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1"><i className="bi bi-collection"></i> Total de autos</h6>
              <h3 className="mb-0">{metrics.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stat-card border-success h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1"><i className="bi bi-cash-stack"></i> Valor total</h6>
              <h3 className="mb-0">{formatCurrency(metrics.valorTotal)}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stat-card border-warning h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1"><i className="bi bi-graph-up"></i> Valor promedio</h6>
              <h3 className="mb-0">{formatCurrency(metrics.promedio)}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stat-card border-info h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1"><i className="bi bi-calendar-event"></i> Más antiguo</h6>
              <h3 className="mb-0">{metrics.anioMasAntiguo || '—'}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones complementarias: desglose por estado y conversion monetaria. */}
      <div className="row g-3 mt-1">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header"><i className="bi bi-pie-chart"></i> Conteo por estado</div>
            <div className="card-body">
              {getEstadoBreakdown()}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <i className="bi bi-currency-exchange"></i> Conversión del valor total
              <small className="text-muted ms-2">(API pública en tiempo real)</small>
            </div>
            <div className="card-body">
              {getConversionDisplay(metrics.valorTotal)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
