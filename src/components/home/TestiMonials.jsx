import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "نهرو کلاه قوچی",
    role: "ورزشکار و مربی",
    image: "MJ",
    rating: 5,
    text: "مدیر اجرایی و مربی مجموعه",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-10 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-neon-cyan text-sm font-semibold tracking-widest">
              مربیان
            </span>
          </div>
          <h2 className="font-orbitron font-black text-5xl md:text-6xl text-white mb-6">
            معرفی <span className="text-neon-cyan text-glow-sm">مربیان</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            حضور مربیان با تجربه در محیط باشگاه
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="flex w-full gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative glass-card rounded-2xl p-8 w-full hover:box-glow transition-all duration-500 hover:-translate-y-2 group"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Quote className="w-12 h-12 text-neon-cyan" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-neon-cyan text-neon-cyan animate-glow-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 leading-relaxed mb-8 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center font-orbitron font-bold text-black text-lg box-glow">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-neon-cyan/20 rounded-bl-2xl group-hover:border-neon-cyan/50 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            آماده ای که بدنتو بسازی؟
          </p>
          <button className="group relative px-10 py-4 bg-neon-cyan text-black font-orbitron font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 box-glow hover:box-glow-hover cursor-pointer">
            <span className="relative z-10 text-white">ثبت نام</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
