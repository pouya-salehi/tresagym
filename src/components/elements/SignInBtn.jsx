"use client";
import { BeatLoader } from "react-spinners";
const SignInBtn = ({ loading, onClick, phone }) => {
  return (
    <button
      className="submit"
      onClick={onClick}
      disabled={loading || !phone}
      type="submit"
    >
      {loading ? <BeatLoader size={8} color="#ffffff" /> : "ارسال کد"}
    </button>
  );
};

export default SignInBtn;
