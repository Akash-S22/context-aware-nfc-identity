import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TagDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

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
    return (
        <div className="tag-loading">
            Loading tag...
        </div>
    );
}

if (error && !tag) {
    return (
        <div className="tag-loading">
            {error}
        </div>
    );
}

return (
    <div className="tag-page">
        <div className="tag-container">

            <div className="tag-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>{tag.tagId}</h1>
                </div>
            </div>

            {error && (
                <div className="tag-error">
                    {error}
                </div>
            )}

            <div className="tag-card">
                <h2>Tag Information</h2>

                <div className="tag-info">

                    <div className="info-item">
                        <span className="info-label">
                            Tag ID
                        </span>
                        <span className="info-value">
                            {tag.tagId}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Type
                        </span>
                        <span className="info-value">
                            {tag.type}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Status
                        </span>
                        <span
                            className={`info-value ${
                                tag.status === "ACTIVE"
                                    ? "status-active"
                                    : "status-inactive"
                            }`}
                        >
                            {tag.status}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Emergency Access
                        </span>

                        <span
                            className={`info-value ${
                                tag.emergencyEnabled
                                    ? "emergency-enabled"
                                    : "emergency-disabled"
                            }`}
                        >
                            {tag.emergencyEnabled
                                ? "Enabled"
                                : "Disabled"}
                        </span>
                    </div>

                </div>
            </div>

            <div className="tag-card">
                <h2>Tag Controls</h2>

                <div className="control-list">

                    <button
                        className="tag-button"
                        onClick={updateStatus}
                    >
                        {tag.status === "ACTIVE"
                            ? "Deactivate Tag"
                            : "Activate Tag"}
                    </button>

                    <button
                        className="tag-button secondary"
                        onClick={updateEmergency}
                    >
                        {tag.emergencyEnabled
                            ? "Disable Emergency Access"
                            : "Enable Emergency Access"}
                    </button>

                </div>
            </div>

            <div className="tag-card">
                <h2>Manage Tag Data</h2>

                <div className="control-list">

                    <button
                        className="tag-button"
                        onClick={() =>
                            navigate(`/resources/${tagId}`)
                        }
                    >
                        Manage Resources
                    </button>

                    <button
                        className="tag-button"
                        onClick={() =>
                            navigate(`/policies/${tagId}`)
                        }
                    >
                        Manage Policies
                    </button>

                </div>
            </div>

            <div className="tag-card">
                <h2>Danger Zone</h2>

                <button
                    className="tag-button danger"
                    onClick={deleteTag}
                >
                    Delete Tag
                </button>
            </div>

        </div>
    </div>
);
}

export default TagDetails;