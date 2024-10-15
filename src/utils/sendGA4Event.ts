import axios from "axios";

const sendGA4Event = async (eventName: string, eventParams: object) => {
  const clientId = Math.random().toString(36).substring(2, 18); // 무작위 ID 생성

  try {
    const response = await axios.post("/api/sendGA4Event", {
      clientId,
      eventName,
      eventParams,
    });
    console.log("GA4 이벤트 전송 성공:", response.data);
  } catch (error) {
    console.error("GA4 이벤트 전송 실패:", error);
  }
};

export default sendGA4Event;
