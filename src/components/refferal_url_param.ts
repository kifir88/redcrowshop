"use client";

import { useEffect } from "react";

export const useReferralTracker = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get("referral");

        if (referralCode)
        {
            const expiryTime = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
            //const expiryTime = Date.now() + 5 * 60 * 1000; // 3 mins in milliseconds
            localStorage.setItem("referral_code", JSON.stringify({ code: referralCode, expires: expiryTime }));
        }

        // Cleanup expired referral code
        const storedData = localStorage.getItem("referral_code");
        if (storedData) {
            try {
                const {code, expires} = JSON.parse(storedData);
                if (Date.now() > expires) {
                    localStorage.removeItem("referral_code");
                    console.log("remove expired code: " + code);
                }
            } catch
            {
                localStorage.removeItem("referral_code");
            }
        }
    }, []);
};