import resend from "../lib/resend.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: to,
    subject,
    text,
    html,
  });
};
