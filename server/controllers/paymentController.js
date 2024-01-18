import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import crypto from 'crypto'


dotenv.config();

const KEY_ID = process.env.KEY_ID;
const KEY_SECRET = process.env.KEY_SECRET;




export const orders = async (req, res) => {
    try {
        let instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })

        let options = {
            amount: req.body.amount * 100,
            currency: "INR"
        }

        instance.orders.create(options, function (err, order) {
            if (err) {
                return res.json({ error: "Server error" })
            } else {
                return res.json({ success: "order created", data: order })
            }
        })

    } catch (error) {
        res.status(500).json(error, "error while calling orders api")
    }

}




export const verify = async (req, res) => {
    try {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === req.body.response.razorpay_signature) {
            res.send({ code: 200, message: 'Sign Valid', });
        } else {

            res.send({ code: 500, message: 'Sign Invalid' });
        }
    } catch (error) {
        req.status(500).json(error, "error while calling verifyPayment api")
    }
}
