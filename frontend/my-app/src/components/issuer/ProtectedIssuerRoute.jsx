import { Navigate, useLocation } from "react-router-dom";
import { clearIssuerSession, isIssuerTokenUsable } from "../../services/issuer/issuerAuth";

function ProtectedIssuerRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem("authodox_issuer_token");

    if (!isIssuerTokenUsable(token)) {
        clearIssuerSession();
        return <Navigate to="/issuer/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default ProtectedIssuerRoute;
