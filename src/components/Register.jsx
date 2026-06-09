import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from '../services/auth';


function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, variant = 'success') => {
        setToast({ message, variant });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = getCookie('users') || [];

        const exists = users.some(
            user => user.email === email
        );

        if (exists) {
            showToast('Correo ingresado ya se encuentra en uso', 'danger');
            return;
        }

        users.push({
            id: Date.now(),
            name,
            email,
            password
        });

        setCookie('users', users);

        showToast('Usuario Registrado', 'success');


        setTimeout(() => {
            navigate('/login');
        }, 3000);

    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light"
            style={{
                backgroundImage: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

                        {/* Tarjeta Contenedora Principal */}
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                            <div className="card-body p-4 p-sm-5">

                                {/* Cabecera del Registro */}
                                <div className="text-center mb-4">
                                    <div className="bg-primary bg-gradient text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-person-plus-fill fs-3"></i>
                                    </div>
                                    <h3 className="fw-bold text-dark mb-1">Crea tu cuenta</h3>
                                    <p className="text-muted small">Empieza a organizar tu colección de automóviles</p>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit} autoComplete="off">

                                    {/* Campo Nombre */}
                                    <div className="mb-3">
                                        <label className="form-label text-secondary small fw-semibold">Nombre Completo</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted border-end-0">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-light border-start-0 ps-0"
                                                placeholder="Tu nombre"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Campo Email */}
                                    <div className="mb-3">
                                        <label className="form-label text-secondary small fw-semibold">Correo Electrónico</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted border-end-0">
                                                <i className="bi bi-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control bg-light border-start-0 ps-0"
                                                placeholder="ejemplo@correo.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Campo Contraseña */}
                                    <div className="mb-4">
                                        <label className="form-label text-secondary small fw-semibold">Contraseña</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light text-muted border-end-0">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control bg-light border-start-0 ps-0"
                                                placeholder="Crea una contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Botón de Registro */}
                                    <button
                                        className="btn btn-primary w-100 py-2.5 rounded-3 fw-medium text-white shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                                        type="submit"
                                    >
                                        <span>Registrar cuenta</span>
                                        <i className="bi bi-check-circle-fill small"></i>
                                    </button>
                                </form>

                                {/* Opciones del Pie */}
                                <hr className="text-muted my-4 opacity-25" />

                                <div className="text-center">
                                    <span className="text-muted small">¿Ya tienes una cuenta? </span>
                                    <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
                                        Inicia sesión aquí
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {toast && (
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 9999 }}
                >
                    <div
                        className="d-flex align-items-center gap-3 shadow-lg"
                        style={{
                            minWidth: '320px',
                            maxWidth: '420px',
                            padding: '1rem 1.25rem',
                            borderRadius: '16px',
                            backdropFilter: 'blur(12px)',
                            background: 'rgba(255,255,255,.95)',
                            border: '1px solid rgba(0,0,0,.08)'
                        }}
                    >
                        <div>
                            {toast.variant === 'success' && (
                                <i className="bi bi-check-circle-fill text-success fs-4"></i>
                            )}

                            {toast.variant === 'danger' && (
                                <i className="bi bi-x-circle-fill text-danger fs-4"></i>
                            )}

                            {toast.variant === 'warning' && (
                                <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
                            )}
                        </div>

                        <div className="flex-grow-1">
                            <div className="fw-semibold">
                                Notificación
                            </div>

                            <small className="text-muted">
                                {toast.message}
                            </small>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setToast(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;