"use client";

import { AccountLayout } from "@/features/account/components/AccountLayout";
import { useState, useRef } from "react";
import { IoCameraOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  zipCode: string;
  avatarUrl: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
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
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "Mfoniso",
    lastName: "Ibokette",
    email: "mfonisoibokette21@gmail.com",
    phoneNumber: "+1-202-555-0118",
    country: "Nigeria",
    state: "Uyo",
    zipCode: "1207",
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

  // ── Setters ──

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

  // ── Avatar upload ──

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile("avatarUrl", url);
  };

  // ── Validation ──

  const validateProfile = (): boolean => {
    const errors: Partial<ProfileForm> = {};
    if (!profileForm.firstName.trim()) errors.firstName = "Required";
    if (!profileForm.lastName.trim()) errors.lastName = "Required";
    if (!profileForm.email.trim()) errors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) errors.email = "Invalid email";
    if (!profileForm.phoneNumber.trim()) errors.phoneNumber = "Required";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (): boolean => {
    const errors: Partial<PasswordForm> = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Required";
    if (!passwordForm.newPassword) errors.newPassword = "Required";
    else if (passwordForm.newPassword.length < 8)
      errors.newPassword = "At least 8 characters";
    if (!passwordForm.confirmPassword) errors.confirmPassword = "Required";
    else if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit handlers — drop API calls here ──

  const handleSaveProfile = () => {
    if (!validateProfile()) return;
    const payload = { ...profileForm };
    console.log("Profile payload →", payload);
    // await updateProfile(payload);
    setProfileSuccess(true);
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;
    const payload = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    };
    console.log("Password payload →", payload);
    // await changePassword(payload);
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "United States"];
  const STATES: Record<string, string[]> = {
    Nigeria: ["Uyo", "Lagos", "Abuja", "Kano", "Port Harcourt"],
    Ghana: ["Accra", "Kumasi"],
    Kenya: ["Nairobi", "Mombasa"],
    "South Africa": ["Cape Town", "Johannesburg"],
    "United States": ["New York", "California", "Texas"],
  };

  return (
    <AccountLayout
      breadcrumbItems={[
        { label: "Profile Settings", href: "/account/profile" },
      ]}
    >
      <div className="flex flex-col gap-6 lg:w-[80%]">

        {/* ── Account Setting ── */}
        <section className="rounded border border-gray-200 bg-white p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Account Setting
          </p>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="flex shrink-0 flex-col items-center gap-2">
              <div className="relative h-24 w-24">
                <img
                  src={
                    profileForm.avatarUrl ||
                    "https://ui-avatars.com/api/?name=Mfoniso+Ibokette&background=f97316&color=fff&size=96"
                  }
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600"
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

            {/* Form fields */}
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
                    onChange={(v) => setProfile("email", v)}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.email}</p>
                  )}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SelectField
                  label="Country/Region"
                  value={profileForm.country}
                  onChange={(v) => {
                    setProfile("country", v);
                    setProfile("state", STATES[v]?.[0] ?? "");
                  }}
                  options={COUNTRIES}
                />
                <SelectField
                  label="States"
                  value={profileForm.state}
                  onChange={(v) => setProfile("state", v)}
                  options={STATES[profileForm.country] ?? []}
                />
                <FormField
                  label="Zip Code"
                  value={profileForm.zipCode}
                  onChange={(v) => setProfile("zipCode", v)}
                />
              </div>

              {profileSuccess && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Profile updated successfully
                </p>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded bg-orange-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-orange-600 active:scale-95 transition-transform"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Change Password ── */}
        <section className="rounded border border-gray-200 bg-white p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Change Password
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <PasswordInput
                label="Current Password"
                value={passwordForm.currentPassword}
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
                onChange={(v) => setPassword("confirmPassword", v)}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {passwordSuccess && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Password changed successfully
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={handleChangePassword}
                className="rounded bg-orange-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-orange-600 active:scale-95 transition-transform"
              >
                Change Password
              </button>
            </div>
          </div>
        </section>

      </div>
    </AccountLayout>
  );
}