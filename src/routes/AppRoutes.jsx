import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import Login from '../components/Login';
import Register from '../components/Register';
import ProtectedRoute from './ProtectedRoute';

/*
|--------------------------------------------------------------------------
| Lógica de Autenticación
|--------------------------------------------------------------------------
|
| La ruta principal "/" está protegida mediante el componente ProtectedRoute.
|
| ProtectedRoute verifica si existe una sesión activa consultando la cookie "user".
|
| Flujo:
|
| 1. El usuario intenta acceder a "/".
| 2. ProtectedRoute ejecuta la validación:isAuthenticated()
| 3. isAuthenticated() busca la cookie:user
|
| 4. Si la cookie existe: se renderiza <App />.
|
| 5. Si la cookie no existe: se manda al login
|

| se muestra la aplicación principal únicamente cuando existe una sesión válida.
|
*/

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Ruta protegida por sesión donde se maneja la informacion de apliacion */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    }
                />

                {/* Inicio de sesión */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Registro de usuarios */}
                <Route
                    path="/register"
                    element={<Register />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;