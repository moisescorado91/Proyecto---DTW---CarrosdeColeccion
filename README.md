# Garaje de Coleccion

Proyecto web desarrollado para la asignatura **DTW135 - Desarrollo y tecnicas de aplicaciones web**. La aplicacion permite administrar una coleccion de automoviles, registrar sus datos principales, visualizar metricas generales, consultar ubicaciones en un mapa y conservar la informacion en el navegador.

## Descripcion general

Garaje de Coleccion es una aplicacion SPA construida con React. Su objetivo es ofrecer una interfaz practica para gestionar automoviles de coleccion mediante operaciones CRUD:

- Registrar e iniciar sesion con cuenta de usuario.
- Registrar nuevos automoviles.
- Editar informacion existente.
- Consultar detalles de cada vehiculo.
- Eliminar registros con confirmacion.
- Buscar automoviles por marca, modelo o pais.
- Ver indicadores del inventario en un dashboard.
- Mostrar la ubicacion de los vehiculos en un mapa.
- Guardar la informacion localmente en el navegador.

## Tecnologias utilizadas

### React

React es la tecnologia principal del proyecto. Se utiliza para construir la interfaz mediante componentes reutilizables y manejar el estado visual de la aplicacion.

Uso dentro del proyecto:

- Componentes funcionales con hooks.
- Renderizado declarativo de vistas.
- Manejo de formularios, modales, tabla, dashboard, mapa y notificaciones.
- Uso de `React.StrictMode` en el punto de entrada para ayudar a detectar problemas durante el desarrollo.

Archivos principales:

- `src/main.jsx`
- `src/App.jsx`
- `src/components/`
- `src/context/CarContext.jsx`

### React Router DOM

React Router DOM se utiliza para gestionar la navegacion entre paginas dentro de la SPA sin recargar el navegador.

Uso dentro del proyecto:

- Definicion de rutas en `src/routes/AppRoutes.jsx`.
- Proteccion de rutas privadas mediante `ProtectedRoute`.
- Navegacion programatica con `useNavigate`.
- Enlace entre paginas con `Link`.

Rutas definidas:

| Ruta | Componente | Acceso |
| --- | --- | --- |
| `/` | `App` | Protegida (requiere sesion) |
| `/login` | `Login` | Publica |
| `/register` | `Register` | Publica |

Archivos principales:

- `src/routes/AppRoutes.jsx`
- `src/routes/ProtectedRoute.jsx`

### Vite

Vite se utiliza como herramienta de desarrollo y empaquetado. Permite levantar el proyecto rapidamente, trabajar con recarga en caliente y generar una version optimizada para produccion.

Uso dentro del proyecto:

- Servidor de desarrollo con `npm run dev`.
- Construccion de produccion con `npm run build`.
- Vista previa del build con `npm run preview`.
- Configuracion del plugin oficial de React en `vite.config.js`.

### JavaScript moderno

El proyecto esta escrito en JavaScript moderno usando modulos ES. Se utilizan caracteristicas actuales del lenguaje como:

- `import` y `export`.
- Funciones flecha.
- `async/await`.
- Desestructuracion de objetos.
- `Promise.all`.
- `crypto.randomUUID()` para generar identificadores.
- `Intl.NumberFormat` para formatear valores monetarios.
- `Set`, `map`, `filter`, `reduce` y `sort` para transformar datos.

### JSX

JSX se utiliza para escribir la estructura visual de los componentes dentro de JavaScript. Esto permite combinar logica y marcado de interfaz de forma clara en archivos `.jsx`.

### Bootstrap 5

Bootstrap 5 se usa como framework CSS principal para construir una interfaz responsive y consistente.

Uso dentro del proyecto:

- Navbar.
- Botones.
- Formularios.
- Modales.
- Cards.
- Badges.
- Tablas.
- Grid responsive con `row`, `col`, `container`, `g-*`, etc.
- Toasts y estilos visuales generales.

La importacion de Bootstrap se realiza en `src/main.jsx`:

