import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            navigate("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

   return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-brand">
                NFC Identity
            </div>

            <h1 className="auth-title">
                Create account
            </h1>

            <p className="auth-subtitle">
                Create your account to manage NFC identities.
            </p>

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-field">
                    <label htmlFor="register-name">
                        Name
                    </label>

                    <input
                        id="register-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="register-email">
                        Email
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="register-password">
                        Password
                    </label>

                    <input
                        id="register-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

                <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Register"}
                </button>
            </form>

            <p className="auth-footer">
                Already have an account?{" "}
                <button
                    className="auth-link"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </p>
        </div>
    </div>
);
}

export default Register;