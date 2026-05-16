exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };

  try {
    // Frontend se bheja gaya data yahan aayega, ab isme planName bhi hai
    const { amount, currency, email, planName } = JSON.parse(event.body);
    
    // 👇 1. YAHAN APNI ASLI PLISIO SECRET KEY DAALEIN 👇
    const SECRET_KEY = "CNTfhauOzL-egxSHHxpxalKLCxVjukCu8b4YToxK-PRDe1i7ZD9e_71Y_ukREetE";

    // 👇 2. YAHAN APNI NETLIFY WEBSITE KA ASLI URL DAALEIN 👇
    const SITE_URL = "https://animated-pothos-3127ce.netlify.app"; 
    
    const callbackUrl = encodeURIComponent(`${SITE_URL}/.netlify/functions/plisioWebhook`);
    const orderNumber = encodeURIComponent(`USER_${Date.now()}`);
    
    // Jo plan user ne select kiya hai, wahi naam aayega, warna default "VIP Pass"
    const orderName = encodeURIComponent(planName || "VIP Pass"); 

    // URL mein exact amount aur plan name bheja ja raha hai
    const apiUrl = `https://api.plisio.net/api/v1/invoices/new?source_currency=USD&source_amount=${amount}&order_number=${orderNumber}&order_name=${orderName}&currency=${currency}&callback_url=${callbackUrl}&api_key=${SECRET_KEY}`;

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