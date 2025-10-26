"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import StepTracker from "../modules/clientsModule/StepTracker";
import BMIForm from "../modules/clientsModule/BmiForm";
import ProfileForm from "../modules/clientsModule/ProfileForm";

export default function ClientPage() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(true);

  // 🟢 اینجا state فرم رو نگه می‌داریم
  const [formState, setFormState] = useState({
    gender: "male",
    height: "",
    weight: "",
    description: "",
    idNumber: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile/me");
      const data = await res.json();

      setProfile(data.profile);
      setUser(data.user);

      if (data.profile) {
        setFormState({
          gender: data.profile.gender || "male",
          height: data.profile.height || "",
          weight: data.profile.weight || "",
          description: data.profile.description || "",
          idNumber: data.profile.idNumber || "",
        });
      }

      if (data.profile?.analyzed) setStep(4);
      else if (data.profile?.bmi) setStep(3);
      else setStep(2);

      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleProfileComplete = async (formData) => {
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    toast.success("✅ اطلاعات شما با موفقیت ثبت شد!");
    setFormState(formData); // 🟢 فرم رو بروز می‌کنیم
    setStep(3);
  };

  const handleBMIComplete = async (bmi) => {
    await fetch("/api/profile/bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bmi }),
    });
    toast.success("🎉 آنالیز شما با موفقیت انجام شد!");
    setStep(4);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  if (loading) return <div className="text-white p-4">در حال بارگذاری...</div>;

  if (step === 4)
    return (
      <div className="text-center text-white mt-10">
        <h2 className="text-4xl font-bold">
          👋 خوش آمدید {user?.name || "کاربر عزیز"}!
        </h2>
      </div>
    );

  return (
    <div className="p-6">
      <StepTracker step={step} onStepClick={handleStepClick} />

      {step === 2 && (
        <ProfileForm
          form={formState} // 🟢 پاس دادن فرم به کامپوننت
          setForm={setFormState} // 🟢 پاس دادن setter
          onComplete={handleProfileComplete}
        />
      )}

      {step === 3 && (
        <BMIForm
          height={formState.height}
          weight={formState.weight}
          onComplete={handleBMIComplete}
        />
      )}
    </div>
  );
}
