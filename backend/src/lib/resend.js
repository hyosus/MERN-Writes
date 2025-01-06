import { Resend } from "resend";
import { RESEND_APIKEY } from "../constants/env.js";

const resend = new Resend(RESEND_APIKEY);

// resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: "shaniceyeong@gmail.com",
//   subject: "Hello World",
//   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
// });

export default resend;
