import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5001";

function TagDetails() {
    const { tagId } = useParams();
    const navigate = useNavigate();

    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTag();
    }, [tagId]);

    const fetchTag = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tags/${tagId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch tag");
            }

            setTag(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async () => {
        try {
            const token = localStorage.getItem("token");

            const newStatus =
                tag.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

            const response = await fetch(
                `${API_URL}/api/tags/${tagId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update status");
            }

            setTag(data.tag);
        } catch (error) {
            setError(error.message);
        }
    };

    const updateEmergency = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tags/${tagId}/emergency`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        emergencyEnabled: !tag.emergencyEnabled
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update emergency setting"
                );
            }

            setTag(data.tag);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteTag = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${tagId}?`
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tags/${tagId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete tag");
            }

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading tag...</p>;
    }

    if (error && !tag) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>

            <h1>{tag.tagId}</h1>

            <p>Type: {tag.type}</p>
            <p>Status: {tag.status}</p>

            <p>
                Emergency:{" "}
                {tag.emergencyEnabled ? "Enabled" : "Disabled"}
            </p>

            {error && <p>{error}</p>}

            <hr />

            <h2>Tag Controls</h2>

            <button onClick={updateStatus}>
                {tag.status === "ACTIVE"
                    ? "Deactivate Tag"
                    : "Activate Tag"}
            </button>

            <button onClick={updateEmergency}>
                {tag.emergencyEnabled
                    ? "Disable Emergency Access"
                    : "Enable Emergency Access"}
            </button>

            <button onClick={() => navigate(`/resources/${tagId}`)}>
                Manage Resources
            </button>

            <button onClick={() => navigate(`/policies/${tagId}`)}>
                Manage Policies
            </button>

            <button onClick={deleteTag}>
                Delete Tag
            </button>
        </div>
    );
}

export default TagDetails;