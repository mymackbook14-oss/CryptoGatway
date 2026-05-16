exports.handler = async function(event, context) {
    const PLISIO_API_KEY = "CNTfhauOzL-egxSHHxpxalKLCxVjukCu8b4YToxK-PRDe1i7ZD9e_71Y_ukREetE";
    
    // Amount 10 USD set hai, aap chahe toh isko change kar sakte hain
    const apiUrl = `https://api.plisio.net/api/v1/invoices/new?source_currency=USD&source_amount=10&order_name=PremiumAccess&currency=USDT&api_key=${PLISIO_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.status === "success") {
            return {
                statusCode: 200,
                body: JSON.stringify({ invoiceUrl: data.data.invoice_url }) 
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Failed to generate invoice" })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server Error" })
        };
    }
};