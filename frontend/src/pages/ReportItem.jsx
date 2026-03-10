import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import "../Report.css";

function ReportItem() {

  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    type: "lost",
    itemName: "",
    category: "",
    description: "",
    color: "",
    brand: "",
    location: "",
    building: "",
    date: "",
    time: "",
    phone: "",
    reward: "",
    notes: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
  
      const res = await fetch("http://localhost:5000/api/items/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("Item reported successfully");
      } else {
        toast.error(data.message);
      }
  
    } catch (error) {
      toast.error("Server error");
    }
  };
  return (
    <div className="report-container">

      <div className="report-card">

        <h2>Report Lost / Found Item</h2>
        <p className="subtitle">
          Provide details about the item to help others identify it.
        </p>

        <form onSubmit={handleSubmit} className="report-form">

          {/* Item Type */}
          <div className="form-group">
            <label>Item Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="lost">Lost Item</option>
              <option value="found">Found Item</option>
            </select>
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="itemName"
              placeholder="Wallet, Phone, Keys..."
              value={formData.itemName}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option>Electronics</option>
              <option>ID Card</option>
              <option>Bag</option>
              <option>Keys</option>
              <option>Clothing</option>
              <option>Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the item..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Color */}
          <div className="form-group">
            <label>Color</label>
            <input
              type="text"
              name="color"
              placeholder="Black, Blue..."
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          {/* Brand */}
          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="Apple, Nike..."
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Library, Hostel..."
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Building */}
          <div className="form-group">
            <label>Building / Area</label>
            <input
              type="text"
              name="building"
              placeholder="Block A, Cafeteria..."
              value={formData.building}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label>Approximate Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Upload Image</label>
            <input type="file" onChange={handleImageChange} />
          </div>

          {/* Contact Info */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Phone (Optional)</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Reward */}
          <div className="form-group">
            <label>Reward (Optional)</label>
            <input
              type="text"
              name="reward"
              placeholder="₹ Amount"
              value={formData.reward}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              placeholder="Any extra details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="report-btn">
            Submit Report
          </button>

        </form>
      </div>
    </div>
  );
}

export default ReportItem;