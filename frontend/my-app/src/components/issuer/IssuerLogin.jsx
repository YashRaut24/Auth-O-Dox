import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginIssuer } from "../../services/issuer/issuerAuth";
import "./IssuerLogin.css";

function IssuerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await loginIssuer(email, password);
            navigate("/issuer/dashboard", { replace: true });
        } catch (requestError) {
            setError(requestError.message || "Invalid issuer credentials");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="issuer-auth-page">
            <section className="issuer-login-card">
                <div className="issuer-login-heading">
                    <Link className="issuer-back-button" to="/">
                        <span aria-hidden="true">←</span>
                        Back to Auth-O-Dox
                    </Link>
                    <div className="issuer-brand">AUTH-O-DOX</div>
                    <p className="issuer-portal-label">Issuer Portal</p>
                    <h1>Sign in to issue certificates</h1>
                    <p>Authorized institutions can securely issue and register certificates.</p>
                </div>

                <form className="issuer-form" onSubmit={handleSubmit}>
                    <label>
                        Institution / Issuer Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && <p className="issuer-form-error">{error}</p>}

                    <button className="issuer-primary-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In as Issuer"}
                    </button>
                </form>

                <p className="issuer-security-note">Only authorized issuers can access certificate issuance.</p>
            </section>
        </main>
    );
}

export default IssuerLogin;
