// src/app/page.tsx
"use client"; // 이 파일을 Client Component로 설정

import { useState } from "react";

export default function HomePage() {
  const [salesAmount, setSalesAmount] = useState<string>("");
  const [serviceFeeResult, setServiceFeeResult] = useState<string>("");
  const [paymentFeeResult, setPaymentFeeResult] = useState<string>("");
  const [taxResult, setTaxResult] = useState<string>("");
  const [totalCostResult, setTotalCostResult] = useState<string>("");
  const [totalRevenueResult, setTotalRevenueResult] = useState<string>("");

  const calculateRevenue = () => {
    const amount = parseFloat(salesAmount);
    const serviceFee = calculateServiceFee(amount);
    const paymentFee = Math.round(amount * 0.033);
    const tax = Math.round((serviceFee + paymentFee) * 0.1);
    const totalCost = serviceFee + paymentFee + tax;
    const totalRevenue = amount - totalCost;

    setServiceFeeResult(`서비스 이용료: ${numberWithCommas(serviceFee)}원`);
    setPaymentFeeResult(`결제망 이용료: ${numberWithCommas(paymentFee)}원`);
    setTaxResult(`부가세: ${numberWithCommas(tax)}원`);
    setTotalCostResult(`합산 금액: ${numberWithCommas(totalCost)}원`);
    setTotalRevenueResult(`최종 수익금: ${numberWithCommas(totalRevenue)}원`);
  };

  // amount 타입을 명시적으로 number로 지정
  const calculateServiceFee = (amount: number): number => {
    if (amount <= 700000) {
      return Math.round(amount * 0.164);
    } else if (amount <= 2000000) {
      return 114800 + Math.round((amount - 700000) * 0.094);
    } else {
      return 237000 + Math.round((amount - 2000000) * 0.044);
    }
  };

  const numberWithCommas = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main>
      <div className="container mt-5">
        <section className="form-group">
          <label htmlFor="salesAmount">판매 금액 (₩):</label>
          <input
            type="number"
            className="form-control"
            id="salesAmount"
            placeholder="판매 금액을 입력하세요"
            value={salesAmount}
            onChange={(e) => setSalesAmount(e.target.value)}
          />
        </section>
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={calculateRevenue}
        >
          계산하기
        </button>
        <section id="results" className="mt-4 p-3 bg-white border rounded">
          <p className="text-info">{serviceFeeResult}</p>
          <p className="text-info">{paymentFeeResult}</p>
          <p className="text-info">{taxResult}</p>
          <p className="text-info">{totalCostResult}</p>
          <p className="text-info">{totalRevenueResult}</p>
        </section>
      </div>
    </main>
  );
}
