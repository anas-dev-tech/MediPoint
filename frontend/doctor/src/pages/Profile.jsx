import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { updateMe } from '../api/userAPI';
import { toast } from 'react-toastify';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { assets } from '../assets/assets';

const Profile = () => {
  const { user, getUser, isAuthenticated } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [fullName, setFullName] = useState(user?.user?.full_name || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [about, setAbout] = useState(user?.about || '');
  const [fees, setFees] = useState(user?.fees || '');
  const [addressLine1, setAddressLine1] = useState(user?.user?.address?.line1 || '');
  const [addressLine2, setAddressLine2] = useState(user?.user?.address?.line2 || '');
  const [status, setStatus] = useState(user?.status === 'A');
  const [degreeDocument, setDegreeDocument] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.user?.image || assets.profile_placeholder);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user?.user?.full_name || '');
      setDegree(user?.degree || '');
      setExperience(user?.experience || '');
      setAbout(user?.about || '');
      setFees(user?.fees || '');
      setAddressLine1(user?.user?.address?.line1 || '');
      setAddressLine2(user?.user?.address?.line2 || '');
      setStatus(user?.status === 'A');
      setProfileImage(user?.user?.image || assets.profile_placeholder);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user[full_name]', fullName);
    formData.append('about', about);
    formData.append('fees', fees);
    formData.append('status', status ? 'A' : 'U');
    if (degreeDocument) {
      formData.append('degree_document', degreeDocument);
    }
    if (imageFile) {
      formData.append('user[image]', imageFile);
    }

    try {
      const { data, success } = await updateMe(formData);

      if (success) {
        toast.success(data.message);
        await getUser();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return user && (
    <div className="max-w-md mt-5 lg:max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <div className="flex flex-col gap-6 m-20">
    <div className="w-full lg:w-1/3 flex flex-col items-center">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        {isEdit && (
          <label className="absolute bottom-0 w-full bg-primary/80 text-white text-center py-1 cursor-pointer">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>

    <div className="w-full md:w-2/3">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          {isEdit ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <span className="mt-1 inline p-2 text-lg font-semibold text-gray-900 border border-transparent rounded-md">{fullName}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          {isEdit ? (
            <p className="mt-1 text-sm text-gray-600">Your degree is based on the Degree Document</p>
          ) : (
            <span className="mt-1 p-2 inline text-lg font-semibold text-gray-900 border border-transparent rounded-md">{degree || "Unset"}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          {isEdit ? (
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <span className="mt-1 p-2 inline text-lg font-semibold text-gray-900 border border-transparent rounded-md">{experience}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">About</label>
          {isEdit ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
          ) : (
            <span className="mt-1 p-2 inline text-lg font-semibold text-gray-900 border border-transparent rounded-md">{about}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Appointment Fee</label>
          {isEdit ? (
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <span className="mt-1 inline p-2 text-lg font-semibold text-gray-900 border border-transparent rounded-md">${fees}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 space-y-2">
            {isEdit ? (
              <>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Address Line 1"
                />
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Address Line 2"
                />
              </>
            ) : (
              <>
                <span className="p-2 inline text-lg font-semibold text-gray-900 border border-transparent rounded-md">{addressLine1}</span>
                <span className="p-2 inline text-lg font-semibold text-gray-900 border border-transparent rounded-md">{addressLine2}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="available"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available</label>
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree Document</label>
            <input
              type="file"
              onChange={(e) => setDegreeDocument(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            />
          </div>
        )}

        <div className="flex gap-4 mt-6">
          {isEdit ? (
            <>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setIsEdit(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-primary underline hover:text-primary-dark"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>

  <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
</div>
  );
};

export default Profile;