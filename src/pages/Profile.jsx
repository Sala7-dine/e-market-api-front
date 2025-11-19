import { useEffect, useState } from "react";
import axios from "../config/axios";
import { Camera } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [message, setMessage] = useState("");

  // Fetch User
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/users/me");
        setUser(res.data);
        setFullName(res.data.fullName);
        setEmail(res.data.email);
        setRole(res.data.role);
        setPreviewImage(res.data.profileImage);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Handle image change preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (newPassword) {
        formData.append("password", newPassword);
        formData.append("currentPassword", currentPassword);
      }

      const res = await axios.patch("/users/me", formData);

      setMessage("Profile updated successfully!");
      setUser(res.data);

      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">Loading profile...</div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F5F0EC] py-12 px-4 flex justify-center">
        <div className="bg-white w-full max-w-5xl p-10 rounded-xl shadow-md border border-gray-200">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            My Profile
          </h1>
          <p className="text-gray-500 mb-8">
            Manage your account information and preferences
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-12">
              {/* Left Side - Profile Image */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <img
                    src={
                      previewImage && previewImage !== ""
                        ? previewImage
                        : "https://via.placeholder.com/160"
                    }
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                    alt="profile"
                  />
                </div>

                <label className="mt-6 cursor-pointer flex items-center justify-center gap-2 border border-gray-300 px-6 py-2.5 rounded-full shadow-sm bg-white hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    Change Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Right Side - Form Fields */}
              <div className="flex-1">
                {/* Account Information */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Account Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6B58] focus:border-transparent outline-none transition-all bg-gray-50"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6B58] focus:border-transparent outline-none transition-all bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                        value={role}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Only administrators can change user roles
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-8 border-gray-200" />

                {/* Change Password */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Change Password
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6B58] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6B58] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6B58] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-lg text-center ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-10 py-3 bg-[#8A6B58] text-white rounded-full shadow-md hover:bg-[#725744] transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
