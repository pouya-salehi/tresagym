import { Dumbbell, Apple, Activity } from "lucide-react";

const services = [
  {
    icon: Dumbbell,
    title: "شاگرد خصوصی",
    description:
      "آموزش خصوصی با مربیان زبده برای به حداکثر رساندن نتایج و دستیابی سریع‌تر به اهداف تناسب اندام شما.",
    features: [
      "برنامه‌های تمرینی سفارشی",
      "پشتیبانی 24 ساعته",
      "پیگیری پیشرفت",
    ],
  },
  {
    icon: Apple,
    title: "برنامه های تغذیه ای",
    description:
      "برنامه‌های غذایی مبتنی بر علم، متناسب با متابولیسم، سبک زندگی و اهداف تناسب اندام شما.",
    features: ["رژیم مختص بدن ", "راهنمای تهیه غذا", "چک های هفتگی"],
  },
  {
    icon: Activity,
    title: "آنالیز بدن",
    description:
      "اسکن پیشرفته ترکیب بدن و تجزیه و تحلیل دقیق برای پیگیری مسیر تحول شما.",
    features: ["آنالیز بدن با هوش مصنوعی", "گزارش ماهانه"],
  },
];

export default function Services() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-neon-cyan text-sm font-semibold tracking-widest">
              چه سرویس هایی ارائه میدهیم
            </span>
          </div>
          <h2 className="font-orbitron font-black text-5xl md:text-6xl text-white mb-6">
            <span className="text-neon-cyan text-glow-sm">برنامه های <br /></span>
            تمرینی و غذایی
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            امکانات پیشرفته و برنامه‌های شخصی‌سازی‌شده که برای فراتر رفتن از
            محدودیت‌های شما طراحی شده‌اند
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative glass-card rounded-2xl p-8 hover:box-glow transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-xl bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-neon-cyan animate-glow-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/30 rounded-tr-xl"></div>
              </div>

              {/* Content */}
              <h3 className="font-orbitron font-bold text-2xl text-white mb-4 group-hover:text-neon-cyan transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-glow-pulse"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Corner accent */}
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-neon-cyan/20 rounded-br-xl group-hover:border-neon-cyan/50 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
