import * as PaymentService from './payment.service';

export async function processStripePaymentController (req, res) {
    try {
        const { amount } = req.body;
        const process = await PaymentService.processStripePaymentService(amount);
        return res.RH.success(process);

    } catch (error) {
        return res.RH.error(error);
    }
}

export async function sendStripeApiController (req, res) {
    try {
        const process = await PaymentService.sendStripeApiService();
        return res.RH.success(process);

    } catch (error) {
        return res.RH.error(error);
    }
}
