import 'server-only'

import nodemailer from 'nodemailer';

// Типизация для глобального объекта, чтобы избежать дублирования в dev-режиме
const globalForMail = global as unknown as {
    transporter: nodemailer.Transporter | undefined;
};

const port = parseInt(process.env.SMTP_PORT || '587', 10);

export const transporter =
    globalForMail.transporter ??
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            // Не проверять соответствие домена и валидность сертификата
            rejectUnauthorized: false
        }
        // Опция pool: true заставляет nodemailer поддерживать соединение открытым
        // pool: true,
    });

let isVerified = false;
if (!isVerified) {
    try {
        await transporter.verify();
        isVerified = true;
        console.log('SMTP server is ready');
    } catch (error) {
        console.error('SMTP Verification Error:', error);
        throw new Error('Mail server connection failed');
    }
}


if (process.env.NODE_ENV !== 'production') globalForMail.transporter = transporter;