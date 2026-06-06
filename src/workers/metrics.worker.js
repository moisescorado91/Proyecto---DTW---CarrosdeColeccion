// Calcula las metricas generales de la coleccion de automoviles.
// Se mantiene separado de los componentes para concentrar la logica de agregacion de datos.
export async function computeMetrics(cars) {
  // Simula un procesamiento asincrono similar a un Web Worker.
  return new Promise((resolve) => {
    // setTimeout permite diferir el calculo y devolver siempre una promesa.
    setTimeout(() => {
      const metrics = {
        total: cars.length,
        valorTotal: 0,
        promedio: 0,
        porEstado: {},
        anioMasAntiguo: null
      };

      cars.forEach(car => {
        // Acumula el valor economico total solo cuando el dato es numerico.
        const valor = Number(car.valor);
        if (Number.isFinite(valor)) {
          metrics.valorTotal += valor;
        }

        // Cuenta cuantos automoviles existen por cada estado registrado.
        const estado = car.estado || 'Sin estado';
        metrics.porEstado[estado] = (metrics.porEstado[estado] || 0) + 1;

        // Identifica el anio mas antiguo dentro de la coleccion.
        const anio = Number(car.anio);
        if (Number.isFinite(anio)) {
          if (metrics.anioMasAntiguo === null || anio < metrics.anioMasAntiguo) {
            metrics.anioMasAntiguo = anio;
          }
        }
      });

      // El promedio evita division por cero cuando no hay automoviles registrados.
      metrics.promedio = metrics.total > 0 ? metrics.valorTotal / metrics.total : 0;
      resolve(metrics);
    }, 0);
  });
}
