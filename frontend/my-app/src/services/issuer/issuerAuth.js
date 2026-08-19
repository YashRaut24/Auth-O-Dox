const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "authodox_issuer_token";
const ISSUER_KEY = "authodox_issuer";

export async function loginIssuer(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/issuer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid issuer credentials");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ISSUER_KEY, JSON.stringify(data.issuer));
    return data;
}

export function getIssuerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredIssuer() {
    try {
        return JSON.parse(localStorage.getItem(ISSUER_KEY) || "null");
    } catch {
        return null;
    }
}

export function clearIssuerSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ISSUER_KEY);
}

export function isIssuerTokenUsable(token = getIssuerToken()) {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role === "issuer" && (!payload.exp || payload.exp * 1000 > Date.now());
    } catch {
        return false;
    }
}

export function issuerApiUrl(path) {
    return `${API_BASE_URL}${path}`;
}
