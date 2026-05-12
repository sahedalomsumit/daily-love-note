// WhatsApp Cloud API Integration


let clientStatus = 'READY'; // For Cloud API, it's virtually always ready once configured

const sendMessage = async (phone, text) => {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId) {
        console.error("Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_ID in environment variables.");
        throw new Error('WhatsApp Cloud API is not configured (missing token or phone ID)');
    }

    if (!phone) {
        throw new Error('Recipient phone number is missing');
    }

    // Format phone number: remove any non-digit characters
    const recipientPhone = phone.toString().replace(/\D/g, '');

    console.log(`Sending message to ${recipientPhone} via WhatsApp Cloud API...`);

    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
    
    const body = {
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: {
            body: text
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("WhatsApp Cloud API Error:", JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || 'Failed to send message via WhatsApp Cloud API');
    }

    console.log("Message sent successfully:", JSON.stringify(data));
    return data;
};

// Mock functions to maintain compatibility with the rest of the app which expects wwebjs methods
const getQR = () => null;
const getPairingCode = () => null;
const getStatus = () => {
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
        return 'AUTHENTICATED';
    }
    return 'DISCONNECTED';
};

const initializeClient = async () => {
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
        clientStatus = 'AUTHENTICATED';
        console.log('WhatsApp Cloud API Client is ready!');
        return { success: true };
    }
    console.warn("WhatsApp Cloud API is missing configuration (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_ID)");
    clientStatus = 'DISCONNECTED';
    return { success: false, error: 'Missing configuration' };
};

const reconnectClient = async () => {
    return initializeClient();
};

module.exports = { getQR, getPairingCode, getStatus, sendMessage, initializeClient, reconnectClient };
