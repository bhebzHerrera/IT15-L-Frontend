import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sanitizeEmailInput, sanitizeTextInput } from "../utils/security";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isCoveringEyes = focusedField === "password" || form.password.length > 0;

  const validateForm = () => {
    const nextErrors = {};
    const sanitizedEmail = sanitizeEmailInput(form.email);

    if (!sanitizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    const sanitizedCredentials = {
      email: sanitizeEmailInput(form.email),
      password: sanitizeTextInput(form.password),
    };

    setIsCelebrating(true);

    try {
      await login(sanitizedCredentials);
      window.setTimeout(() => {
        navigate("/app/dashboard", { replace: true });
      }, 900);
    } catch {
      setIsCelebrating(false);
      setLoginError("Login failed. Check your credentials or API connection.");
    }
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
            className={`panda-mascot ${focusedField === "email" ? "look-email" : ""} ${
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

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={errors.email ? "is-invalid" : ""}
          value={form.email}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField("")}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, email: event.target.value }))
          }
          placeholder="name@psu.edu"
          required
        />
        {errors.email ? <p className="form-error invalid-feedback d-block">{errors.email}</p> : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className={errors.password || loginError ? "is-invalid" : ""}
          value={form.password}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField("")}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
          placeholder="********"
          required
        />
        {errors.password ? <p className="form-error invalid-feedback d-block">{errors.password}</p> : null}
        {loginError ? <p className="form-error invalid-feedback d-block">{loginError}</p> : null}

        <button type="submit" disabled={isCelebrating}>
          {isCelebrating ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
