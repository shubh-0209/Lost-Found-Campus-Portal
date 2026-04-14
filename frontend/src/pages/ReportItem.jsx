import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import "../Report.css";

const CATEGORY_FIELDS = {
  "Currency/Notes": [
    { name: "amount", label: "Amount (₹)", type: "number" },
    { name: "currencyType", label: "Currency Type", type: "text" },
    { name: "whereFound", label: "Where Found", type: "text" },
  ],
  Electronics: [
    { name: "brand", label: "Brand", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
  Bag: [
    { name: "brand", label: "Brand", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
  Clothing: [
    { name: "brand", label: "Brand", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
  Keys: [
    { name: "keyType", label: "Key Type", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
  Other: [
    { name: "brand", label: "Brand", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
};

function ReportItem() {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    date: "",
    image: null,
  });
  const [attributes, setAttributes] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAttributeChange = (e) => {
    setAttributes((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    const fields = CATEGORY_FIELDS[selected] || [];
    const reset = {};
    fields.forEach((f) => (reset[f.name] = ""));
    setAttributes(reset);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // 2. Security Check: Ensure token exists
    if (!storedUser || !storedUser.token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      const data = new FormData();
      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("date", formData.date);
      data.append("category", category);
      data.append("attributes", JSON.stringify(attributes));
      data.append("image", formData.image);

      const res = await fetch("http://localhost:5000/api/items/report", {
        method: "POST",
        headers: {
          // 🔥 Ensure exactly this format: "Bearer [token]"
          "Authorization": `Bearer ${storedUser.token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Item reported successfully ✅");
        // Reset form
        setFormData({ itemName: "", description: "", location: "", date: "", image: null });
        setAttributes({});
        setCategory("");
      } else {
        toast.error(result.message || "Unauthorized: Please log in again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h2>Report Found Item</h2>
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input name="itemName" value={formData.itemName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={category} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {Object.keys(CATEGORY_FIELDS).map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          {CATEGORY_FIELDS[category]?.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label} *</label>
              <input type={field.type} name={field.name} value={attributes[field.name] || ""} onChange={handleAttributeChange} required />
            </div>
          ))}
          <div className="form-group">
            <label>Upload Image *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={user?.email || ""} disabled />
          </div>
          <button type="submit" className="report-btn">Submit Report</button>
        </form>
      </div>
    </div>
  );
}

export default ReportItem;