exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };

  try {
    const { amount, currency, email, planName } = JSON.parse(event.body);
    
    // 👇 YAHAN APNI ASLI PLISIO SECRET KEY DAALEIN 👇
    const SECRET_KEY = "CNTfhauOzL-egxSHHxpxalKLCxVjukCu8b4YToxK-PRDe1i7ZD9e_71Y_ukREetE";

    // 👇 YAHAN APNI NETLIFY WEBSITE KA ASLI URL DAALEIN (Webhook ke liye) 👇
    const SITE_URL = "https://animated-pothos-3127ce.netlify.app"; 
    
    // 👇 YAHAN APNA TELEGRAM ID YA ACCOUNT LINK DAALEIN 👇
    // Payment success hote hi user yahan automatically chala jayega
    const TELEGRAM_LINK = "https://t.me/Thunder_Support_Teams"; 

    const callbackUrl = encodeURIComponent(`${SITE_URL}/.netlify/functions/plisioWebhook`);
    const successUrl = encodeURIComponent(TELEGRAM_LINK); // Redirect logic add kar diya
    const orderNumber = encodeURIComponent(`USER_${Date.now()}`);
    const orderName = encodeURIComponent(planName || "VIP Pass"); 

    // URL mein ab success_url bhi jayega
    const apiUrl = `https://api.plisio.net/api/v1/invoices/new?source_currency=USD&source_amount=${amount}&order_number=${orderNumber}&order_name=${orderName}&currency=${currency}&callback_url=${callbackUrl}&success_url=${successUrl}&api_key=${SECRET_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.status === 'success') {
      return { 
        statusCode: 200, 
        headers: { 'Access-Control-Allow-Origin': '*' }, 
        body: JSON.stringify({ success: true, checkoutUrl: data.data.invoice_url }) 
      };
    } else {
      const errorMessage = data?.data?.message || JSON.stringify(data.data) || "Plisio error: Amount might be too low or invalid.";
      return { 
        statusCode: 400, 
        headers: { 'Access-Control-Allow-Origin': '*' }, 
        body: JSON.stringify({ success: false, message: errorMessage }) 
      };
    }
  } catch (error) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ success: false, message: "System error: " + error.message }) };
  }
};