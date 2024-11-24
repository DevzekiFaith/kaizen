"use client";

import React from 'react';
import { PaystackButton } from 'react-paystack';

interface PaymentButtonProps {
    email: string;
    amount: number;
    onSuccess: (reference: PaystackReference) => void;
    onClose: () => void;
}

interface PaystackReference {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    message: string;
    trxref: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
    email, 
    amount, 
    onSuccess, 
    onClose 
}) => {
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
        throw new Error('Paystack public key is not defined');
    }

    const config = {
        email,
        amount: amount * 100, // Convert to kobo
        metadata: {
            custom_fields: [
                {
                    display_name: "Email",
                    variable_name: "email",
                    value: email
                }
            ],
        },
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        text: "Pay Now",
        onSuccess,
        onClose,
        className: "bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
    };

    return <PaystackButton {...config} />;
};


export default PaymentButton;