```js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### Bootstrap Icons

Bootstrap Icons se utiliza para agregar iconos a botones, encabezados, acciones y elementos visuales de la interfaz.

Ejemplos de uso:

- Icono de automovil en la barra de navegacion.
- Iconos de agregar, editar, ver y eliminar.
- Iconos de mapa, dashboard, ubicacion y conversion de moneda.

La libreria se importa en `src/main.jsx`:

```js
import 'bootstrap-icons/font/bootstrap-icons.css';
```

### Leaflet

Leaflet es la libreria utilizada para mostrar mapas interactivos.

Uso dentro del proyecto:

- Renderizado de mapa.
- Marcadores por pais.
- Popups con los automoviles registrados en cada ubicacion.
- Ajuste automatico de la vista del mapa segun los paises registrados.

### React Leaflet

React Leaflet permite usar Leaflet dentro de React mediante componentes.

Componentes utilizados:

- `MapContainer`
- `TileLayer`
- `Marker`
- `Popup`
- `useMap`

El mapa se implementa en:

- `src/components/MapView.jsx`

### OpenStreetMap

OpenStreetMap se utiliza como proveedor de tiles para el mapa. La aplicacion consume la capa visual mediante la URL:

```txt
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Web APIs del navegador

El proyecto aprovecha varias APIs nativas del navegador.

#### localStorage

Se utiliza para guardar la coleccion de automoviles y la lista de usuarios registrados de forma persistente en el navegador.

Archivos relacionados:

- `src/services/storage.js`
- `src/services/auth.js`

Claves utilizadas:

```txt
garage_cars_v1   → coleccion de automoviles
users            → lista de usuarios registrados
```

La lista de usuarios se guarda en `localStorage` en lugar de cookies porque las cookies tienen un limite aproximado de 4 KB, y superarlo causaria que el navegador descarte la cookie completa de forma silenciosa.

#### Cookies

Se utilizan cookies del navegador (`document.cookie`) para gestionar la sesion activa del usuario.

Archivo relacionado:

- `src/services/auth.js`

Nombre de la cookie:

```txt
user   → objeto del usuario autenticado (codificado como JSON)
```

La cookie tiene una duracion de 7 dias. `ProtectedRoute` verifica su existencia para decidir si el usuario puede acceder a la ruta principal.

#### sessionStorage

Se utiliza para recordar la preferencia del tema visual durante la sesion del usuario.

Archivo relacionado:

- `src/hooks/useTheme.js`

Clave utilizada:

```txt
garage_pref_theme
```

#### Geolocation API

Permite solicitar la ubicacion actual del usuario desde el navegador.

Uso dentro del proyecto:

- Boton en la barra de navegacion para pedir ubicacion.
- Muestra latitud y longitud si el usuario concede permiso.
- Informa errores si el navegador no soporta geolocalizacion o si el permiso es rechazado.

Archivo relacionado:

- `src/hooks/useGeolocation.js`

#### FileReader API

Se utiliza para leer imagenes seleccionadas por el usuario desde el formulario.

Archivo relacionado:

- `src/services/imageUtils.js`

#### Canvas API

Se utiliza para redimensionar y comprimir imagenes antes de guardarlas en `localStorage`.

Configuracion aplicada:

- Ancho maximo: `800px`.
- Alto maximo: `600px`.
- Calidad JPEG: `0.75`.
- Peso maximo de entrada: `8 MB`.

### Fetch API

La aplicacion utiliza `fetch` para consumir servicios externos.

APIs consumidas:

- **NHTSA Vehicle API**: obtiene marcas de automoviles.
- **REST Countries API**: obtiene nombres de paises y coordenadas.
- **Open Exchange Rate API publica** (`open.er-api.com`): obtiene tasas de cambio con base USD.

Archivo principal:

- `src/services/api.js`

## Dependencias principales

| Dependencia | Uso |
| --- | --- |
| `react` | Construccion de componentes y manejo de UI |
| `react-dom` | Renderizado de React en el DOM |
| `react-router-dom` | Enrutamiento SPA, rutas protegidas y navegacion programatica |
| `vite` | Servidor de desarrollo y build |
| `@vitejs/plugin-react` | Integracion de React con Vite |
| `bootstrap` | Estilos, grid, modales, botones, cards y layout |
| `bootstrap-icons` | Iconografia de la interfaz |
| `@popperjs/core` | Soporte para componentes interactivos de Bootstrap |
| `leaflet` | Mapas interactivos |
| `react-leaflet` | Integracion de Leaflet con React |
| `eslint` | Analisis estatico del codigo |
| `eslint-plugin-react-hooks` | Reglas para hooks de React |
| `eslint-plugin-react-refresh` | Reglas relacionadas con React Refresh |
| `globals` | Definicion de variables globales para ESLint |

