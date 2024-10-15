import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { clientId, eventName, eventParams } = await request.json();
  const measurementId = "G-28D1ZXMCMR"; // 본인의 GA4 Measurement ID로 대체
  const apiSecret = "ZlLT-LHsRBWXCnXWVfulxQ"; // 본인의 Measurement Protocol API 비밀키로 대체

  try {
    const response = await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: eventParams,
          },
        ],
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    let errorMessage = "알 수 없는 오류가 발생했습니다";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
