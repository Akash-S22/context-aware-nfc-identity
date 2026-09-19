import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5001";

function NfcPage() {
    const { tagId } = useParams();
    const navigate = useNavigate();

    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/tags/public/${tagId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setTag(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTag();
    }, [tagId]);

    if (loading) {
        return <p>Loading NFC tag...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (tag.status !== "ACTIVE") {
        return (
            <div>
                <h1>Tag Inactive</h1>
                <p>This NFC tag is currently inactive.</p>
            </div>
        );
    }

    const handleLogin = () => {
        navigate(`/login?tag=${tagId}`);
    };

    const handleEmergency = () => {
        navigate(`/emergency/${tagId}`);
    };

    return (
        <div>
            <h1>NFC Tag Detected</h1>

            <p>Tag ID: {tag.tagId}</p>

            <p>Type: {tag.type}</p>

            <button onClick={handleLogin}>
                Continue with Login
            </button>

            {tag.emergencyEnabled && (
                <button onClick={handleEmergency}>
                    Emergency Information
                </button>
            )}
        </div>
    );
}

export default NfcPage;