## Estructura del proyecto

```txt
DTW-Project-React/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── CarDetail.jsx
│   │   ├── CarForm.jsx
│   │   ├── CarTable.jsx
│   │   ├── ConfirmDelete.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── MapView.jsx
│   │   ├── Navbar.jsx
│   │   ├── Register.jsx
│   │   └── Toast.jsx
│   ├── context/
│   │   └── CarContext.jsx
│   ├── hooks/
│   │   ├── useGeolocation.js
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── imageUtils.js
│   │   └── storage.js
│   ├── workers/
│   │   └── metrics.worker.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Componentes principales

### `App.jsx`

Componente raiz de la aplicacion. Envuelve la interfaz dentro de `CarProvider` y organiza las secciones principales:

- Navbar.
- Dashboard.
- Mapa.
- Tabla de automoviles.
- Modales.
- Toasts.
- Footer.

### `Navbar.jsx`

Muestra la barra superior de la aplicacion. Incluye:

- Nombre del proyecto.
- Boton para solicitar geolocalizacion.
- Visualizacion de coordenadas.
- Interruptor de tema claro/oscuro.

### `Dashboard.jsx`

Presenta metricas calculadas a partir de los automoviles registrados:

- Total de autos.
- Valor total.
- Valor promedio.
- Automovil mas antiguo.
- Conteo por estado.
- Conversion del valor total a otras monedas.

### `MapView.jsx`

Muestra un mapa interactivo con marcadores por pais. Agrupa automoviles que comparten la misma ubicacion y muestra sus datos en un popup.

### `CarTable.jsx`

Renderiza la tabla principal de automoviles. Incluye:

- Busqueda.
- Imagen miniatura.
- Datos generales.
- Valor estimado.
- Botones para ver, editar y eliminar.

### `CarForm.jsx`

Formulario modal para crear o editar automoviles. Incluye:

- Validaciones de campos.
- Sugerencias de marcas.
- Sugerencias de paises.
- Carga y optimizacion de imagen.
- Modo de creacion y modo de edicion.

### `CarDetail.jsx`

Modal que muestra informacion detallada de un automovil seleccionado.

### `ConfirmDelete.jsx`

Modal de confirmacion antes de eliminar un automovil. Ayuda a evitar eliminaciones accidentales.

### `Toast.jsx`

Sistema de notificaciones temporales para mostrar mensajes de exito, advertencia, informacion o error.

### `Login.jsx`

Pagina de inicio de sesion. Incluye:

- Formulario con campo de correo electronico y contrasena.
- Validacion de credenciales contra la lista de usuarios guardada en `localStorage`.
- Creacion de la cookie de sesion `user` al autenticarse correctamente.
- Redireccion automatica a `/` tras el inicio de sesion.
- Notificacion toast integrada para mostrar errores de autenticacion.
- Enlace a la pagina de registro.

### `Register.jsx`

Pagina de registro de nuevos usuarios. Incluye:

- Formulario con nombre, correo electronico y contrasena.
- Validacion de correo duplicado (normalizado a minusculas).
- Guardado del nuevo usuario en `localStorage`.
- Redireccion automatica a `/login` tras el registro exitoso.
- Notificacion toast integrada para confirmar el registro o mostrar errores.
- Enlace al inicio de sesion.

## Rutas y navegacion

### `AppRoutes.jsx`

Componente raiz del enrutamiento. Envuelve la aplicacion con `BrowserRouter` y define las rutas mediante `Routes` y `Route`:

- `/` — ruta protegida que renderiza `App` solo si existe sesion activa.
- `/login` — pagina publica de inicio de sesion.
- `/register` — pagina publica de registro de cuenta.

### `ProtectedRoute.jsx`

Componente de guardia de ruta. Llama a `isAuthenticated()` del servicio `auth.js` para verificar si existe la cookie `user`. Si la sesion es valida renderiza los hijos; de lo contrario redirige a `/login`.

## Manejo de estado

El estado global se gestiona con:

- `createContext`
- `useContext`
- `useReducer`
- `useCallback`
- `useEffect`

El archivo `src/context/CarContext.jsx` centraliza:

- Lista de automoviles.
- Estado de carga.
- Errores.
- Automovil seleccionado.
- Visibilidad de modales.
- Toast activo.
- Metricas.
- Busqueda.
- Tasas de cambio.

Acciones principales del reducer:

- `SET_CARS`
- `ADD_CAR`
- `UPDATE_CAR`
- `DELETE_CAR`
- `SET_METRICS`
- `SET_SEARCH`
- `SET_RATES`
- `SHOW_TOAST`
- `HIDE_TOAST`
- `TOGGLE_FORM`
- `TOGGLE_DETAIL`
- `TOGGLE_DELETE`
- `SET_ERROR`

## Servicios

### `api.js`

Contiene funciones asincronas para consumir APIs externas:

- `fetchCarMakes()`: obtiene marcas de autos desde la API de NHTSA.
- `fetchCountries()`: obtiene paises desde REST Countries.
- `fetchExchangeRates()`: obtiene tasas de cambio desde `open.er-api.com`.

### `storage.js`

Centraliza la persistencia de datos en `localStorage`:

- `loadCars()`
- `saveCars(cars)`

Tambien maneja errores de almacenamiento, incluyendo exceso de cuota.

### `auth.js`

Centraliza la logica de autenticacion y gestion de usuarios:

- `setCookie(name, value, days)`: crea una cookie con el objeto del usuario autenticado, con expiracion de 7 dias.
- `getCookie(name)`: lee y parsea una cookie del navegador. Devuelve `null` si no existe o contiene JSON invalido.
- `deleteCookie(name)`: elimina una cookie estableciendo su fecha de vencimiento en el pasado.
- `isAuthenticated()`: devuelve `true` si la cookie `user` existe.
- `normalizeEmail(email)`: normaliza el correo a minusculas y sin espacios para comparaciones consistentes.
- `getUsers()`: lee la lista de usuarios desde `localStorage`.
- `saveUsers(users)`: guarda la lista de usuarios en `localStorage`.

### `imageUtils.js`

Procesa imagenes antes de guardarlas:

- Valida que el archivo sea una imagen.
- Verifica el peso maximo.
- Lee el archivo con `FileReader`.
- Redimensiona con `canvas`.
- Convierte la imagen a JPEG comprimido.

## Hooks personalizados

### `useTheme`

Gestiona el tema claro/oscuro usando `sessionStorage` y el atributo `data-bs-theme` de Bootstrap.

### `useGeolocation`

Gestiona la solicitud de ubicacion del usuario con la API de geolocalizacion del navegador.

### `useLocalStorage`

Hook reutilizable para leer y escribir valores en `localStorage`.

## Calculo de metricas

El archivo `src/workers/metrics.worker.js` contiene la funcion `computeMetrics(cars)`, que calcula:

- Total de registros.
- Valor total.
- Valor promedio.
- Conteo por estado.
- Anio mas antiguo.

Aunque el archivo esta ubicado en la carpeta `workers`, actualmente simula un procesamiento asincrono mediante `setTimeout`. Esto ayuda a separar la logica de calculo de metricas de los componentes visuales.

## Funcionalidades principales

### Gestion de automoviles

La aplicacion permite crear, leer, actualizar y eliminar automoviles. Cada registro contiene:

- Marca.
- Modelo.
- Anio.
- Estado.
- Pais o ubicacion.
- Valor estimado en USD.
- Descripcion.
- Imagen opcional.

### Busqueda

La tabla permite buscar registros por:

- Marca.
- Modelo.
- Pais.

La busqueda se optimiza con `useMemo` para recalcular los resultados solo cuando cambia la lista de autos o el termino de busqueda.

### Dashboard

El dashboard muestra indicadores utiles para entender el estado de la coleccion.

### Conversion de monedas

La aplicacion obtiene tasas de cambio y muestra equivalencias del valor total en:

- EUR
- GBP
- JPY
- MXN
- GTQ

### Mapa de ubicaciones

El mapa ubica los automoviles segun el pais ingresado. Para esto obtiene coordenadas desde REST Countries y utiliza marcadores de Leaflet.

### Tema claro/oscuro

El usuario puede alternar entre tema claro y oscuro desde la barra de navegacion. Bootstrap interpreta el tema mediante el atributo:

```html
data-bs-theme
```

### Autenticacion de usuarios

La aplicacion cuenta con un sistema de autenticacion basado en el navegador:

- Los usuarios se registran en `/register` y sus datos se guardan en `localStorage`.
- El inicio de sesion en `/login` verifica las credenciales y crea una cookie de sesion `user` con duracion de 7 dias.
- La ruta principal `/` esta protegida por `ProtectedRoute`, que valida la existencia de la cookie antes de renderizar la aplicacion.
- Si no hay sesion activa, el usuario es redirigido automaticamente a `/login`.

### Notificaciones

Las acciones importantes muestran notificaciones tipo toast:

- Registro exitoso.
- Actualizacion exitosa.
- Eliminacion correcta.
- Imagen cargada.
- Advertencias de validacion.
- Errores de geolocalizacion o almacenamiento.

## Instalacion y ejecucion

### Requisitos previos

Tener instalado:

- Node.js
- npm

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Luego abrir la URL que muestre Vite en la terminal. Normalmente es:

```txt
http://localhost:5173/
```

### Generar build de produccion

```bash
npm run build
```

### Previsualizar build

```bash
npm run preview
```

### Ejecutar ESLint

```bash
npm run lint
```

## Scripts disponibles

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite |
| `npm run build` | Genera la version optimizada para produccion |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## APIs externas utilizadas

| API | Proposito |
| --- | --- |
| NHTSA Vehicle API | Obtener sugerencias de marcas de automoviles |
| REST Countries API | Obtener nombres de paises, traducciones y coordenadas |
| Open ER API | Obtener tasas de cambio con base USD |
| OpenStreetMap | Proveer los mapas base para Leaflet |

## Persistencia de datos

La aplicacion no utiliza una base de datos externa. Los datos se guardan en el navegador:

| Mecanismo | Contenido | Duracion |
| --- | --- | --- |
| `localStorage` (`garage_cars_v1`) | Coleccion de automoviles | Indefinida hasta borrado manual |
| `localStorage` (`users`) | Lista de usuarios registrados | Indefinida hasta borrado manual |
| Cookie (`user`) | Sesion del usuario autenticado | 7 dias |

Consideraciones:

- Los registros permanecen aunque se recargue la pagina.
- Los datos pertenecen al navegador y dispositivo donde se ingresaron.
- Si se limpia el almacenamiento del navegador, se eliminan los registros y los usuarios registrados.
- Si vence la cookie o se elimina, el usuario debera iniciar sesion nuevamente.

## Validaciones

El formulario valida:

- Marca obligatoria.
- Modelo obligatorio.
- Anio entre `1886` y `2030`.
- Estado obligatorio.
- Pais obligatorio.
- Valor numerico mayor o igual a `0`.
- Imagen valida.
- Imagen con peso maximo de `8 MB`.

## Accesibilidad y experiencia de usuario

El proyecto incluye elementos que mejoran la experiencia:

- Botones con titulos descriptivos.
- Modales con cierre por boton, fondo o tecla Escape.
- Mensajes de validacion.
- Feedback visual mediante toasts.
- Diseno responsive con Bootstrap.
- Tema claro/oscuro.
- Tablas adaptables mediante `table-responsive`.

## Configuracion de ESLint

ESLint esta configurado en `eslint.config.js` con:

- Reglas recomendadas de JavaScript.
- Reglas para hooks de React.
- Reglas para React Refresh con Vite.
- Variables globales de navegador.
- Ignora la carpeta `dist`.

## Limitaciones actuales

- La informacion se guarda solo en el navegador, no en una base de datos remota.
- Las APIs externas requieren conexion a internet.
- El calculo de metricas esta separado en un archivo tipo worker, pero actualmente se ejecuta como funcion asincrona simulada.
- Las imagenes se guardan como cadenas Base64 en `localStorage`, por lo que demasiadas imagenes grandes pueden llenar la cuota de almacenamiento.

## Posibles mejoras futuras

- Conectar una base de datos real y mover la autenticacion al servidor.
- Exportar la coleccion a CSV o PDF.
- Implementar filtros avanzados por estado, anio o rango de precio.
- Crear un Web Worker real para metricas.
- Agregar pruebas automatizadas.
- Mejorar el manejo de errores cuando no hay conexion a internet.

## Autor

Proyecto desarrollado por los alumnos del grupo 15:
- Carlos Manuel Solis Flores SF10020
- Moises Isaac Molina Corado MC23152
- German Joel Pérez Aquino PA23060
- Erick Enrique Hernandez Aguillon HA23039

 Para la materia **DTW135 - Desarrollo y tecnicas de aplicaciones web - GT01**.
