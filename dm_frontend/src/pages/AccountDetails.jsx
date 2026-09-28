
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AccountDetails.css";

function AccountDetails() {

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");


    const getUserDetails = async () => {
        try {

            const response = await axios.get(
                "http://localhost:3000/api/auth/me",
                {
                    withCredentials: true
                }
            );

            const currentUser = response.data.user;

            setUser(currentUser);
            setName(currentUser.name);
            setEmail(currentUser.email);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                window.location.href = "/login";
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Failed to load account details."
            );
        }
    };


    const handleEdit = () => {
        setIsEditing(true);
    };


    const handleSaveChanges = async () => {

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        if (!email.trim()) {
            toast.error("Email cannot be empty.");
            return;
        }

        try {

            const response = await axios.patch(
                "http://localhost:3000/api/auth/update-details",
                {
                    name: name.trim(),
                    email: email.trim()
                },
                {
                    withCredentials: true
                }
            );

            const updatedUser = response.data.user;

            setUser(updatedUser);
            setName(updatedUser.name);
            setEmail(updatedUser.email);

            setIsEditing(false);

            toast.success("Account details updated.");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                window.location.href = "/login";
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Failed to update account details."
            );
        }
    };


    const handleChangePassword = () => {
        setShowPassword(!showPassword);

        if (showPassword) {
            setNewPassword("");
        }
    };


    const handleSavePassword = async () => {

        if (!newPassword.trim()) {
            toast.error("Password cannot be empty.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {

            await axios.patch(
                "http://localhost:3000/api/auth/change-password",
                {
                    password: newPassword
                },
                {
                    withCredentials: true
                }
            );

            setNewPassword("");
            setShowPassword(false);

            toast.success("Password changed successfully.");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                window.location.href = "/login";
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Failed to change password."
            );
        }
    };


    useEffect(() => {
        getUserDetails();
    }, []);


    return (
        <div className="body-container ac-detail-adjustment">

            <div className="details-container">

                <h4 className="h4 ac-title">
                    Account Details
                </h4>


                <div className="fields-and-buttons">

                    <div className="field">

                        <h6 className="h6 account-field-title">
                            Name
                            {isEditing && (
                                <span className="required-asterisk"> *</span>
                            )}
                        </h6>

                        {isEditing ? (
                            <input
                                className="account-detail-input"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        ) : (
                            <div className="account-detail-display">
                                {user.name}
                            </div>
                        )}

                    </div>


                    <div className="field">

                        <h6 className="h6 account-field-title">
                            Email
                            {isEditing && (
                                <span className="required-asterisk"> *</span>
                            )}
                        </h6>

                        {isEditing ? (
                            <input
                                className="account-detail-input"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        ) : (
                            <div className="account-detail-display">
                                {user.email}
                            </div>
                        )}

                    </div>


                    <div className="account-details-buttons">

                        <button
                            className="primary-button"
                            type="button"
                            onClick={
                                isEditing
                                    ? handleSaveChanges
                                    : handleEdit
                            }
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Edit"
                            }
                        </button>


                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleChangePassword}
                        >
                            {showPassword
                                ? "Cancel"
                                : "Change Password"
                            }
                        </button>

                    </div>


                    {showPassword && (
                        <div className="password-section">

                            <div className="field">

                                <h6 className="h6 account-field-title">
                                    New Password
                                    <span className="required-asterisk"> *</span>
                                </h6>

                                <input
                                    className="account-detail-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    required
                                />

                            </div>


                            <button
                                className="primary-button save-password-button"
                                type="button"
                                onClick={handleSavePassword}
                            >
                                Save Password
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default AccountDetails;

