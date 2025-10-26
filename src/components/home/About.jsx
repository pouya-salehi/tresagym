import { Target, Users, Award, TrendingUp } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Target, label: "Mission Driven", value: "100%" },
    { icon: Users, label: "Expert Trainers", value: "50+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: TrendingUp, label: "Success Rate", value: "98%" },
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative group">
            {/* Main image container */}
            <div className="relative rounded-2xl overflow-hidden glass-card p-1 group-hover:box-glow transition-all duration-500">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Placeholder gym interior visual */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Dumbbell className="w-24 h-24 text-neon-cyan/40 mx-auto mb-4" />
                    <p className="text-gray-600 font-orbitron text-sm">
                      STATE-OF-THE-ART FACILITY
                    </p>
                  </div>
                </div>

                {/* Overlay grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-neon-cyan/30 rounded-2xl animate-float"></div>
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-neon-blue/30 rounded-2xl animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Content side */}
          <div>
            <div className="inline-block px-4 py-2 rounded-full glass-card mb-6">
              <span className="text-neon-cyan text-sm font-semibold tracking-widest">
                ABOUT US
              </span>
            </div>

            <h2 className="font-orbitron font-black text-5xl md:text-6xl text-white mb-6 leading-tight">
              Where Champions
              <br />
              Are <span className="text-neon-cyan text-glow-sm">Forged</span>
            </h2>

            <div className="space-y-4 mb-8 text-gray-400 leading-relaxed">
              <p>
                At Tresa Gym, we've revolutionized the fitness experience by
                combining cutting-edge technology with proven training
                methodologies. Our mission is to empower every individual to
                unlock their true potential.
              </p>
              <p>
                With over 50 elite trainers, state-of-the-art equipment, and a
                community of driven athletes, we've created an environment where
                excellence is the standard, not the exception.
              </p>
              <p>
                Whether you're a beginner taking your first step or an athlete
                pushing for peak performance, our team provides the expertise,
                motivation, and support to ensure your success.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-5 hover:box-glow transition-all duration-300 group"
                >
                  <stat.icon className="w-8 h-8 text-neon-cyan mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-orbitron font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <button className="group relative px-10 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold rounded-lg overflow-hidden transition-all duration-300 hover:text-black hover:scale-105">
              <span className="relative z-10">LEARN MORE</span>
              <div className="absolute inset-0 bg-neon-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dumbbell({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M6.5 6.5V17.5M17.5 6.5V17.5M3 9V15M21 9V15M3 9H6.5M3 15H6.5M21 9H17.5M21 15H17.5M6.5 9H17.5M6.5 15H17.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
