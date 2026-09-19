import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Resources.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResourcesPage() {
    const { tagId } = useParams();
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        type: "PROFILE",
        description: "",
        content: ""
    });

    useEffect(() => {
        fetchResources();
    }, [tagId]);

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/resources`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch resources"
                );
            }

            const tagResources = data.filter(
                (resource) => resource.tag?.tagId === tagId
            );

            setResources(tagResources);
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

    const resetForm = () => {
        setFormData({
            name: "",
            type: "PROFILE",
            description: "",
            content: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const url = editingId
                ? `${API_URL}/api/resources/${editingId}`
                : `${API_URL}/api/resources`;

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
                            ? "Failed to update resource"
                            : "Failed to create resource")
                );
            }

            resetForm();
            fetchResources();
        } catch (error) {
            setError(error.message);
        }
    };

    const startEditing = (resource) => {
        setFormData({
            name: resource.name,
            type: resource.type,
            description: resource.description || "",
            content: resource.content || ""
        });

        setEditingId(resource._id);
        setShowForm(true);
        setError("");
    };

    const toggleResourceStatus = async (resource) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/resources/${resource._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        active: !resource.active
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update resource status"
                );
            }

            fetchResources();
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteResource = async (resourceId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/resources/${resourceId}`,
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
                    data.message || "Failed to delete resource"
                );
            }

            fetchResources();
        } catch (error) {
            setError(error.message);
        }
    };

   if (loading) {
    return (
        <div className="resources-loading">
            Loading resources...
        </div>
    );
}

return (
    <div className="resources-page">
        <div className="resources-container">

            <div className="resources-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate(`/tags/${tagId}`)}
                    >
                        ← Back to Tag
                    </button>

                    <h1>Resources</h1>

                    <p className="resources-tag">
                        Tag: {tagId}
                    </p>
                </div>

                <button
                    className="add-resource-button"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? "Cancel" : "+ Add Resource"}
                </button>
            </div>

            {error && (
                <div className="resource-error">
                    {error}
                </div>
            )}

            {showForm && (
                <form
                    className="resource-form"
                    onSubmit={handleSubmit}
                >
                    <h2>
                        {editingId
                            ? "Edit Resource"
                            : "Add Resource"}
                    </h2>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: Vehicle Registration"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Type</label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="PROFILE">
                                Profile
                            </option>

                            <option value="DOCUMENT">
                                Document
                            </option>

                            <option value="SERVICE">
                                Service
                            </option>

                            <option value="EMERGENCY">
                                Emergency
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe this resource"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>

                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Enter the information associated with this resource"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {editingId
                                ? "Update Resource"
                                : "Create Resource"}
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

            <div className="resource-card">
                <h2>Resources for {tagId}</h2>

                {resources.length === 0 ? (
                    <p className="empty-resources">
                        No resources found for this tag.
                    </p>
                ) : (
                    <div className="resource-list">

                        {resources.map((resource) => (
                            <div
                                className="resource-item"
                                key={resource._id}
                            >
                                <div className="resource-item-header">
                                    <div>
                                        <h3>{resource.name}</h3>

                                        <p className="resource-type">
                                            {resource.type}
                                        </p>
                                    </div>
                                </div>

                                {resource.description && (
                                    <p className="resource-description">
                                        {resource.description}
                                    </p>
                                )}

                                <div className="resource-content">
                                    {resource.content}
                                </div>

                                <p
                                    className={`resource-status ${
                                        resource.active
                                            ? "status-active"
                                            : "status-inactive"
                                    }`}
                                >
                                    {resource.active
                                        ? "Active"
                                        : "Inactive"}
                                </p>

                                <div className="resource-actions">

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            startEditing(resource)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            toggleResourceStatus(
                                                resource
                                            )
                                        }
                                    >
                                        {resource.active
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            deleteResource(
                                                resource._id
                                            )
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

export default ResourcesPage;