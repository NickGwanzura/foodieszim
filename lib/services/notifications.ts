// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — NOTIFICATION SERVICE
// Email and SMS notifications via SendGrid and Twilio
// ═════════════════════════════════════════════════════════════════════════════

import { Notification, NotificationType, User } from '@/types';

// Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@foodies.co.zw';

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TEMPLATES
// ═════════════════════════════════════════════════════════════════════════════

const notificationTemplates: Record<NotificationType, { 
  subject: string; 
  smsTemplate: string;
  emailTemplate: (data: Record<string, string>) => string;
}> = {
  request_submitted: {
    subject: 'New Purchase Request Submitted',
    smsTemplate: 'Request {requestNumber} submitted for {productName}. Awaiting validation.',
    emailTemplate: (data) => `A new purchase request has been submitted:

Request: ${data.requestNumber}
Product: ${data.productName}
Quantity: ${data.quantity}
Amount: ${data.amount}
Requestor: ${data.requestorName}

Please log in to validate this request.`,
  },
  
  stock_validation_required: {
    subject: 'Stock Validation Required',
    smsTemplate: 'Request {requestNumber} requires stock validation. Product: {productName}',
    emailTemplate: (data) => `Stock validation required:

Request: ${data.requestNumber}
Product: ${data.productName}
Quantity: ${data.quantity}
Current Stock: ${data.stockOnHand}

Please validate stock availability.`,
  },
  
  accountant_validation_required: {
    subject: 'Budget Validation Required',
    smsTemplate: 'Request {requestNumber} ready for budget validation.',
    emailTemplate: (data) => `Budget validation required:

Request: ${data.requestNumber}
Product: ${data.productName}
Amount: ${data.amount}
Branch: ${data.branchName}

Please review for budget compliance.`,
  },
  
  director_approval_required: {
    subject: 'Exception Approval Required',
    smsTemplate: 'URGENT: Request {requestNumber} requires Director approval.',
    emailTemplate: (data) => `Exception approval required:

Request: ${data.requestNumber}
Product: ${data.productName}
Amount: ${data.amount}
Exception Type: ${data.exceptionType}
Reason: ${data.exceptionReason}

This request requires your approval.`,
  },
  
  supplier_alerted: {
    subject: 'Order Ready for Fulfilment',
    smsTemplate: 'New order {requestNumber} for {productName}. Please confirm fulfilment.',
    emailTemplate: (data) => `New order awaiting fulfilment:

Order: ${data.requestNumber}
Product: ${data.productName}
Quantity: ${data.quantity}
Required By: ${data.requiredBy}

Please confirm fulfilment timeline.`,
  },
  
  price_deviation_flagged: {
    subject: 'Price Deviation Detected',
    smsTemplate: 'Price deviation on {productName}. Receipt required.',
    emailTemplate: (data) => `Price deviation requires review:

Product: ${data.productName}
System Price: ${data.systemPrice}
Actual Price: ${data.actualPrice}
Variance: ${data.variancePercent}%

Receipt and justification required.`,
  },
  
  receipt_missing: {
    subject: 'Missing Receipt Notification',
    smsTemplate: 'Receipt missing for {requestNumber}. Please upload.',
    emailTemplate: (data) => `Receipt required:

Request: ${data.requestNumber}
Product: ${data.productName}
Amount: ${data.amount}

Please upload receipt to complete validation.`,
  },
  
  request_denied: {
    subject: 'Request Denied',
    smsTemplate: 'Request {requestNumber} denied. Reason: {reason}',
    emailTemplate: (data) => `Your request has been denied:

Request: ${data.requestNumber}
Product: ${data.productName}
Denied By: ${data.deniedBy}
Reason: ${data.reason}

Please review and resubmit if applicable.`,
  },
  
  delivery_overdue: {
    subject: 'Delivery Overdue Alert',
    smsTemplate: 'Order {requestNumber} delivery overdue. Follow up required.',
    emailTemplate: (data) => `Delivery overdue:

Order: ${data.requestNumber}
Product: ${data.productName}
Expected: ${data.expectedDate}
Supplier: ${data.supplierName}

Please follow up with supplier.`,
  },
  
  stock_critical: {
    subject: 'CRITICAL: Stock Level Alert',
    smsTemplate: 'CRITICAL: {productName} stock critically low. Immediate action required.',
    emailTemplate: (data) => `CRITICAL STOCK ALERT:

Product: ${data.productName}
Current Stock: ${data.stockOnHand}
Reorder Level: ${data.reorderLevel}
Days Cover: ${data.daysCover}

Immediate procurement action required.`,
  },
  
  reorder_breached: {
    subject: 'Reorder Level Breached',
    smsTemplate: '{productName} below reorder level. Please raise request.',
    emailTemplate: (data) => `Reorder level breached:

Product: ${data.productName}
Current Stock: ${data.stockOnHand}
Reorder Level: ${data.reorderLevel}

Please raise purchase request.`,
  },
  
  supplier_price_updated: {
    subject: 'Supplier Price Updated',
    smsTemplate: '{supplierName} updated price for {productName}.',
    emailTemplate: (data) => `Price update notification:

Supplier: ${data.supplierName}
Product: ${data.productName}
Old Price: ${data.oldPrice}
New Price: ${data.newPrice}
Change: ${data.changePercent}%

Effective from: ${data.effectiveDate}`,
  },
  
  order_received: {
    subject: 'Delivery Confirmed',
    smsTemplate: 'Order {requestNumber} received and confirmed.',
    emailTemplate: (data) => `Delivery confirmed:

Order: ${data.requestNumber}
Product: ${data.productName}
Quantity Received: ${data.quantityReceived}
Received By: ${data.receivedBy}

Payment processing will commence.`,
  },
  
  payment_completed: {
    subject: 'Payment Completed',
    smsTemplate: 'Payment for {requestNumber} completed. Ref: {reference}',
    emailTemplate: (data) => `Payment completed:

Request: ${data.requestNumber}
Amount: ${data.amount}
Reference: ${data.reference}
Date: ${data.paymentDate}

Thank you for your business.`,
  },
  
  delivery_confirmed: {
    subject: 'Delivery Confirmation Required',
    smsTemplate: 'Confirm delivery for {requestNumber}.',
    emailTemplate: (data) => `Please confirm delivery:

Order: ${data.requestNumber}
Product: ${data.productName}
Expected: ${data.expectedDate}

Log in to confirm receipt.`,
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION SERVICE CLASS
// ═════════════════════════════════════════════════════════════════════════════

class NotificationService {
  private emailEnabled: boolean;
  private smsEnabled: boolean;

  constructor() {
    this.emailEnabled = !!SENDGRID_API_KEY;
    this.smsEnabled = !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN;
  }

  /**
   * Check service availability
   */
  isEmailEnabled(): boolean {
    return this.emailEnabled;
  }

  isSmsEnabled(): boolean {
    return this.smsEnabled;
  }

  /**
   * Send email via SendGrid
   */
  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    if (!this.emailEnabled) {
      console.warn('Email service not configured');
      return false;
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: FROM_EMAIL, name: 'Foodies Zimbabwe' },
          subject,
          content: [{ type: 'text/plain', value: body }],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Send SMS via Twilio
   */
  private async sendSms(to: string, body: string): Promise<boolean> {
    if (!this.smsEnabled) {
      console.warn('SMS service not configured');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: to,
            From: TWILIO_PHONE_NUMBER,
            Body: body,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('SMS send failed:', error);
      return false;
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(
    user: User,
    type: NotificationType,
    data: Record<string, string>
  ): Promise<{ emailSent: boolean; smsSent: boolean }> {
    const template = notificationTemplates[type];
    const results = { emailSent: false, smsSent: false };

    // Format messages
    let emailBody = template.emailTemplate(data);
    let smsBody = template.smsTemplate;
    
    // Replace placeholders in SMS
    Object.entries(data).forEach(([key, value]) => {
      smsBody = smsBody.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    // Send email if enabled and user wants email
    if (user.notificationSettings?.email !== false && user.email) {
      results.emailSent = await this.sendEmail(user.email, template.subject, emailBody);
    }

    // Send SMS if enabled and user wants SMS
    if (user.notificationSettings?.sms !== false && user.phoneNumber) {
      results.smsSent = await this.sendSms(user.phoneNumber, smsBody);
    }

    return results;
  }

  /**
   * Create in-app notification record
   */
  createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    entityType: 'request' | 'stock' | 'delivery' | 'budget' | 'supplier',
    entityId: string,
    channels: ('email' | 'sms' | 'push' | 'in_app')[] = ['in_app']
  ): Notification {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      channels,
      emailSent: false,
      smsSent: false,
      pushSent: false,
      entityType,
      entityId,
      read: false,
      emailAttempts: 0,
      smsAttempts: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Notify multiple users
   */
  async notifyUsers(
    users: User[],
    type: NotificationType,
    data: Record<string, string>,
    entityType: 'request' | 'stock' | 'delivery' | 'budget' | 'supplier',
    entityId: string
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const user of users) {
      const template = notificationTemplates[type];
      const notification = this.createNotification(
        user.id,
        type,
        template.subject,
        template.smsTemplate.replace(/{(\w+)}/g, (match, key) => data[key] || match),
        entityType,
        entityId,
        ['email', 'sms', 'in_app']
      );

      // Send notifications
      const results = await this.sendNotification(user, type, data);
      notification.emailSent = results.emailSent;
      notification.smsSent = results.smsSent;

      notifications.push(notification);
    }

    return notifications;
  }

  /**
   * Retry failed notifications
   */
  async retryNotification(notification: Notification, user: User): Promise<boolean> {
    // This would retry based on notification type and user preferences
    // Implementation would fetch original data and retry
    console.log('Retrying notification:', notification.id);
    return false;
  }
}

// Export singleton
export const notificationService = new NotificationService();

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Get users to notify based on role and branch
 */
export function getNotificationTargets(
  role: 'shopmanager' | 'storesman' | 'accountant' | 'director' | 'supplier',
  branchId?: string,
  users: User[] = []
): User[] {
  return users.filter(u => 
    u.role === role && 
    u.isActive &&
    (branchId ? u.branchId === branchId : true)
  );
}

/**
 * Format phone number for Zimbabwe
 */
export function formatZimbabwePhone(phone: string): string {
  // Remove non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Ensure starts with country code
  if (cleaned.startsWith('0')) {
    cleaned = '263' + cleaned.substring(1);
  } else if (!cleaned.startsWith('263')) {
    cleaned = '263' + cleaned;
  }
  
  return '+' + cleaned;
}
