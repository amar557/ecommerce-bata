import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function InviteRedirect() {
  const { code } = useParams();

  useEffect(() => {
    const deepLink = `myapp://invite/${code}`;
console.log(code,'the code ')
    const androidStore =
      "https://play.google.com/store/apps/details?id=com.yourname.myapp";

    const iosStore =
      "https://apps.apple.com/app/idYOUR_APP_ID";

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Try opening the app
    window.location.href = deepLink;

    // If app not installed -> go store after 1.5 sec
    const timer = setTimeout(() => {
      window.location.href = isIOS ? iosStore : androidStore;
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div style={{ padding: 30, fontFamily: "Arial", textAlign: "center" }}>
      <h2>Opening App...</h2>
      <p>If it doesn’t open automatically, click below.</p>

      <a
        href={`myapp://invite/${code}`}
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
        Open MyApp
      </a>
    </div>
  );
}
