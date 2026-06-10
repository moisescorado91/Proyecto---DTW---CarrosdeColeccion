
// agregamos nueva cookie
export const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie =
        `${name}=${encodeURIComponent(JSON.stringify(value))};` +
        `expires=${date.toUTCString()};path=/`;
};

// obtenemos cookie
export const getCookie = (name) => {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');

        if (key === name) {
            // Si la cookie esta corrupta o no contiene JSON valido devolvemos null
            // en lugar de lanzar una excepcion que romperia el render de la app.
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch {
                return null;
            }
        }
    }

    return null;
};

// eliminamos la cookie 
export const deleteCookie = (name) => {
    document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// validamos si existe cookie de sesion
export const isAuthenticated = () => {
    return !!getCookie('user');
};

// Normaliza el correo para que la comparacion no dependa de mayusculas ni espacios.
export const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const USERS_KEY = 'users';

// La lista de usuarios registrados se guarda en localStorage en lugar de una cookie
// porque las cookies tienen un limite de ~4KB y el navegador descarta en silencio
// la cookie completa al superarlo, lo que haria que se perdieran los registros.
export const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
};

export const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};