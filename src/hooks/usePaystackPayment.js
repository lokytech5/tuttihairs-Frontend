/* global PaystackPop */
import React, {useState} from 'react'


export default function usePaystackPayment({ userEmail, totalAmount, paymentGateWayHandler, verifyTransactionHandler, callbackUrl, orderId, clearCart = () => { }  }) {
    const publicKey = 'pk_test_41816d5fd62ebbbab7f98baf69fb824c5e6be916'; // your public key
    const [payStackPopupClosed, setPayStackPopupClosed] = useState(false);

    console.log('Attempting to pay with Paystack');
    const payWithPaystack = async () => {
        try {
            const paymentData = {
                email: userEmail,
                amount: totalAmount,
            };

            console.log('Running paymentGatewayHandler');
            const paymentResponse = await paymentGateWayHandler(paymentData);
            console.log('paymentGatewayHandler completed');
            console.log(paymentResponse.data)

            const authorizationUrl = paymentResponse.data.authorization_url;

            var handler = PaystackPop.setup({
                key: publicKey,
                email: userEmail,
                amount: totalAmount * 100,
                callback: function (response) {
                    verifyTransactionHandler(response.reference) //verify the transaction using the reference
                    if (callbackUrl) {
                        Promise.all([clearCart(), callbackUrl(orderId)])
                            .then(() => {
                                window.location = '/thankyou?reference=' + response.reference;
                            })
                            .catch(err => {
                                console.error('Error verifying transaction:', err.message);
                            })
                    }
                },
                onclose: function () {
                    setPayStackPopupClosed(true);
                },
            });

            handler.openIframe();
        } catch (error) {
            console.error('Error initializing Paystack transaction:', error.message);
        }
    };

    return { payWithPaystack }
}
