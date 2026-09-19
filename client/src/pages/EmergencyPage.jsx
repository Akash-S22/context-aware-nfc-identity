import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmergencyPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function EmergencyPage() {
    const { tagId } = useParams();

    const [resources, setResources] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmergencyInfo = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/emergency/${tagId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setResources(data.resources);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmergencyInfo();
    }, [tagId]);

    if (loading) {
    return (
        <div className="emergency-loading">
            Loading emergency information...
        </div>
    );
}

if (error) {
    return (
        <div className="emergency-page">
            <div className="emergency-card unavailable">
                <div className="emergency-icon">
                    !
                </div>

                <h1>Emergency Access Unavailable</h1>

                <p>{error}</p>
            </div>
        </div>
    );
}

return (
    <div className="emergency-page">
        <div className="emergency-container">

            <div className="emergency-header">
                <div className="emergency-icon">
                    !
                </div>

                <h1>Emergency Information</h1>

                <p>
                    This information is available for
                    emergency situations.
                </p>
            </div>

            <div className="emergency-notice">
                <strong>Emergency Access</strong>
                <span>
                    This information is provided without
                    requiring authentication.
                </span>
            </div>

            {resources.length === 0 ? (
                <div className="emergency-card">
                    <h2>No Emergency Information</h2>
                    <p>
                        No emergency information is currently
                        available for this tag.
                    </p>
                </div>
            ) : (
                <div className="emergency-resources">

                    {resources.map((resource) => (
                        <div
                            className="emergency-card"
                            key={resource._id}
                        >
                            <h2>{resource.name}</h2>

                            {resource.description && (
                                <p className="emergency-description">
                                    {resource.description}
                                </p>
                            )}

                            <div className="emergency-content">
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

export default EmergencyPage;