"use client";
import { BeatLoader } from "react-spinners";
const SignUpBtn = ({ loading, onClick }) => {
  return (
    <button
      className="submit"
      onClick={onClick}
      disabled={loading}
      type="submit"
    >
      {loading ? <BeatLoader size={8} color="#ffffff" /> : "ارسال کد"}
    </button>
  );
};

export default SignUpBtn;
