
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../App.css";
import "../styles/OwnerModal.css";
function Owners() {
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState([]);
const [selectedOwner, setSelectedOwner] = useState(null);
const [ownerDetails, setOwnerDetails] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://192.168.1.15:8000/api/owner-admin/");
      const result = await response.json();

      if (response.ok && result?.data) {
        const formattedData = result.data.map((item, index) => ({
          id: item.id || index + 1,
          name: item.owner_name || "No Name",
          phone: item.phone || "N/A",
          email: item.email || "N/A",
          property: item.property_name || "Default Property",
          room: item.room || "A-101",
          rent: item.rent || "$1,200",
          checkIn: item.check_in || "Dec 1, 2024",
          status: item.status || "Pending",
          idProof: item.id_proof || "No ID Proof",
          rentalAgreement: item.rental_agreement || "No Agreement",
          photo:
            item.photo ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              item.owner_name || "Tenant"
            )}`,
          emergencyContact:
            item.emergency_contact || "No emergency contact available",
        }));

        setOwners(formattedData);
      } else {
        setOwners([]);
        setError("Failed to fetch tenant data");
        console.log("Error:", result);
      }
    } catch (error) {
      setOwners([]);
      setError("Fetch error. Server not reachable.");
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOwner(null);
    setShowVerification(false);
    setOwnerDetails(null)
  };



const handleView = async (email) => {
  try {
    setDetailsLoading(true);
    setSelectedOwner(email);
    setOwnerDetails(null); // Reset previous details

    const response = await fetch(
      `http://192.168.1.15:8000/api/owner_data/${email}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setOwnerDetails(data);
  } catch (error) {
    console.error("Error fetching owner details:", error);
    setOwnerDetails(null); // Ensure ownerDetails is null on error
  } finally {
    setDetailsLoading(false);
  }
};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ padding: 0 }}>
        <Header />

        <div className="tenants-container" style={{ padding: "30px" }}>
          <div className="tenants-header">
            <div>
              <h2 style={{ color: "#4c1d95" }}>Owners</h2>
              <p style={{ color: "#c084fc", marginBottom: "20px" }}>
                Manage Owners and leases
              </p>
            </div>

            <button className="add-tenant">+ Add Owners</button>
          </div>

          {loading ? (
            <p>Loading Owners...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <table className="owners-table">
  <thead>
    <tr>
      <th>Owner</th>
      <th>Phone</th>
      <th>Email</th>
      <th>Properties</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {owners.length > 0 ? (
      owners.map((owner) => (
        <tr key={owner.id}>
          
          {/* Owner Name */}
          <td className="owner-cell">
            <div className="avatar">
              {owner.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            {owner.name}
          </td>

          {/* Phone */}
          <td>{owner.phone}</td>

          {/* Email */}
          <td>{owner.email}</td>

          {/* Properties */}
          <td>{owner.property}</td>

          {/* Status */}
          <td>
            <span className={`status ${owner.status.toLowerCase()}`}>
              {owner.status}
            </span>
          </td>

          {/* Actions */}
          <td>
            <button className="edit">Edit</button>
            <button className="approve">Approve</button>
            <button className="suspend">Suspend</button>
            <button
  className="view-btn"
  onClick={() => handleView(owner.email)}
>
  View
</button>
          </td>

        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
          No Owners found
        </td>
      </tr>
    )}
  </tbody>
</table>
          )}
        </div>

 {selectedOwner && (
  <div className="modal-overlay" onClick={closeModal}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="modal-header">
        <div className="modal-header-content">
          <h2>Owner Details</h2>
          <span className="modal-subtitle">Complete registration information</span>
        </div>
        <button className="close-btn" onClick={closeModal}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* BODY */}
      <div className="modal-body">
        {detailsLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading owner details...</p>
          </div>
        ) : !ownerDetails ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>Failed to load owner details. Please try again.</p>
            <button onClick={() => handleView(selectedOwner)} className="retry-btn">
              Retry
            </button>
          </div>
        ) : !showVerification ? (
          <div className="details-container">
            {/* OWNER PROFILE CARD */}
            <div className="owner-profile-card">
              <div className="profile-header">
                <div className="profile-image">
                  <img
                    src={ownerDetails?.step1?.owner_img_field || '/default-avatar.png'}
                    alt="owner"
                    onError={(e) => e.target.src = '/default-avatar.png'}
                  />
                  <div className="status-badge">
                    {ownerDetails?.step1?.status}
                  </div>
                </div>
                <div className="profile-info">
                  <h3>{ownerDetails?.step1?.name || 'N/A'}</h3>
                  <div className="contact-info">
                    <div className="info-item">
                      <span className="icon">📧</span>
                      <span>{ownerDetails?.step1?.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📱</span>
                      <span>{ownerDetails?.step1?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROPERTY DETAILS */}
            <div className="property-section">
              <h4 className="section-title">
                <span className="icon">🏢</span>
                Property Information
              </h4>
              <div className="property-card">
                <div className="property-header">
                  <div className="property-type">{ownerDetails?.property_type?.toUpperCase() || 'N/A'}</div>
                  <div className="property-name">
                    {ownerDetails?.step2?.property_details?.hostelName ||
                     ownerDetails?.step2?.property_details?.apartmentName ||
                     ownerDetails?.step2?.property_details?.commercialName ||
                     'N/A'}
                  </div>
                </div>
                <div className="property-details">
                  <div className="detail-row">
                    <span className="label">Location:</span>
                    <span className="value">{ownerDetails?.step2?.property_details?.location || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Facilities:</span>
                    <div className="facilities-chips">
                      {ownerDetails?.step2?.property_details?.facilities?.length > 0 ? 
                        ownerDetails.step2.property_details.facilities.map((f, i) => (
                          <span key={i} className="chip">{f}</span>
                        )) : 
                        <span className="no-facilities">No facilities listed</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BUILDING LAYOUT */}
            <div className="building-section">
              <h4 className="section-title">
                <span className="icon">🏗️</span>
                Building Layout
              </h4>
              <div className="floors-grid">
                {ownerDetails?.step3?.building_layout?.map((floor) => (
                  <div key={floor.floorNo} className="floor-card">
                    <div className="floor-header">
                      <h5>Floor {floor.floorNo}</h5>
                    </div>
                    <div className="floor-content">
                      {floor.rooms?.map((room) => (
                        <div key={room.roomNo} className="room-item">
                          <span className="room-number">Room {room.roomNo}</span>
                          <span className="room-beds">{room.beds || room.sharing} Beds</span>
                        </div>
                      ))}
                      {floor.flats?.map((flat) => (
                        <div key={flat.flatNo} className="room-item">
                          <span className="room-number">Flat {flat.flatNo}</span>
                          <span className="room-beds">{flat.bhk} BHK</span>
                        </div>
                      ))}
                      {floor.sections?.map((section) => (
                        <div key={section.sectionNo} className="room-item">
                          <span className="room-number">Section {section.sectionNo}</span>
                          <span className="room-beds">{section.area_sqft} sqft</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="bank-section">
              <h4 className="section-title">
                <span className="icon">🏦</span>
                Bank Information
              </h4>
              <div className="bank-card">
                <div className="bank-details-grid">
                  <div className="bank-detail-item">
                    <span className="bank-label">Bank Name</span>
                    <span className="bank-value">{ownerDetails?.step2?.bank_details?.bankName || 'N/A'}</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-label">IFSC Code</span>
                    <span className="bank-value">{ownerDetails?.step2?.bank_details?.ifsc || 'N/A'}</span>
                  </div>
                  <div className="bank-detail-item">
                    <span className="bank-label">Account Number</span>
                    <span className="bank-value">****{ownerDetails?.step2?.bank_details?.accountNo?.slice(-4) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
              <button
                className="verification-btn"
                onClick={() => setShowVerification(true)}
              >
                <span className="icon">📄</span>
                View Verification Documents
              </button>
            </div>
          </div>
        ) : (
          <div className="verification-container">
            <button
              className="back-btn"
              onClick={() => setShowVerification(false)}
            >
              ← Back to Details
            </button>

            <div className="verification-content">
              <div className="verification-info">
                <h4>Verification Documents</h4>
                <div className="verification-details">
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{ownerDetails?.step1?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{ownerDetails?.step1?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{ownerDetails?.step1?.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ownership Proof:</span>
                    {ownerDetails?.step2?.property_details?.owner_ship_proof ? (
                      <a
                        href={ownerDetails.step2.property_details.owner_ship_proof}
                        target="_blank"
                        rel="noreferrer"
                        className="document-link"
                      >
                        <span className="icon">📎</span>
                        View Document
                      </a>
                    ) : (
                      <span className="no-document">No document uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="verification-image">
                <img
                  src={ownerDetails?.step1?.owner_img_field || '/default-avatar.png'}
                  alt="owner verification"
                  onError={(e) => e.target.src = '/default-avatar.png'}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="modal-footer">
        <button className="secondary-btn" onClick={closeModal}>
          Close
        </button>
        <button className="primary-btn">
          <span className="icon">💬</span>
          Message Owner
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
export default Owners;


