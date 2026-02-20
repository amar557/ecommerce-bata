import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function InviteRedirect() {
  const { code } = useParams();

  useEffect(() => {
    const deepLink = `gymapp.fitness://auth/sign-up?referrerId=${code}`;
    // gymapp.fitness://auth/sign-up?referrerId=b28fe42c-79bf-4f7d-91f8-edb7d5c25aab
    const androidStore = "https://play.google.com/store/apps/details?id=com.gymapp.app";
    const iosStore = "https://apps.apple.com/app/idYOUR_APP_ID";

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Try opening app
    window.location.href = deepLink;

    // If app not installed -> redirect to store after 1.5s
    const timer = setTimeout(() => {
      window.location.href = isIOS ? iosStore : androidStore;
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div style={{ padding: 30, fontFamily: "Arial", textAlign: "center" }}>
      <h2>Opening Gym App...</h2>
      <p>If it doesn’t open automatically, click below.</p>

      <a
        href={`gymapp.fitness://invite/${code}`}
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "12px 18px",
          background: "black",
          color: "white",
          borderRadius: 8,
          textDecoration: "none"
        }}
      >
        Open Gym App
      </a>
    </div>
  );
}
