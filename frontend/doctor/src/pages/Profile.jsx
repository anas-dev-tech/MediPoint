import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import useAuth from '../hooks/useAuth';
import { updateMe } from '../api/userAPI';
import toast from 'react-hot-toast';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { assets } from '../assets/assets';

const Profile = () => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const { user, getUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { handleSubmit, reset, control, watch, getValues, register, formState: { errors } } = useForm({
    defaultValues: {
      ...user,
    },
  });


  const formImage = watch("user.image") || [assets.profile_placeholder];

  useEffect(() => {
    if (user) {
      reset({
        ...user,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);

  // Function to filter out unchanged fields
  const filterChangedFields = (currentValues, initialValues) => {
    const changedFields = {};

    for (const key in currentValues) {
      if (
        JSON.stringify(currentValues[key]) !== JSON.stringify(initialValues[key])
      ) {
        changedFields[key] = currentValues[key];
      }
    }

    return changedFields;
  };

  const updateProfile = async (formData) => {


    setIsLoading(true)
    try {
      // Filter out unchanged fields
      const currentValues = getValues(); // Get current form values
      const filteredData = filterChangedFields(currentValues, user);

      console.log(filteredData.degree_document)

      // Handle image file separately
      if (formData.user.image && formData.user.image.length > 0 && typeof formData.user.image !== "string") {
        filteredData.user = {
          ...filteredData.user,
          image: formData.user.image[0], // Include the new image file
        };
      }
      console.log("before checking file")
      if (filteredData?.degree_document && filteredData.degree_document.length === 0) {
        console.log("it is checked and yes")

        delete filteredData.degree_document
      }


      console.log("Filtered data:", filteredData);

      // Send the filtered data to the server
      const data = await updateMe(filteredData);
      toast.success(data.message);
      await getUser();
      setIsEdit(false);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false)
    }
  };

  return user && (
    <div className="w-full flex-1 p-5 ">
      <Card className="overflow-hidden shadow-sm mt-5 lg:max-w-3xl mx-auto">
        <div className="flex flex-col gap-6 m-5">
          <div className="w-full">
            <form
              onSubmit={handleSubmit((data) => {
                updateProfile(data);
                console.log("useForm", data);
              })}
              className="space-y-4"
            >
              <div className="w-full flex flex-col justify-center items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-1 border-primary">
                  <img
                    src={
                      typeof formImage[0] === "string"
                        ? user?.user?.image || assets.profile_placeholder
                        : URL.createObjectURL(formImage[0])
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isEdit && (
                    <Label className="absolute bottom-0 w-full left-0 right-0 bg-primary/80 text-white text-center py-1 cursor-pointer">
                      <div className='w-full text-xs'>
                      Change
                      </div>
                      <Input
                        {...register("user.image",

                          {
                            validate: {
                              size: (fileList) =>
                                typeof fileList === "string" ||
                                fileList.length === 0 ||
                                fileList[0]?.size <= MAX_IMAGE_SIZE || "File size must be less than 2MB",
                              type: (fileList) =>
                                typeof fileList === "string" ||
                                fileList.length === 0 ||
                                ["image/png", "image/jpg"].includes(fileList[0]?.type) ||
                                "Only PNG & JPG files are allowed",
                            }
                          }
                        )
                        }
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </Label>
                  )}
                </div>
                  {errors.user?.image && <p className='text-red-900 text-sm'>{errors.user?.image.message}</p>}
              </div>

              {/* Form fields */}
              <Label htmlFor="name">Name:</Label>
              <Input
                {...register("user.full_name")}
                id="name"
                disabled={!isEdit}
                className="mt-1"
              />

              <p className='text-gray-500 text-sm leading-tight'>

                <span className='text-black font-semibold text-medium'>Specialty:</span> {user?.specialty || 'Unset'}
                <br />
                <span className="text-xs text-gray-400">Specialty is selected by our team based on the document degree you provided. It may take 1-7 days to process that </span>
              </p>




              <Label htmlFor="education">Education:</Label>
              <Input
                {...register('education')}
                id="education"
                disabled={!isEdit}
                className="mt-1"
              />

              <Label htmlFor="experience">Experience</Label>
              <Input
                {...register("experience")}
                label="Experience"
                id="experience"
                disabled={!isEdit}
                className="mt-1"
              />

              <Label htmlFor="about">About</Label>
              <Textarea
                {...register("about")}
                label="About"
                id="about"
                disabled={!isEdit}
                className="mt-1"
              />

              <Label htmlFor="fees">Fees</Label>
              <Input
                {...register('fees',{

                  required: 'Fees is required',
                  min: { value: 0, message: 'Minimum fee is 0' },
                  max: { value: 999, message: 'Maximum fee is 999' },
                }
                )}
                type="number"
                id="fees"
                disabled={!isEdit}
                className="mt-1"
              />
              {errors.fees && <p className='text-red-900 text-sm'>{errors.fees.message}</p>}

              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                {...register("address_line1")}
                id="address_line1"
                disabled={!isEdit}
                className="mt-1"
              />

              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                {...register("address_line2")}
                id="address_line2"
                disabled={!isEdit}
                className="mt-1"
              />
              {
                user?.specialty &&
                <>
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="status"
                        disabled={!isEdit}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.value === 'A' ? "Available" : "Unavailable"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Available</SelectItem>
                          <SelectItem value="U">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </>
              }

              {isEdit && (
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    Degree Document
                  </Label>
                  <input
                    {...register("degree_document",
                      {
                        validate: {
                          size: (fileList) =>
                            typeof fileList === "string" ||
                            fileList.length === 0 ||
                            fileList[0]?.size <= MAX_FILE_SIZE || "File size must be less than 5MB",
                          type: (fileList) =>
                            fileList.length === 0 ||
                            ["application/pdf"].includes(fileList[0]?.type) ||
                            "Only PDF files are allowed",
                        }
                      }
                    )
                    }
                    type="file"
                    className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                  {errors.degree_document && <p className='text-red-900 text-sm'>{errors.degree_document.message}</p>}

                </div>
              )}

              <div className="flex gap-4 mt-6">
                {isEdit && (
                  <>
                    <Button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-300"
                    >
                      {
                        isLoading
                          ? <BeatLoader size={10} color="white" />
                          : <span> Save</span>
                      }
                    </Button>
                    <Button
                      onClick={() => setIsEdit(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>

            {!isEdit && (
              <div className="mt-4 flex gap-3">
                <Button type="button" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </div>

        <ChangePasswordModal
          show={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </Card>
    </div>
  );
};

export default Profile;