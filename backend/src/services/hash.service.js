import crypto from "crypto";

function hashCertificate(certificateBuffer){
    
    const hash = crypto
    .createHash("sha256")
    .update(certificateBuffer)
    .digest("hex");


    return hash;
}

export default hashCertificate;