import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5001";

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
        return <p>Checking access...</p>;
    }

    if (error) {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Authorized Resources</h1>

            {resources.length === 0 ? (
                <p>No resources available.</p>
            ) : (
                resources.map((resource) => (
                    <div key={resource._id}>
                        <h2>{resource.name}</h2>

                        <p>
                            Type: {resource.type}
                        </p>

                        <p>
                            {resource.description}
                        </p>

                        <p>
                            {resource.content}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}

export default AccessPage;