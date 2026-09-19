import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AccessPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function AccessPage() {
    const { tagId } = useParams();

    const [resources, setResources] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const evaluateAccess = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Authentication required");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/access/evaluate/${tagId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            action: "VIEW"
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.reason || data.message);
                }

                setResources(data.resources);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        evaluateAccess();
    }, [tagId]);

   if (loading) {
    return (
        <div className="access-loading">
            <div className="access-loading-card">
                Checking access...
            </div>
        </div>
    );
}

if (error) {
    return (
        <div className="access-page">
            <div className="access-error-card">

                <div className="access-error-icon">
                    !
                </div>

                <h1>Access Denied</h1>

                <p>{error}</p>

            </div>
        </div>
    );
}

return (
    <div className="access-page">
        <div className="access-container">

            <div className="access-header">

                <div className="access-badge">
                    Authorized
                </div>

                <h1>Authorized Resources</h1>

                <p>
                    You have permission to access the resources
                    associated with this NFC tag.
                </p>

                <div className="access-tag">
                    Tag: <strong>{tagId}</strong>
                </div>

            </div>

            {resources.length === 0 ? (
                <div className="access-empty">
                    <h2>No Resources Available</h2>

                    <p>
                        There are currently no resources available
                        for this tag.
                    </p>
                </div>
            ) : (
                <div className="access-resource-list">

                    {resources.map((resource) => (
                        <div
                            className="access-resource-card"
                            key={resource._id}
                        >
                            <div className="access-resource-header">
                                <div>
                                    <h2>{resource.name}</h2>

                                    <span className="access-resource-type">
                                        {resource.type}
                                    </span>
                                </div>
                            </div>

                            {resource.description && (
                                <p className="access-description">
                                    {resource.description}
                                </p>
                            )}

                            <div className="access-content">
                                {resource.content}
                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    </div>
);
}

export default AccessPage;