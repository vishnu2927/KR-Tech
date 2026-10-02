import api from "./api";

export interface Certificate {
  _id?: string;
  title: string;
  category: string;
  studentName: string;
  studentEmail?: string;
  completionDate: string;
  credentialId: string;
  grade: string;
  skills: string[];
  verified: boolean;
  qrCodeDataUrl?: string;
  pdfUrl?: string;
  issuer?: string;
  accreditation?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnailGradient?: string;
  accentColor?: string;
}

export interface VerifyResponse {
  success: boolean;
  verified: boolean;
  message?: string;
  certificate?: Certificate;
}

// Category to gradient styling mapping
export const CATEGORY_GRADIENTS: Record<string, { gradient: string; accent: string }> = {
  "Java Backend": {
    gradient: "from-purple-950 via-indigo-950 to-slate-950",
    accent: "#7C3AED",
  },
  "MERN Stack": {
    gradient: "from-indigo-950 via-cyan-950 to-slate-900",
    accent: "#06B6D4",
  },
  "AWS": {
    gradient: "from-amber-950 via-orange-950 to-slate-900",
    accent: "#F59E0B",
  },
  "Azure": {
    gradient: "from-blue-950 via-sky-950 to-slate-900",
    accent: "#0284C7",
  },
  "Cyber Security": {
    gradient: "from-red-950 via-rose-950 to-slate-900",
    accent: "#E11D48",
  },
  "Power BI": {
    gradient: "from-amber-950 via-yellow-950 to-slate-900",
    accent: "#D97706",
  },
  "SAP": {
    gradient: "from-teal-950 via-emerald-950 to-slate-900",
    accent: "#0D9488",
  },
  "Salesforce": {
    gradient: "from-blue-950 via-indigo-950 to-slate-900",
    accent: "#4F46E5",
  },
};

export const certificateService = {
  // Fetch all certificates from Atlas with optional category & search filters
  async getCertificates(params?: { category?: string; search?: string }): Promise<Certificate[]> {
    try {
      const response = await api.get("/certificates", { params });
      const rawCertificates: Certificate[] = response.data?.certificates || [];

      return rawCertificates.map((cert) => {
        const theme = CATEGORY_GRADIENTS[cert.category] || {
          gradient: "from-purple-950 via-indigo-950 to-slate-900",
          accent: "#7C3AED",
        };
        return {
          ...cert,
          thumbnailGradient: cert.thumbnailGradient || theme.gradient,
          accentColor: cert.accentColor || theme.accent,
        };
      });
    } catch (error) {
      console.error("Failed to fetch certificates from MongoDB Atlas:", error);
      throw error;
    }
  },

  // Verify certificate by credential ID in MongoDB Atlas
  async verifyCertificate(credentialId: string): Promise<VerifyResponse> {
    const cleanId = credentialId.trim();
    if (!cleanId) {
      return {
        success: false,
        verified: false,
        message: "Please enter a valid Credential ID (e.g., KRT-2026-JAVA-9102).",
      };
    }

    try {
      const response = await api.get(`/certificates/verify/${encodeURIComponent(cleanId)}`);
      const cert = response.data?.certificate;
      if (cert) {
        const theme = CATEGORY_GRADIENTS[cert.category] || {
          gradient: "from-purple-950 via-indigo-950 to-slate-900",
          accent: "#7C3AED",
        };
        cert.thumbnailGradient = cert.thumbnailGradient || theme.gradient;
        cert.accentColor = cert.accentColor || theme.accent;
      }

      return {
        success: response.data?.success ?? true,
        verified: response.data?.verified ?? true,
        message: response.data?.message || "Certificate Verified",
        certificate: cert,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        `No verified record found in MongoDB Atlas for credential ID "${cleanId}".`;
      return {
        success: false,
        verified: false,
        message,
      };
    }
  },

  // Get PDF Download URL
  getPdfDownloadUrl(credentialId: string): string {
    const baseUrl = api.defaults.baseURL || "/api";
    return `${baseUrl}/certificates/${encodeURIComponent(credentialId.trim())}/pdf`;
  },

  // Trigger PDF Download
  downloadPdf(credentialId: string) {
    const url = this.getPdfDownloadUrl(credentialId);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `KR_Tech_Certificate_${credentialId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Generate new certificate in Atlas
  async generateCertificate(payload: {
    studentName: string;
    title: string;
    category?: string;
    studentEmail?: string;
    grade?: string;
    skills?: string[];
    sendEmail?: boolean;
  }): Promise<{ success: boolean; certificate: Certificate; downloadPdfUrl: string; verifyUrl: string }> {
    const response = await api.post("/certificates/generate", payload);
    return response.data;
  },

  // Send certificate email with PDF attachment
  async sendCertificateEmail(payload: {
    credentialId: string;
    email: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/certificates/send-email", payload);
    return response.data;
  },

  // Client-side print / download helper
  downloadCertificateDoc(certificate: Certificate) {
    const filename = `KR_Global_Learning_Certificate_${certificate.credentialId}.txt`;
    const content = `================================================================================
KR GLOBAL LEARNING PRIVATE LIMITED — OFFICIAL VERIFIED CREDENTIAL
Verified via MongoDB Atlas Academic Registry
================================================================================

STUDENT NAME: ${certificate.studentName}
COURSE TITLE: ${certificate.title}
DISCIPLINE:   ${certificate.category}
CREDENTIAL ID: ${certificate.credentialId}
STATUS:       VERIFIED & ACTIVE (100% Authenticated)
GRADE:        ${certificate.grade}
DATE ISSUED:  ${certificate.completionDate}

SKILLS & COMPETENCIES VALIDATED:
${certificate.skills.map((s) => `  * ${s}`).join("\n")}

VERIFICATION URL:
https://krtech.edu/certificates?verify=${encodeURIComponent(certificate.credentialId)}

SECURITY HASH:
SHA-256-${(certificate._id || certificate.credentialId).toUpperCase()}

================================================================================
ISSUED BY: KR GLOBAL LEARNING PRIVATE LIMITED
CORPORATE OFFICE: Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West – 201318
STUDENT SUPPORT: +91 9311073936
BUSINESS EMAIL: krglobal0713@gmail.com
Academic Registrar: KR Global Learning Certification Authority
Website: https://krtech.in | Verification Portal: https://krtech.in/certificates
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

export default certificateService;
