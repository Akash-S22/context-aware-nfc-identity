import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const tagId = params.get("tag");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (tagId) {
                navigate(`/access/${tagId}`);
            } else {
                navigate("/dashboard");
            }

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
                Welcome back
            </h1>

            <p className="auth-subtitle">
                Sign in to manage your NFC identities.
            </p>

            {tagId && (
                <div className="auth-tag-notice">
                    You're accessing NFC tag{" "}
                    <strong>{tagId}</strong>.
                    <br />
                    Sign in to continue.
                </div>
            )}

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-field">
                    <label htmlFor="login-email">
                        Email
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="login-password">
                        Password
                    </label>

                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
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
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>

            <p className="auth-footer">
                Don't have an account?{" "}
                <button
                    className="auth-link"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </p>
        </div>
    </div>
);
}

export default Login;