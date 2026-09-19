import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create tag states
    const [tagId, setTagId] = useState("");
    const [type, setType] = useState("PERSON");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));

        fetchTags();
    }, [navigate]);

    const fetchTags = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/tags`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch tags");
            }

            setTags(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();

        setCreateError("");
        setCreating(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/tags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    tagId,
                    type
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create tag");
            }

            // Add newly created tag to the list
            setTags((prevTags) => [...prevTags, data]);

            // Clear form
            setTagId("");
            setType("PERSON");
        } catch (error) {
            setCreateError(error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
    <div className="dashboard">
        <header className="dashboard-header">
            <div className="dashboard-brand">
                NFC Identity
            </div>

            <div className="dashboard-user">
                {user && (
                    <div className="dashboard-user-info">
                        <p className="dashboard-user-name">
                            {user.name}
                        </p>
                        <p className="dashboard-user-email">
                            {user.email}
                        </p>
                    </div>
                )}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>

        <main className="dashboard-content">
            <h1 className="dashboard-title">
                Welcome back{user ? `, ${user.name}` : ""}
            </h1>

            <p className="dashboard-subtitle">
                Manage your NFC identities and access settings.
            </p>

            <section className="create-section">
                <h2 className="section-title">
                    Create NFC Tag
                </h2>

                <form
                    className="create-form"
                    onSubmit={handleCreateTag}
                >
                    <div className="form-group">
                        <label htmlFor="tagId">
                            Tag ID
                        </label>

                        <input
                            id="tagId"
                            type="text"
                            value={tagId}
                            onChange={(e) =>
                                setTagId(e.target.value)
                            }
                            placeholder="Example: NFC003"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">
                            Type
                        </label>

                        <select
                            id="type"
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                        >
                            <option value="PERSON">
                                Person
                            </option>
                            <option value="VEHICLE">
                                Vehicle
                            </option>
                            <option value="ASSET">
                                Asset
                            </option>
                            <option value="DOCUMENT">
                                Document
                            </option>
                        </select>
                    </div>

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create Tag"}
                    </button>
                </form>

                {createError && (
                    <p className="error-message">
                        {createError}
                    </p>
                )}
            </section>

            <section>
                <div className="tags-header">
                    <h2 className="section-title">
                        My NFC Tags
                    </h2>
                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {tags.length === 0 ? (
                    <div className="empty-state">
                        <p>
                            You don't have any NFC tags yet.
                        </p>
                    </div>
                ) : (
                    <div className="tags-grid">
                        {tags.map((tag) => (
                            <div
                                className="tag-card"
                                key={tag._id}
                            >
                                <div className="tag-card-header">
                                    <div>
                                        <h3 className="tag-id">
                                            {tag.tagId}
                                        </h3>

                                        <p className="tag-type">
                                            {tag.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="tag-info">
                                    <div className="tag-info-row">
                                        <span className="info-label">
                                            Status
                                        </span>

                                        <span className="info-value status">
                                            {tag.status === "ACTIVE" && (
                                                <span className="status-dot" />
                                            )}
                                            {tag.status}
                                        </span>
                                    </div>

                                    <div className="tag-info-row">
                                        <span className="info-label">
                                            Emergency
                                        </span>

                                        <span className="info-value">
                                            {tag.emergencyEnabled
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="manage-button"
                                    onClick={() =>
                                        navigate(
                                            `/tags/${tag.tagId}`
                                        )
                                    }
                                >
                                    Manage Tag
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    </div>
);
}

export default Dashboard;