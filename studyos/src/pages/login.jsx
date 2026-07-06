import { useGoogleLogin } from "@react-oauth/google";
import "./login.css";

export default function Login({ setUser, setToken }) 
{
  const login = useGoogleLogin({
  scope: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.send",
  ].join(" "),

  onSuccess: async (tokenResponse) => {
    setToken(tokenResponse.access_token);

    const user = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    ).then((r) => r.json());

    setUser(user);
  },
});

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>StudyOS</h1>

        <h3>Student Command Center</h3>

        <button className="Gbutton" onClick={() => login()} >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}