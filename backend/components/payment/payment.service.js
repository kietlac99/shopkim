import colors from "colors";
import { ERROR_CODE } from "../../constants";
import errorMessage from "../../util/error";
import { STRIPE_SECRET_KEY, STRIPE_API_KEY } from '../../config'

const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Process stripe payments => /api/v1/payment/process
export async function processStripePaymentService (amount) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' }
        });

        const payload = {
            client_secret: paymentIntent.client_secret
        };

        return payload;
    } catch (error) {
        console.log(colors.red(`processPaymentService error: ${error}`));
        return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
}

// Send stripe API KEY => /api/v1/payment/stripeapi
export async function sendStripeApiService () {
    try {

        const payload = {
            stripeApiKey: STRIPE_API_KEY
        };

        return payload;
    } catch (error) {
        console.log(colors.red(`sendStripeApiService error: ${error}`));
        return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
}
