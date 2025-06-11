import React from 'react';
import { type Metadata, type NextPage } from 'next';
import { PaymentList } from 'src/components';

export const metadata: Metadata = {
	title: 'Payments',
	description: 'Payments'
};

const PaymentsPage: NextPage = () => {
	return <PaymentList orders={[]} />;
};

export default PaymentsPage;
