import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import '../css/admin_page.css';

export function AdminPage() {
    const { user } = useAuth();
    const { users, loading, error, createUser, deleteUser } = useUsers();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const isAdmin = Boolean(user && user.role === 'ADMIN');

    if (!isAdmin) {
        return (
            <div className="admin-unauthorized-wrapper">
                <div className="admin-unauthorized-card">
                    <span className="admin-unauthorized-badge">Acceso Restringido</span>
                    <h1 className="admin-unauthorized-title">Permisos insuficientes</h1>
                    <p className="admin-unauthorized-desc">
                        Esta sección está reservada exclusivamente para administradores del sistema TableFlow. Por favor inicia sesión con una cuenta autorizada para continuar.
                    </p>
                    <div className="admin-unauthorized-actions">
                        <Link to="/login" className="admin-btn-link admin-btn-primary">
                            Iniciar Sesión
                        </Link>
                        <Link to="/" className="admin-btn-link admin-btn-secondary">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const validateForm = () => {
        const errors = {};
        const trimmedUser = username.trim();

        if (!trimmedUser) {
            errors.username = 'El nombre de usuario es obligatorio.';
        } else if (trimmedUser.length < 3) {
            errors.username = 'El nombre de usuario debe tener al menos 3 caracteres.';
        }

        if (!password) {
            errors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Debes confirmar la contraseña.';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedbackMessage(null);

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            const result = await createUser({
                username: username.trim(),
                password,
                role: 'ADMIN'
            });

            if (result.success) {
                setFeedbackMessage({
                    type: 'success',
                    text: `Administrador "${username.trim()}" creado correctamente.`
                });
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setFormErrors({});
            } else {
                setFeedbackMessage({
                    type: 'error',
                    text: result.error || 'No se pudo crear el administrador.'
                });
            }
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: 'Ocurrió un error inesperado al procesar la solicitud.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (targetId, targetUsername) => {
        const isSelf = user && (user.id === targetId || user.username === targetUsername);
        if (isSelf) {
            return;
        }

        const confirmed = window.confirm(
            `¿Confirmas que deseas eliminar al usuario "${targetUsername}"? Esta acción no se puede deshacer.`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(targetId);
        setFeedbackMessage(null);
        try {
            const result = await deleteUser(targetId);
            if (result.success) {
                setFeedbackMessage({
                    type: 'success',
                    text: `Usuario "${targetUsername}" eliminado exitosamente.`
                });
            } else {
                setFeedbackMessage({
                    type: 'error',
                    text: result.error || 'No se pudo eliminar el usuario.'
                });
            }
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: 'Ocurrió un error inesperado al eliminar el usuario.'
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-page-container">
            <header className="admin-page-header">
                <h1 className="admin-page-title">Gestión de Administradores</h1>
                <p className="admin-page-subtitle">
                    Administra los accesos privilegiados al panel de control de TableFlow
                </p>
            </header>

            {feedbackMessage && (
                <div
                    className={
                        feedbackMessage.type === 'success'
                            ? 'admin-message-success'
                            : 'admin-message-error'
                    }
                >
                    {feedbackMessage.text}
                </div>
            )}

            <div className="admin-content-grid">
                <section className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Añadir Administrador</h2>
                        <p className="admin-card-subtitle">
                            Registra un nuevo usuario con rol de administrador
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form" noValidate>
                        <div className="admin-form-group">
                            <label htmlFor="admin-username" className="admin-form-label">
                                Nombre de usuario
                            </label>
                            <input
                                id="admin-username"
                                type="text"
                                className={`admin-input ${formErrors.username ? 'input-error' : ''}`}
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (formErrors.username) {
                                        setFormErrors((prev) => ({ ...prev, username: '' }));
                                    }
                                }}
                                placeholder="Ej. admin_eventos"
                                disabled={submitting}
                                autoComplete="off"
                            />
                            {formErrors.username && (
                                <span className="admin-field-error">{formErrors.username}</span>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="admin-password" className="admin-form-label">
                                Contraseña
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                className={`admin-input ${formErrors.password ? 'input-error' : ''}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (formErrors.password) {
                                        setFormErrors((prev) => ({ ...prev, password: '' }));
                                    }
                                }}
                                placeholder="Mínimo 6 caracteres"
                                disabled={submitting}
                                autoComplete="new-password"
                            />
                            {formErrors.password && (
                                <span className="admin-field-error">{formErrors.password}</span>
                            )}
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="admin-confirm-password" className="admin-form-label">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="admin-confirm-password"
                                type="password"
                                className={`admin-input ${formErrors.confirmPassword ? 'input-error' : ''}`}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (formErrors.confirmPassword) {
                                        setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                                    }
                                }}
                                placeholder="Repite la contraseña"
                                disabled={submitting}
                                autoComplete="new-password"
                            />
                            {formErrors.confirmPassword && (
                                <span className="admin-field-error">{formErrors.confirmPassword}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="admin-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Guardando...' : 'Crear Administrador'}
                        </button>
                    </form>
                </section>

                <section className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Usuarios Registrados</h2>
                        <p className="admin-card-subtitle">
                            Listado de administradores y cuentas del sistema
                        </p>
                    </div>

                    {loading && users.length === 0 && (
                        <div className="admin-loading-state">Cargando usuarios...</div>
                    )}

                    {error && users.length === 0 && (
                        <div className="admin-error-state">{error}</div>
                    )}

                    {!loading && users.length === 0 && !error && (
                        <div className="admin-empty-state">No se encontraron usuarios registrados.</div>
                    )}

                    {users.length > 0 && (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Rol</th>
                                        <th className="admin-actions-cell">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => {
                                        const isCurrentUser =
                                            user && (user.id === u.id || user.username === u.username);
                                        const isDeleting = deletingId === u.id;

                                        return (
                                            <tr key={u.id || u.username}>
                                                <td>
                                                    <div className="admin-user-cell">
                                                        <span className="admin-user-name">
                                                            {u.username}
                                                        </span>
                                                        {isCurrentUser && (
                                                            <span className="admin-current-user-tag">
                                                                Sesión actual
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`admin-role-badge ${
                                                            u.role === 'ADMIN'
                                                                ? 'role-admin'
                                                                : 'role-viewer'
                                                        }`}
                                                    >
                                                        {u.role || 'ADMIN'}
                                                    </span>
                                                </td>
                                                <td className="admin-actions-cell">
                                                    <button
                                                        type="button"
                                                        className="admin-delete-btn"
                                                        disabled={isCurrentUser || isDeleting || submitting}
                                                        onClick={() => handleDelete(u.id, u.username)}
                                                        title={
                                                            isCurrentUser
                                                                ? 'No puedes eliminar tu propia cuenta'
                                                                : 'Eliminar usuario'
                                                        }
                                                    >
                                                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminPage;
