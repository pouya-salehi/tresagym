"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NavAuth from "./NavAuth";
import NavLinks from "./NavLinks";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  // effect: detect viewport >= lg (1024px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsLarge(e.matches);
    setIsLarge(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // scroll blur
  useEffect(() => {
    const nav = navRef.current;
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 40 && lastScrollY <= 40) {
        gsap.to(nav, {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.2)",
          duration: 0.5,
        });
      } else if (scrollY <= 40 && lastScrollY > 40) {
        gsap.to(nav, {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(0,0,0,0)",
          duration: 0.5,
        });
      }
      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // debug log to see what's rendered
  useEffect(() => {
    console.log("Navbar render — isLarge:", isLarge, "menuOpen:", menuOpen);
  }, [isLarge, menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(0,0,0,0)" }}
        data-testid="main-navbar"
      >
        {/* سمت چپ: لوگو + لینک‌ها */}
        <div className="flex items-center gap-8">
          {" "}
          {/* اضافه کردن gap-8 */}
          <div className="flex items-center gap-4">
            <h1 className="font-orbitron font-bold text-lg text-white uppercase">
              Tresa Gym
            </h1>
          </div>
          {/* DESKTOP: لینک‌ها */}
          <div className="hidden lg:flex items-center gap-8 text-gray-100 lg:text-white">
            <NavLinks />
          </div>
        </div>

        {/* سمت راست: احراز هویت + همبرگر */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block" data-testid="desktop-auth">
            <NavAuth />
          </div>

          {/* Hamburger */}
          <div className="lg:hidden">
            <HamburgerButton
              open={menuOpen}
              toggle={() => setMenuOpen((s) => !s)}
            />
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} toggle={() => setMenuOpen(false)} />
    </>
  );
}
