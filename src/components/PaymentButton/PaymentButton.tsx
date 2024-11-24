// "use client";

// import React from 'react';

// interface PaymentButtonProps {
//   amount: number; // Amount in kobo
//   email: string; // User's email
// }

// interface PaystackPop {
//   setup: (options: {
//     key: string;
//     email: string;
//     amount: number;
//     currency: string;
//     ref: string;
//     metadata: {
//       custom_fields: Array<{
//         display_name: string;
//         variable_name: string;
//         value: string;
//       }>;
//     };
//     callback: (response: PaystackResponse) => void;
//     onClose: () => void;
//   }) => PaystackHandler;
// }
// interface PaystackResponse {
//   reference: string; // Add other properties as needed
// }

// interface PaystackHandler {
//   openIframe: () => void;
// }

// // Extend the Window interface to include PaystackPop
// declare global {
//   interface Window {
//     PaystackPop: PaystackPop;
//   }
// }
// const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, email }) => {
//   const payWithPaystack = () => {
//     if (typeof window !== 'undefined' && window.PaystackPop) {
//       const handler: PaystackHandler = window.PaystackPop.setup({
//         key: 'YOUR_PUBLIC_KEY',
//         email,
//         amount,
//         currency: 'NGN',
//         ref: 'ref' + Math.floor(Math.random() * 1000000 + 1),
//         metadata: {
//           custom_fields: [
//             {
//               display_name: "Mobile Number",
//               variable_name: "mobile_number",
//               value: "08012345678",
//             },
//           ],
//         },
//         callback: (response: PaystackResponse) => {
//           alert('Payment successful! Reference: ' + response.reference);
//         },
//         onClose: () => {
//           alert('Transaction was not completed, window closed.');
//         },
//       });

//       handler.openIframe();
//     }
//   };

//   return (
//     <button
//       onClick={payWithPaystack}
//       className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
//     >
//       Buy Coins
//     </button>
//   );
// };export default PaymentButton; 