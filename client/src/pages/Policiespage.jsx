import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Policies.css";

const API_URL = import.meta.env.VITE_API_URL;

function PoliciesPage() {
    const { tagId } = useParams();
    const navigate = useNavigate();

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        accessScope: "OWNER",
        allowedRoles: [],
        allowedActions: ["VIEW"]
    });

    useEffect(() => {
        fetchPolicies();
    }, [tagId]);

    const fetchPolicies = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/policies`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch policies"
                );
            }

            const tagPolicies = data.filter(
                (policy) => policy.tag?.tagId === tagId
            );

            setPolicies(tagPolicies);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleActionChange = (action) => {
    setFormData((previous) => {
        let actions = [...previous.allowedActions];

        if (actions.includes(action)) {
            // Remove selected action
            actions = actions.filter((item) => item !== action);

            // VIEW is required for EDIT and DOWNLOAD
            if (action === "VIEW") {
                actions = actions.filter(
                    (item) => item !== "EDIT" && item !== "DOWNLOAD"
                );
            }
        } else {
            // Add selected action
            actions.push(action);

            // EDIT and DOWNLOAD require VIEW
            if (
                (action === "EDIT" || action === "DOWNLOAD") &&
                !actions.includes("VIEW")
            ) {
                actions.push("VIEW");
            }
        }

        return {
            ...previous,
            allowedActions: actions
        };
    });
};

    const handleRoleChange = (role) => {
        setFormData((previous) => {
            const roles = previous.allowedRoles.includes(role)
                ? previous.allowedRoles.filter(
                      (item) => item !== role
                  )
                : [...previous.allowedRoles, role];

            return {
                ...previous,
                allowedRoles: roles
            };
        });
    };

    const handleScopeChange = (e) => {
        const scope = e.target.value;

        setFormData((previous) => ({
            ...previous,
            accessScope: scope,
            allowedRoles:
                scope === "OWNER"
                    ? []
                    : previous.allowedRoles
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            accessScope: "OWNER",
            allowedRoles: [],
            allowedActions: ["VIEW"]
        });

        setEditingId(null);
        setShowForm(false);
    };

    const startEditing = (policy) => {
        setFormData({
            name: policy.name,
            accessScope: policy.accessScope,
            allowedRoles: policy.allowedRoles || [],
            allowedActions: policy.allowedActions || ["VIEW"]
        });

        setEditingId(policy._id);
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const url = editingId
                ? `${API_URL}/api/policies/${editingId}`
                : `${API_URL}/api/policies`;

            const method = editingId ? "PATCH" : "POST";

            const body = editingId
                ? formData
                : {
                      tagId,
                      ...formData
                  };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        (editingId
                            ? "Failed to update policy"
                            : "Failed to create policy")
                );
            }

            resetForm();
            fetchPolicies();
        } catch (error) {
            setError(error.message);
        }
    };

    const togglePolicyStatus = async (policy) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/policies/${policy._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        enabled: !policy.enabled
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update policy status"
                );
            }

            fetchPolicies();
        } catch (error) {
            setError(error.message);
        }
    };

    const deletePolicy = async (policyId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this policy?"
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/policies/${policyId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete policy"
                );
            }

            fetchPolicies();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
    return (
        <div className="policies-loading">
            Loading policies...
        </div>
    );
}

return (
    <div className="policies-page">
        <div className="policies-container">

            <div className="policies-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate(`/tags/${tagId}`)}
                    >
                        ← Back to Tag
                    </button>

                    <h1>Access Policies</h1>

                    <p className="policies-tag">
                        Tag: {tagId}
                    </p>
                </div>

                <button
                    className="add-policy-button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? "Cancel" : "+ Add Policy"}
                </button>
            </div>

            {error && (
                <div className="policy-error">
                    {error}
                </div>
            )}

            {showForm && (
                <form
                    className="policy-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingId
                            ? "Edit Policy"
                            : "Create Policy"}
                    </h2>

                    <div className="form-group">
                        <label>Policy Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: Owner Access"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Access Scope</label>

                        <select
                            value={formData.accessScope}
                            onChange={handleScopeChange}
                        >
                            <option value="OWNER">
                                Owner
                            </option>

                            <option value="ROLE">
                                Role
                            </option>
                        </select>
                    </div>

                    {formData.accessScope === "ROLE" && (
                        <div className="form-group">
                            <span className="form-label">
                                Allowed Roles
                            </span>

                            <div className="checkbox-group">

                                <label className="checkbox-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowedRoles.includes(
                                            "USER"
                                        )}
                                        onChange={() =>
                                            handleRoleChange("USER")
                                        }
                                    />
                                    USER
                                </label>

                                <label className="checkbox-option">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowedRoles.includes(
                                            "ADMIN"
                                        )}
                                        onChange={() =>
                                            handleRoleChange("ADMIN")
                                        }
                                    />
                                    ADMIN
                                </label>

                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <span className="form-label">
                            Allowed Actions
                        </span>

                        <div className="checkbox-group">

                            {["VIEW", "DOWNLOAD", "EDIT"].map(
                                (action) => (
                                    <label
                                        className="checkbox-option"
                                        key={action}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.allowedActions.includes(
                                                action
                                            )}
                                            onChange={() =>
                                                handleActionChange(
                                                    action
                                                )
                                            }
                                        />

                                        {action}
                                    </label>
                                )
                            )}

                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingId
                                ? "Update Policy"
                                : "Create Policy"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="policy-section">
                <h2>Policies for {tagId}</h2>

                {policies.length === 0 ? (
                    <p className="empty-policies">
                        No policies found for this tag.
                    </p>
                ) : (
                    <div className="policy-list">

                        {policies.map((policy) => (
                            <div
                                className="policy-item"
                                key={policy._id}
                            >
                                <h3>{policy.name}</h3>

                                <p className="policy-detail">
                                    <strong>Scope:</strong>{" "}
                                    {policy.accessScope}
                                </p>

                                <p className="policy-detail">
                                    <strong>Roles:</strong>{" "}
                                    {policy.allowedRoles.length > 0
                                        ? policy.allowedRoles.join(", ")
                                        : "None"}
                                </p>

                                <p className="policy-detail">
                                    <strong>Actions:</strong>{" "}
                                    {policy.allowedActions.join(", ")}
                                </p>

                                <p className="policy-detail">
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={
                                            policy.enabled
                                                ? "policy-status-enabled"
                                                : "policy-status-disabled"
                                        }
                                    >
                                        {policy.enabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </span>
                                </p>

                                <div className="policy-actions">

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            startEditing(policy)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            togglePolicyStatus(policy)
                                        }
                                    >
                                        {policy.enabled
                                            ? "Disable"
                                            : "Enable"}
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            deletePolicy(policy._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

        </div>
    </div>
);
}

export default PoliciesPage;