import axios from "axios";

const sendPurchaseEvent = async () => {
  const clientId = Math.random().toString(36).substring(2, 18); // Generate a random client ID
  const transactionId = Math.random().toString(36).substring(2, 12); // Generate a random transaction ID
  const items = [
    {
      index: 1,
      item_id: "item123",
      item_name: "Random Item A",
      item_category: "Category123",
      item_variant: "VariantA",
      price: Math.floor(Math.random() * 50000) + 10000,
      quantity: 1,
      tracking_number: "TRACK123",
      affiliation: "https://example.com/itemA",
      img_url: "https://example.com/imageA.jpg",
      component_quantity: 1,
      local_shipping_fee: 5000,
    },
    {
      index: 2,
      item_id: "item456",
      item_name: "Random Item B",
      item_category: "Category456",
      item_variant: "VariantB",
      price: Math.floor(Math.random() * 50000) + 10000,
      quantity: 2,
      tracking_number: "TRACK456",
      affiliation: "https://example.com/itemB",
      img_url: "https://example.com/imageB.jpg",
      component_quantity: 2,
      local_shipping_fee: 7000,
    },
  ];

  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalShipping = items.reduce(
    (sum, item) => sum + item.local_shipping_fee,
    0
  );

  const userProperties = {
    login_status: { value: true },
    woomyshipping_id: { value: "BID123456789" },
    membership: { value: "일반" },
  };

  try {
    const response = await axios.post("/api/sendGA4Event", {
      clientId,
      eventName: "purchase",
      eventParams: {
        currency: "KRW",
        value: totalValue,
        transaction_id: transactionId,
        shipping: totalShipping,
        items,
        service_type: "배송대행", // or "구매대행"
        no_data_photo: true,
        inspection: false,
        small_box: false,
        medium_box: true,
        large_box: false,
        extra_large_box: false,
        combined_packing: true,
        split_delivery: false,
        other: false,
        photo: true,
        repackaging: true,
        transportation_method: "항공",
        fast_delivery: true,
        deposit_payment: true,
      },
      userProperties, // Add user properties here
    });
    console.log("Purchase event sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send purchase event:", error);
  }
};

export default sendPurchaseEvent;
