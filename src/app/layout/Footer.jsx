import { Instagram, Twitter, Mail, Phone, MapPin, Zap } from "lucide-react";

export default function Footer() {
  const socialLinks = [{ icon: Instagram, href: "#", label: "Instagram" }];

  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Services", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const contactInfo = [
    { icon: Mail, text: "tresagym@gmail.com" },
    { icon: Phone, text: "+98000000" },
    { icon: MapPin, text: "سنندج | شهرک آبیدر | کوچه آبیدر 18" },
  ];

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-neon-cyan animate-glow-pulse" />
              </div>
              <div>
                <div className="font-orbitron font-black text-2xl text-white">
                  TRESA
                </div>
                <div className="text-xs text-neon-cyan font-semibold tracking-widest">
                  GYM
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transforming lives through elite training and cutting-edge fitness
              technology.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:box-glow transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-6 text-lg">
              لینک ها
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-neon-cyan transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-6 text-lg">
              با ما در تماس باشید
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <info.icon className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-6 text-lg">
              ساعات پاسخگویی
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between text-gray-400">
                <span>شنبه تا چهارشنبه</span>
                <span className="text-neon-cyan font-semibold">
                  11 صبح تا 11 شب
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Tresa Gym. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-neon-cyan transition-colors duration-300"
              >
                ساخته شده در استدیو کوپر
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
    </footer>
  );
}
