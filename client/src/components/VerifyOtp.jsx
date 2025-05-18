import React, { useState } from 'react';

const OTPVerify = ({ confirmation, setUser }) => {
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmation.confirm(otp);
      setUser({ phone: result.user.phoneNumber });
      alert("Phone Verified Successfully");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="otp-verify">
      <h2>Enter OTP</h2>
      <form onSubmit={handleVerifyOTP}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default OTPVerify;
