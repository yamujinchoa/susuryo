function calculateRevenue() {
  console.log("calculateRevenue");
  var salesAmount = parseFloat(document.getElementById("salesAmount").value);

  // 서비스 이용료 계산
  var serviceFee = calculateServiceFee(salesAmount);

  // 결제망 이용료 계산 (3.3% 고정)
  var paymentFee = Math.round(salesAmount * 0.033);

  // 부가세 계산 (서비스 이용료와 결제망 이용료의 10%)
  var tax = Math.round((serviceFee + paymentFee) * 0.1);

  // 최종 수익금 계산
  var totalCost = serviceFee + paymentFee + tax;
  var totalRevenue = salesAmount - totalCost;

  // 결과를 화면에 표시
  document.getElementById("serviceFeeResult").innerHTML =
    "서비스 이용료: " + numberWithCommas(serviceFee.toFixed(0)) + "원";
  document.getElementById("paymentFeeResult").innerHTML =
    "결제망 이용료: " + numberWithCommas(paymentFee.toFixed(0)) + "원";
  document.getElementById("taxResult").innerHTML =
    "부가세: " + numberWithCommas(tax.toFixed(0)) + "원";
  document.getElementById("totalCostResult").innerHTML =
    "합산 금액: " + numberWithCommas(totalCost.toFixed(0)) + "원";
  document.getElementById("result").innerHTML =
    "최종 수익금: " + numberWithCommas(totalRevenue.toFixed(0)) + "원";
}

function calculateServiceFee(salesAmount) {
  if (salesAmount <= 700000) {
    return Math.round(salesAmount * 0.164); // 1원~70만원: 16.4% 수수료
  } else if (salesAmount <= 2000000) {
    return 114800 + Math.round((salesAmount - 700000) * 0.094); // 70만1원~200만원: 9.4% 수수료
  } else {
    return 237000 + Math.round((salesAmount - 2000000) * 0.044); // 200만1원 이상: 4.4% 수수료
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
