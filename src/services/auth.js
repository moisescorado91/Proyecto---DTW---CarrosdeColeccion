
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
            return JSON.parse(decodeURIComponent(value));
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