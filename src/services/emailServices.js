import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendSimpleEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Booking care",
    to: data.reciverEmail,
    subject:
      data.language === "vi"
        ? "Thông tin đặt lịch khám bệnh"
        : "Information to book a medical appointment",
    html: getBodyHTMLEmail(data),
  });
};

const getBodyHTMLEmail = (data) => {
  let result = "";
  if (data.language === "vi") {
    result = `
        <h3>Gửi ${data.patientName},</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${data.time}</b></div>
        <div><b>Bác sĩ: ${data.doctorName}</b></div>

        <p>Nếu các thông tin trên là chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
            <a href=${data.redirectLink} target="_blank">Bấm vào đây</a>
        </div>

        <div>Xin chân thành cảm ơn,</div>
    `;
  }
  if (data.language === "en") {
    result = `
        <h3>Dear ${data.patientName},</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare.</p>
        <p>Information to schedule an appointment:</p>
        <div><b>Time: ${data.time}</b></div>
        <div><b>Doctor: ${data.doctorName}</b></div>

        <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book an appointment.</p>
        <div>
            <a href=${data.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Sincerely,</div>
    `;
  }
  return result;
};

const sendAttachments = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Booking care",
    to: data.email,
    subject: "Kết quả đặt lịch khám bệnh",
    html: getBodyHTMLEmailRemedy(data),
    attachments: [
      {
        filename: "remedy.png",
        content: data.imgBase64.split("base64")[1],
        encoding: "base64",
      },
    ],
  });
};

const getBodyHTMLEmailRemedy = (data) => {
  let result = "";
  if (data.language === "vi") {
    result = `
        <h3>Gửi ${data.patientName},</h3>
        
        <p>Bạn nhận được email này vì đã khám bệnh thành công trên BookingCare.</p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn,</div>
    `;
  }
  if (data.language === "en") {
    result = `
        <h3>Dear ${data.patientName},</h3>
        <p>You received this email because of a successful medical examination on BookingCare.</p>
        <p>Prescription/invoice information is sent in the attached file</p>

        <div>Sincerely,</div>
    `;
  }
  return result;
};

export default { sendSimpleEmail, sendAttachments };
