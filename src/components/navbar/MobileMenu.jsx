"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import NavLinks from "./NavLinks";
import NavAuth from "./NavAuth";

export default function MobileMenu({ open, toggle }) {
  const menuRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    tl.current
      .to(menuRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
      })
      .fromTo(
        ".menu-link",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    if (open) {
      tl.current.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current.reverse();
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-8 opacity-0 pointer-events-none z-40 lg:hidden"
    >
      <div className="flex flex-col items-center gap-5 text-lg text-white font-semibold">
        <NavLinks onClick={toggle} mobile={true} />
        <div className="menu-link">
          <NavAuth />
        </div>
      </div>
    </div>
  );
}
