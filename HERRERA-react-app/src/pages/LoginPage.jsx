import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isCoveringEyes = focusedField === "password" || form.password.length > 0;

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsCelebrating(true);
    await login(form);
    window.setTimeout(() => {
      navigate("/app/dashboard", { replace: true });
    }, 900);
  };

  return (
    <div className="login-screen">
      <div className="login-hero">
        <h1>Procrastination State University</h1>
        <p>
          Why do today what you can panic about tomorrow; Four years of knowledge in
          four hours.
        </p>
      </div>

      <form className="login-panel glass-card" onSubmit={onSubmit}>
        <div className="panda-wrap">
          <div
            className={`panda-mascot ${focusedField === "username" ? "look-email" : ""} ${
              isCoveringEyes ? "cover-eyes" : ""
            } ${isCelebrating ? "celebrate" : ""}`}
          >
            <span className="panda-ear panda-ear-left" />
            <span className="panda-ear panda-ear-right" />
            <div className="panda-face">
              <span className="panda-eye-patch panda-eye-patch-left">
                <i className="panda-eye-pupil" />
              </span>
              <span className="panda-eye-patch panda-eye-patch-right">
                <i className="panda-eye-pupil" />
              </span>
              <span className="panda-nose" />
              <span className="panda-mouth" />
            </div>
            <span className="panda-paw panda-paw-left" />
            <span className="panda-paw panda-paw-right" />
            <span className="panda-spark panda-spark-left">✨</span>
            <span className="panda-spark panda-spark-right">✨</span>
          </div>
        </div>

        <div className="login-panel-head">
          <div className="mark-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2>Welcome Procrastinians</h2>
            <p>Later is our specialty</p>
          </div>
        </div>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={form.username}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField("")}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, username: event.target.value }))
          }
          placeholder="registrar.admin"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField("")}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
          placeholder="********"
          required
        />

        <button type="submit" disabled={isCelebrating}>
          {isCelebrating ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
