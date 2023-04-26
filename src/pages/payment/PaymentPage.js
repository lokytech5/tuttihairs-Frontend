import axios from 'axios';
import React, { useState } from 'react'
import PaymentGateWay from '../../components/payment/PaymentGateWay';

export default function PaymentPage() {
    const [loading, setLoading] = useState(false);


    const addPaymentGateWayHandler = async (paymentData) => {
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:5000/api/payments/', paymentData);
            const data = response.data;
            console.log(data);
        } catch (error) {
            console.error('Error testing Paystack endpoint:', error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PaymentGateWay
                onAddPayment={addPaymentGateWayHandler}
                isLoading={loading}
            />
        </>

    )
}
