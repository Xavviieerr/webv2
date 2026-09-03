"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import PhoneLayout from "@/components/layouts/PhoneLayout";
import { useRegisterMutation } from "@/features/auth/api/authApi";
import {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} from "@/features/auth/api/provinceEndpoints";
import { useRouter } from "next/navigation";
import { RiLoader2Fill } from "react-icons/ri";
import { session } from "@/features/auth/services/session";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import {
  Mail,
  Lock,
  User,
  Calendar,
  MapPin,
  Building2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLanguageSync, usePasswordVisibility } from "@/features/auth/hooks";
import { signupFullSchema, validateSignupStep } from "@/features/auth/schemas";
import { TEAL, BORDER_GRAY, TEXT_GRAY, SIGNUP_STEPS } from "@/features/auth/constants";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [DOB, setDOB] = useState("");
  const dobInputRef = useRef<HTMLInputElement>(null);
  const [isUrhobo, setIsUrhobo] = useState(false);
  const [province, setProvince] = useState("");
  const [town, setTown] = useState("");
  const { visible: showPassword, toggle: togglePassword } = usePasswordVisibility();
  const [submissionStarted, setSubmissionStarted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [register] = useRegisterMutation();
  const { data: provincesData } = useGetProvincesQuery();
  const { data: townsData } = useGetTownsByProvinceIdQuery(province, {
    skip: !province,
  });
  const { t } = useTranslation("common");
  const provinces = provincesData?.data ?? [];
  const towns = townsData?.data ?? [];
  const { toggleLanguage, i18n } = useLanguageSync();

  const handleNext = () => {
    const stepData =
      currentStep === 1
        ? { firstName, lastName, gender, DOB, province, town }
        : { username, email, password };
    const stepError = validateSignupStep(currentStep, stepData);
    if (stepError) {
      setError(stepError);
      return;
    }
    if (currentStep < SIGNUP_STEPS.TOTAL) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const stepError = validateSignupStep(currentStep, { username, email, password });
    if (stepError) {
      setError(stepError);
      return;
    }

    const validation = signupFullSchema.safeParse({
      firstName,
      lastName,
      username,
      email,
      password,
      gender,
      DOB,
      province: isUrhobo ? province : undefined,
      town: isUrhobo ? town : undefined,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setSubmissionStarted(true);
    session.saveSignupContext({ email });

    const provinceName =
      isUrhobo && province
        ? (provinces.find((p) => (p.id ?? p.name) === province)?.name ??
          province)
        : undefined;
    const townName =
      isUrhobo && town
        ? (towns.find((t) => (t.id ?? t.name) === town || t.name === town)
            ?.name ?? town)
        : undefined;

    try {
      await register({
        firstName,
        lastName,
        username,
        email,
        password,
        gender,
        deviceType: "browser",
        platform: "web",
        DOB,
        ...(provinceName ? { province: provinceName } : {}),
        ...(townName ? { town: townName } : {}),
      }).unwrap();
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      setSubmissionStarted(false);
    }
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen md:h-screen w-full overflow-x-hidden md:overflow-hidden">
      <aside className="min-h-0 overflow-hidden hidden md:block">
        <PhoneLayout />
      </aside>

      <section className="flex flex-col items-center justify-start md:justify-center bg-white py-6 sm:py-8 px-4 sm:px-6 w-full min-w-0 min-h-screen md:min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full max-w-[634px] min-w-0 flex-1 md:flex-none flex flex-col pb-6 mx-auto">
          <button
            type="button"
            onClick={toggleLanguage}
            className="absolute top-0 right-0 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors z-10"
            style={{ color: TEAL }}
          >
            {i18n.language === "en" ? "URH" : "ENG"}
          </button>

          <div className="mb-5 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <Logo type="normal" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              {t("welcome")}
            </h1>
            <p
              className="text-sm sm:text-base font-normal"
              style={{ color: TEXT_GRAY }}
            >
              {t("secureAccountCreation") ||
                "Create your account to get started"}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-5 sm:mb-8">
            {Array.from({ length: SIGNUP_STEPS.TOTAL }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 === currentStep
                    ? "w-8"
                    : index + 1 < currentStep
                      ? "w-2"
                      : "w-2"
                }`}
                style={{
                  backgroundColor:
                    index + 1 <= currentStep ? TEAL : BORDER_GRAY,
                }}
              />
            ))}
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === SIGNUP_STEPS.TOTAL) {
                handleSignUp(e);
              }
            }}
            className="space-y-5 min-w-0 flex-1"
            autoComplete="off"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      id="firstName"
                      type="text"
                      placeholder={t("firstName")}
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (error) setError(""); }}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition capitalize"
                      style={{ borderColor: BORDER_GRAY }}
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      type="text"
                      placeholder={t("lastName")}
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (error) setError(""); }}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition capitalize"
                      style={{ borderColor: BORDER_GRAY }}
                    />
                  </div>
                </div>

                <div>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => { setGender(e.target.value); if (error) setError(""); }}
                    className="w-full px-4 py-3 rounded-lg border bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition capitalize"
                    style={{ borderColor: BORDER_GRAY }}
                  >
                    <option value="">
                      {t("selectGender") || "Select gender"}
                    </option>
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="DOB"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 cursor-pointer"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        dobInputRef.current?.focus();
                        if (typeof dobInputRef.current?.showPicker === "function") {
                          dobInputRef.current.showPicker();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          dobInputRef.current?.focus();
                          if (typeof dobInputRef.current?.showPicker === "function") {
                            dobInputRef.current.showPicker();
                          }
                        }
                      }}
                      className="flex items-center rounded-lg border bg-white min-h-[48px] relative flex-1 min-w-0 w-full focus-within:ring-2 focus-within:ring-[#165e5b]/20 focus-within:ring-offset-0 transition cursor-pointer"
                      style={{ borderColor: BORDER_GRAY }}
                    >
                      <input
                        ref={dobInputRef}
                        id="DOB"
                        type="date"
                        value={DOB}
                        onChange={(e) => { setDOB(e.target.value); if (error) setError(""); }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        style={{ fontSize: "16px" }}
                        aria-label={t("dob")}
                      />
                      <span
                        className={`flex-1 min-w-0 pl-4 text-sm pointer-events-none capitalize truncate ${DOB ? "text-black" : ""}`}
                        style={!DOB ? { color: TEXT_GRAY } : undefined}
                      >
                        {DOB
                          ? (() => {
                              const [y, m, d] = DOB.split("-");
                              return `${d}/${m}/${y}`;
                            })()
                          : t("dateOfBirth") || "Select date"}
                      </span>
                      <div className="flex items-center gap-2 pr-4 shrink-0 pointer-events-none">
                        <Calendar
                          className="w-5 h-5"
                          style={{ color: TEXT_GRAY }}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                <div>
                  <p className="text-sm text-black mb-2">
                    {t("areYouUrhobo") || "Are you Urhobo?"}
                  </p>
                  <div
                    className="flex p-1 rounded-full border w-full max-w-[280px] min-w-0"
                    style={{ borderColor: BORDER_GRAY }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsUrhobo(true)}
                      className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                        isUrhobo ? "text-white shadow-sm" : "text-black"
                      }`}
                      style={{
                        backgroundColor: isUrhobo ? TEAL : "transparent",
                      }}
                    >
                      {t("yes") || "Yes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUrhobo(false);
                        setProvince("");
                        setTown("");
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                        !isUrhobo ? "text-white shadow-sm" : "text-black"
                      }`}
                      style={{
                        backgroundColor: !isUrhobo ? TEAL : "transparent",
                      }}
                    >
                      {t("no") || "No"}
                    </button>
                  </div>
                </div>

                {isUrhobo && (
                  <div className="space-y-5">
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: TEXT_GRAY }}
                      />
                      <select
                        id="province"
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setTown("");
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition appearance-none cursor-pointer capitalize"
                        style={{ borderColor: BORDER_GRAY }}
                      >
                        <option value="">
                          {t("selectProvince") || "Select province"}
                        </option>
                        {provinces.map((p) => (
                          <option
                            key={p.id ?? p.name}
                            value={(p.id ?? p.name)?.toString().trim() ?? ""}
                          >
                            {p.name.trim()}
                          </option>
                        ))}
                      </select>
                    </div>
                    {province && (
                      <div className="relative">
                        <Building2
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                          style={{ color: TEXT_GRAY }}
                        />
                        <select
                          id="town"
                          value={town}
                          onChange={(e) => setTown(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition appearance-none cursor-pointer capitalize"
                          style={{ borderColor: BORDER_GRAY }}
                        >
                          <option value="">
                            {t("selectTown") || "Select town"}
                          </option>
                          {towns.map((twn) => (
                            <option
                              key={twn.id ?? twn.name}
                              value={
                                (twn.id ?? twn.name)?.toString().trim() ??
                                twn.name.trim()
                              }
                            >
                              {twn.name.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: TEXT_GRAY }}
                    />
                    <input
                      id="username"
                      type="text"
                      placeholder={t("username")}
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
                      style={{ borderColor: BORDER_GRAY }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: TEXT_GRAY }}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder={t("enterYourEmail")}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
                    style={{ borderColor: BORDER_GRAY }}
                  />
                </div>

                <div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: TEXT_GRAY }}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enterYourPassword")}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
                      style={{ borderColor: BORDER_GRAY }}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <IoMdEyeOff size={20} />
                      ) : (
                        <IoMdEye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3 pt-4 min-w-0 shrink-0">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-lg border text-sm sm:text-base font-medium hover:bg-gray-50 transition"
                  style={{ borderColor: BORDER_GRAY, color: TEXT_GRAY }}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">
                    {t("previous") || "Previous"}
                  </span>
                </button>
              )}
              {currentStep < SIGNUP_STEPS.TOTAL ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-lg text-white text-sm sm:text-base font-bold hover:opacity-95 transition"
                  style={{ backgroundColor: TEAL }}
                >
                  <span className="truncate">{t("next") || "Next"}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submissionStarted}
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-lg text-white text-sm sm:text-base font-bold hover:opacity-95 transition disabled:opacity-70"
                  style={{ backgroundColor: TEAL }}
                >
                  {submissionStarted ? (
                    <>
                      <RiLoader2Fill className="animate-spin w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate">{t("submitting")}</span>
                    </>
                  ) : (
                    <span className="truncate">{t("continue")}</span>
                  )}
                </button>
              )}
            </div>

            <p className="text-center text-sm text-black mt-6 shrink-0">
              {t("haveAccount")}{" "}
              <Link
                href="/signin"
                className="font-medium hover:underline"
                style={{ color: TEAL }}
              >
                {t("login")}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
