import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'unovaconsultingfirstafrica@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});
    // user: 'unovaconsultingfirstafrica@gmail.com',
    // pass: process.env.EMAIL_PASSWORD
  


export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, teamSize, message } = data;

    // Store in Firestore
    await addDoc(collection(db, "contactMessages"), {
      name,
      email,
      company,
      teamSize,
      message,
      timestamp: serverTimestamp(),
      status: "unread"
    });

    // Send email notification
    const emailHtml = `
      <div>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${teamSize ? `<p><strong>Team Size:</strong> ${teamSize}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;

    await transporter.sendMail({
      from: 'unovaconsultingfirstafrica@gmail.com',
      to: 'unovaconsultingfirstafrica@gmail.com',
      subject: 'New Contact Form Submission',
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
