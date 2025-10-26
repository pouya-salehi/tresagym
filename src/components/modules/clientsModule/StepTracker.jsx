"use client";

export default function StepTracker({ step, onStepClick }) {
  const steps = ["ثبت‌نام", "تکمیل پروفایل", "محاسبه BMI", "پایان"];

  return (
    <div className="flex justify-center mb-6">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === step;
        const isCompleted = stepNumber < step;

        return (
          <div key={index} className="flex items-center">
            <button
              onClick={() => {
                // اجازه فقط برای برگشت به مراحل قبلی
                if (stepNumber < step) onStepClick(stepNumber);
              }}
              className={`w-15 h-15 flex items-center justify-center rounded-full transition-colors
                ${
                  isCompleted
                    ? "bg-amber-400 text-black cursor-pointer"
                    : isActive
                    ? "bg-amber-300 text-black cursor-default"
                    : "text-white cursor-not-allowed border-2 border-white"
                }`}
            >
              {stepNumber}
            </button>

            {index !== steps.length - 1 && (
              <div
                className={`w-10 h-[2px] transition-colors ${
                  isCompleted ? "bg-amber-400" : "bg-gray-600"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
