import { Zap } from "lucide-react";
export default function Banner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Silhouette effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div
          className="w-full h-full max-w-4xl bg-gradient-to-t from-neon-cyan/30 to-transparent"
          style={{
            clipPath:
              "polygon(40% 0%, 45% 15%, 35% 30%, 38% 50%, 35% 70%, 40% 85%, 45% 100%, 55% 100%, 60% 85%, 65% 70%, 62% 50%, 65% 30%, 55% 15%, 60% 0%)",
          }}
        ></div>
      </div>

      {/* Lightning effects */}
      <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-gradient-to-b from-neon-cyan to-transparent opacity-60 animate-glow-pulse"></div>
      <div
        className="absolute top-1/3 right-1/3 w-1 h-24 bg-gradient-to-b from-neon-blue to-transparent opacity-40 animate-glow-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-card">
          <Zap className="w-4 h-4 text-neon-cyan animate-glow-pulse" />
          <span className="text-neon-cyan text-sm font-medium tracking-wider">
            تجربه تناسب اندام ممتاز
          </span>
        </div>

        <h1
          className= "font-black text-6xl md:text-8xl lg:text-9xl mb-6 leading-tight"
        >
          <span className="text-white">TRESA</span>
          <br />
          <span className="text-neon-cyan text-glow animate-glow-pulse">
            GYM
          </span>
        </h1>

        <p className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4 tracking-wide">
          Power Your Future
        </p>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
          بدن خود را متحول کنید، ذهن خود را ارتقا دهید و پتانسیل نهایی خود را در
          ترسا آزاد کنید
        </p>

        <button className="group relative px-12 py-5 bg-neon-cyan font-orbitron font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 box-glow hover:box-glow-hover cursor-pointer">
          <span className="relative z-10">همین الان ثبت نام کنید</span>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { number: "100+", label: "اعضا" },
            { number: "50+", label: "شاگردان" },
            { number: "50+", label: "تحول ها" },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-lg p-6 hover:box-glow transition-all duration-300"
            >
              <div className="text-4xl font-orbitron font-black text-neon-cyan text-glow-sm mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm tracking-wider font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
