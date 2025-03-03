import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { updateMe } from '../../../patient/src/api/userAPI';
import { toast } from 'react-toastify';
import ChangePasswordModal from '../components/ChangePasswordModal';


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
  const [degreeDocument, setDegreeDocument] = useState(null); // State for the file

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
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);

  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user[full_name]', fullName);
    formData.append('degree', degree);
    formData.append('experience', experience);
    formData.append('about', about);
    formData.append('fees', fees);
    formData.append('status', status ? 'A' : 'U');
    if (degreeDocument) {
      formData.append('degree_document', degreeDocument);
    }

    try {
      const { data, success } = await updateMe(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (success) {
        toast.success(data.message);
        await getUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  return user && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={user?.user?.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-200 rounded-lg p-8 py-7 bg-white'>
          {/* Form fields with state variables */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {isEdit ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              user?.user?.full_name
            )}
          </p>

          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>
              {isEdit ? (
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              ) : (
                user?.degree
              )}
            </p> - <p>{user?.specialty}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {isEdit ? (
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              ) : (
                user?.experience
              )}
            </button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3 '>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {isEdit ? (
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              ) : (
                user?.about
              )}
            </p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>
              ${isEdit ? (
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                />
              ) : (
                user?.fees
              )}
            </span>
          </p>

          <div>
            <p className='flex gap-2 py-2'>Address:</p>
            <p className='text-sm '>
              {isEdit ? (
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              ) : (
                user?.user?.address?.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              ) : (
                user?.user?.address?.line2
              )}
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input
              type="checkbox"
              id='available'
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
            <label htmlFor="available"> Available</label>
          </div>

          {/* File input for degree document */}
          {isEdit && (
            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700'>Degree Document</label>
              <input
                type="file"
                onChange={(e) => setDegreeDocument(e.target.files[0])}
                className='mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none'
              />
            </div>
          )}

          {isEdit ? (
            <button
              onClick={handleSubmit}
              type='button'
              className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-300'
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              type='button'
              className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-300'
            >
              Edit
            </button>
          )}
          <div className='mt-5'>
            <button
              onClick={() => setShowPasswordModal(true)}
              className='text-primary underline'>
              Change Password
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

    </div>
  );
};

export default Profile;