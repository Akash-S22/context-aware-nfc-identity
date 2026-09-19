import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001";

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
        <div>
            <h1>Dashboard</h1>

            {user && (
                <div>
                    <p>Welcome, {user.name}</p>
                    <p>{user.email}</p>
                </div>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            <h2>Create NFC Tag</h2>

            <form onSubmit={handleCreateTag}>
                <div>
                    <label>Tag ID</label>
                    <br />
                    <input
                        type="text"
                        value={tagId}
                        onChange={(e) => setTagId(e.target.value)}
                        placeholder="Example: NFC003"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Type</label>
                    <br />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="PERSON">Person</option>
                        <option value="VEHICLE">Vehicle</option>
                        <option value="ASSET">Asset</option>
                        <option value="DOCUMENT">Document</option>
                    </select>
                </div>

                <br />

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Tag"}
                </button>
            </form>

            {createError && <p>{createError}</p>}

            <hr />

            <h2>My NFC Tags</h2>

            {error && <p>{error}</p>}

            {tags.length === 0 ? (
                <p>You don't have any NFC tags yet.</p>
            ) : (
                <div>
                    {tags.map((tag) => (
                        <div key={tag._id}>
                            <h3>{tag.tagId}</h3>

                            <p>Type: {tag.type}</p>
                            <p>Status: {tag.status}</p>

                            <p>
                                Emergency:{" "}
                                {tag.emergencyEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/tags/${tag.tagId}`)
                                }
                            >
                                Manage Tag
                            </button>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;