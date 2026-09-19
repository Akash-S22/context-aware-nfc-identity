import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NfcPage.css";

const API_URL = import.meta.env.VITE_API_URL;

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
    return (
        <div className="nfc-loading">
            Checking NFC tag...
        </div>
    );
}

if (error) {
    return (
        <div className="nfc-page">
            <div className="nfc-card">
                <div className="nfc-icon">NFC</div>
                <h1>Unable to Access Tag</h1>
                <p>{error}</p>
            </div>
        </div>
    );
}

if (tag.status !== "ACTIVE") {
    return (
        <div className="nfc-page">
            <div className="nfc-card">
                <div className="nfc-status inactive">
                    Inactive
                </div>

                <h1>Tag Inactive</h1>

                <p>
                    This NFC tag is currently inactive and
                    cannot be accessed.
                </p>
            </div>
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
    <div className="nfc-page">
        <div className="nfc-card">

            <div className="nfc-icon">
                NFC
            </div>

            <div className="nfc-status active">
                Active Tag
            </div>

            <h1>NFC Tag Detected</h1>

            <p className="nfc-subtitle">
                This tag is connected to a secure digital identity.
            </p>

            <div className="nfc-details">

                <div className="nfc-detail">
                    <span>Tag ID</span>
                    <strong>{tag.tagId}</strong>
                </div>

                <div className="nfc-detail">
                    <span>Type</span>
                    <strong>{tag.type}</strong>
                </div>

            </div>

            <div className="nfc-actions">

                <button
                    className="nfc-primary-button"
                    onClick={handleLogin}
                >
                    Continue with Login
                </button>

                {tag.emergencyEnabled && (
                    <button
                        className="nfc-emergency-button"
                        onClick={handleEmergency}
                    >
                        Emergency Information
                    </button>
                )}

            </div>

            <p className="nfc-footer">
                Secure access is controlled by the tag's
                access policies.
            </p>

        </div>
    </div>
);
}

export default NfcPage;