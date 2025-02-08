import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface WeatherAlert {
  level: 'high' | 'medium' | 'low';
  message: string;
  risks: string[];
  recommendations: string[];
}

export async function sendWeatherAlert(to: string, alert: WeatherAlert) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Weather Alerts <alerts@yourdomain.com>',
      to: [to],
      subject: `${alert.level.toUpperCase()} Weather Alert`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${
            alert.level === 'high' 
              ? '#FEE2E2' 
              : alert.level === 'medium' 
              ? '#FEF3C7' 
              : '#DBEAFE'
          }; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: ${
              alert.level === 'high'
                ? '#991B1B'
                : alert.level === 'medium'
                ? '#92400E'
                : '#1E40AF'
            }; margin-top: 0;">
              ${alert.level.toUpperCase()} Weather Alert
            </h1>
            <p style="color: ${
              alert.level === 'high'
                ? '#B91C1C'
                : alert.level === 'medium'
                ? '#B45309'
                : '#1E3A8A'
            };">${alert.message}</p>
          </div>

          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px;">
            <h2 style="color: #111827; margin-top: 0;">Current Risks:</h2>
            <ul style="color: #374151;">
              ${alert.risks.map(risk => `<li>${risk}</li>`).join('')}
            </ul>

            <h2 style="color: #111827;">Safety Recommendations:</h2>
            <ul style="color: #374151;">
              ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 20px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 14px;">
              This is an automated weather alert. Please monitor local news and official channels for the most up-to-date information.
            </p>
            <p style="color: #6B7280; font-size: 14px;">
              To unsubscribe from these alerts, click <a href="[unsubscribe_url]" style="color: #3B82F6;">here</a>.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendVerificationEmail(to: string, verificationCode: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Weather Alerts <alerts@yourdomain.com>',
      to: [to],
      subject: 'Verify your email for Weather Alerts',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #EFF6FF; padding: 20px; border-radius: 8px;">
            <h1 style="color: #1E40AF; margin-top: 0;">Verify Your Email</h1>
            <p style="color: #1E3A8A;">
              Thank you for subscribing to Weather Alerts. To complete your subscription, please enter the following verification code:
            </p>
            <div style="background-color: #DBEAFE; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <code style="font-size: 24px; color: #1E40AF; letter-spacing: 4px;">
                ${verificationCode}
              </code>
            </div>
            <p style="color: #1E3A8A;">
              This code will expire in 1 hour. If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}