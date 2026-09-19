import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5001";

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
        return <p>Loading emergency information...</p>;
    }

    if (error) {
        return (
            <div>
                <h1>Emergency Access Unavailable</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Emergency Information</h1>

            <p>
                This information is available for emergency
                situations.
            </p>

            {resources.map((resource) => (
                <div key={resource._id}>
                    <h2>{resource.name}</h2>

                    <p>
                        {resource.description}
                    </p>

                    <p>
                        {resource.content}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default EmergencyPage;