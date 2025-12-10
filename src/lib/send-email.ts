import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode | Promise<React.ReactNode>,
) => {
  const templateResolve = Promise.resolve(template);

  const { data, error } = await resend.emails.send({
    from: "Chat <onboarding@resend.dev>",
    to,
    subject,
    react: templateResolve,
  });

  if (error) {
    throw error;
  }

  return data;
};
