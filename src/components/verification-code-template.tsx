import React from "react";

interface EmailTemplateProps {
  code: string;
}

export const VerificationCodeTemplate: React.FC<EmailTemplateProps> = ({
  code,
}) => (
  <div>
    <h1>Your verification code</h1>
    <p>
      link to{" "}
      <a href={`https://shopix.am/api/auth/verify?code=${code}`}>
        link to verify
      </a>{" "}
    </p>
  </div>
);
