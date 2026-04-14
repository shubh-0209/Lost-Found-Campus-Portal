import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import "../Claim.css";

const CATEGORY_FIELDS = {
"Currency/Notes": [
{ name: "amount", label: "Amount (₹)" },
{ name: "currencyType", label: "Currency Type" },
{ name: "whereFound", label: "Where Found" },
],
Electronics: [
{ name: "brand", label: "Brand" },
{ name: "color", label: "Color" },
{ name: "description", label: "Description" },
],
Bag: [
{ name: "brand", label: "Brand" },
{ name: "color", label: "Color" },
{ name: "description", label: "Description" },
],
Clothing: [
{ name: "brand", label: "Brand" },
{ name: "color", label: "Color" },
{ name: "description", label: "Description" },
],
Keys: [
{ name: "keyType", label: "Key Type" },
{ name: "color", label: "Color" },
{ name: "description", label: "Description" },
],
Other: [
{ name: "brand", label: "Brand" },
{ name: "color", label: "Color" },
{ name: "description", label: "Description" },
],
};

const ClaimItem = () => {
const { id } = useParams();
const navigate = useNavigate();
const { user } = useContext(AuthContext);

const [item, setItem] = useState(null);
const [answers, setAnswers] = useState({});
const [loading, setLoading] = useState(false);
const [matchScore, setMatchScore] = useState(null);

// 🔹 Fetch item
useEffect(() => {
const fetchItem = async () => {
try {
const res = await fetch(`http://localhost:5000/api/items/${id}`);


    if (!res.ok) throw new Error("Failed to fetch item");

    const data = await res.json();
    setItem(data);

    const fields = CATEGORY_FIELDS[data.category] || [];
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    initial.extraDetails = "";
    setAnswers(initial);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load item");
  }
};

fetchItem();


}, [id]);

// 🔹 Handle change + match score
const handleChange = (e) => {
const updated = { ...answers, [e.target.name]: e.target.value };
setAnswers(updated);


if (item) {
  let score = 0;
  let total = Object.keys(updated).length;

  Object.keys(updated).forEach((key) => {
    if (
      item[key] &&
      updated[key] &&
      updated[key].toLowerCase() === item[key].toLowerCase()
    ) {
      score++;
    }
  });

  setMatchScore(Math.round((score / total) * 100));
}


};

// 🔹 Submit claim
const handleSubmit = async (e) => {
e.preventDefault();


for (let key in answers) {
  if (!answers[key]) {
    return toast.error(`Please fill ${key}`);
  }
}

try {
  setLoading(true);

  const res = await fetch("http://localhost:5000/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 FIXED
    },
    body: JSON.stringify({
      reportedItemId: item._id,
      answers,
      notes: answers.extraDetails, // 🔥 maps to backend
    }),
  });

  // 🔥 SAFE RESPONSE HANDLING
  if (!res.ok) {
    const text = await res.text();
    console.error("Server response:", text);
    throw new Error("Request failed");
  }

  const data = await res.json();

  toast.success("Claim submitted successfully!");
  navigate("/browse");

} catch (err) {
  console.error(err);
  toast.error("Failed to submit claim");
} finally {
  setLoading(false);
}


};

if (!item) return <div className="loading">Loading...</div>;

const fields = CATEGORY_FIELDS[item.category] || [];

return ( <div className="claim-container"> <div className="claim-card"> <h2>Claim Item</h2> <p className="subtitle">
Fill correct details to verify ownership </p>


    {matchScore !== null && (
      <div className="match-score">
        Match Confidence: <strong>{matchScore}%</strong>
      </div>
    )}

    <form onSubmit={handleSubmit} className="claim-form">

      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label>{field.label} *</label>
          <input
            type="text"
            name={field.name}
            value={answers[field.name] || ""}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="form-group">
        <label>Additional Proof *</label>
        <textarea
          name="extraDetails"
          value={answers.extraDetails || ""}
          placeholder="Describe something only the owner would know..."
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" value={user?.email || ""} disabled />
      </div>

      <button type="submit" disabled={loading} className="claim-btn">
        {loading ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  </div>
</div>


);
};

export default ClaimItem;
