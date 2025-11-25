import { useEffect, useState } from "react";
import axios from "../config/axios";
import { Camera } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');

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
      {/* Hero Section with Header */}
      <section className="bg-gradient-to-br from-[#E8EEF2] to-[#D5E5F0] relative overflow-visible z-10">
        <Header />
        

        {/* Decorative Elements */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl"></div>
      </section>

      {/* Profile Content */}
      <div className="min-h-screen bg-white py-12 px-4 relative z-0">
        <div className="container mx-auto max-w-6xl">
          
          {/* Tabs Navigation */}
          <div className="flex items-center justify-center gap-8 mb-12 border-b border-gray-200">
            {['account', 'security', 'settings'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 pb-4 transition-colors duration-300 capitalize ${
                  activeTab === tab 
                    ? 'text-gray-900 border-b-2 border-gray-900 font-medium' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab === 'account' ? 'Informations du compte' : tab === 'security' ? 'Sécurité' : 'Paramètres'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Tab Content */}
            <div className="max-w-4xl mx-auto">
              
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="py-4">
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
                          Changer la photo
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
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Informations personnelles
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition-all bg-gray-50"
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition-all bg-gray-50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Rôle
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                            value={role}
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1.5">
                            Seuls les administrateurs peuvent modifier les rôles
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="py-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Changer le mot de passe
                  </h2>

                  <div className="max-w-2xl space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Entrez votre mot de passe actuel"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Entrez votre nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition-all bg-gray-50"
                        placeholder="Confirmez votre nouveau mot de passe"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="py-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Paramètres du compte
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Les paramètres supplémentaires seront disponibles prochainement.
                  </p>
                </div>
              )}

            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-8 p-4 rounded-lg text-center max-w-2xl mx-auto ${
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
                className="px-10 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#ff5252] transition-colors font-medium"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
 
    </>
  );
}
