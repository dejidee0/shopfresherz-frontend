"use client";

import { AccountLayout } from "@/features/account/components/AccountLayout";
import { accountApi } from "@/lib/api/account";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/toast";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { IoCameraOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function PasswordInput({
  label,
  placeholder,
  value,
  disabled = false,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 disabled:bg-gray-50 disabled:text-gray-500"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

export default function AccountProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken, updateUser } = useAuthStore();

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState<Partial<ProfileForm>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordForm>>({});
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const token = accessToken;

    async function loadProfile() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsProfileLoading(true);

      try {
        const profile = await accountApi.getProfile(token);
        if (!isMounted) return;

        setProfileForm({
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          phoneNumber: profile.phone ?? "",
          avatarUrl: profile.avatarUrl ?? "",
        });
        updateUser(profile);
      } catch {
        toast.error("Failed to load profile", "Please refresh and try again.");
      } finally {
        if (isMounted) setIsProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken, updateUser]);

  const setProfile = (key: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
    setProfileErrors((prev) => ({ ...prev, [key]: undefined }));
    setProfileSuccess(false);
  };

  const setPassword = (key: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
    setPasswordErrors((prev) => ({ ...prev, [key]: undefined }));
    setPasswordSuccess(false);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfile("avatarUrl", URL.createObjectURL(file));
  };

  const validateProfile = () => {
    const errors: Partial<ProfileForm> = {};
    if (!profileForm.firstName.trim()) errors.firstName = "Required";
    if (!profileForm.lastName.trim()) errors.lastName = "Required";
    if (!profileForm.phoneNumber.trim()) errors.phoneNumber = "Required";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: Partial<PasswordForm> = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Required";
    if (!passwordForm.newPassword) errors.newPassword = "Required";
    else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "At least 8 characters";
    }
    if (!passwordForm.confirmPassword) errors.confirmPassword = "Required";
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!accessToken || !validateProfile()) return;

    setIsProfileSaving(true);
    setProfileSuccess(false);

    const payload = {
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phone: profileForm.phoneNumber.trim(),
      avatarUrl: profileForm.avatarUrl.trim(),
    };

    try {
      await accountApi.updateProfile(accessToken, payload);
      updateUser(payload);
      setProfileSuccess(true);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile", "Please try again.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!accessToken || !validatePassword()) return;

    setIsPasswordSaving(true);
    setPasswordSuccess(false);

    try {
      await accountApi.changePassword(accessToken, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccess(true);
      toast.success("Password changed successfully");
    } catch {
      toast.error(
        "Failed to change password",
        "Please check your current password and try again."
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const avatarName =
    [profileForm.firstName, profileForm.lastName].filter(Boolean).join("+") || "Shop+Fresherz";

  return (
    <AccountLayout
      breadcrumbItems={[
        { label: "Profile Settings", href: "/account/profile" },
      ]}
    >
      <div className="flex flex-col gap-6 lg:w-[80%]">
        <section className="rounded border border-gray-200 bg-white p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {isProfileLoading ? "Loading Account Setting" : "Account Setting"}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="relative h-24 w-24">
                <img
                  src={
                    profileForm.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${avatarName}&background=f97316&color=fff&size=96`
                  }
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600"
                  aria-label="Choose avatar"
                >
                  <IoCameraOutline size={13} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FormField
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(v) => setProfile("firstName", v)}
                  />
                  {profileErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <FormField
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(v) => setProfile("lastName", v)}
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <FormField
                    label="Email"
                    type="email"
                    value={profileForm.email}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div>
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(v) => setProfile("phoneNumber", v)}
                  />
                  {profileErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {profileSuccess && (
                <p className="text-sm text-green-600 font-medium">
                  Profile updated successfully
                </p>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isProfileSaving || isProfileLoading}
                  className="rounded bg-orange-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-orange-600 active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProfileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded border border-gray-200 bg-white p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Change Password
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <PasswordInput
                label="Current Password"
                value={passwordForm.currentPassword}
                disabled={isPasswordSaving}
                onChange={(v) => setPassword("currentPassword", v)}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div>
              <PasswordInput
                label="New Password"
                placeholder="8+ characters"
                value={passwordForm.newPassword}
                disabled={isPasswordSaving}
                onChange={(v) => setPassword("newPassword", v)}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
              )}
            </div>
            <div>
              <PasswordInput
                label="Confirm Password"
                value={passwordForm.confirmPassword}
                disabled={isPasswordSaving}
                onChange={(v) => setPassword("confirmPassword", v)}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {passwordSuccess && (
              <p className="text-sm text-green-600 font-medium">
                Password changed successfully
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isPasswordSaving}
                className="rounded bg-orange-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-orange-600 active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPasswordSaving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}
