import axios from "axios";
import { NextRequest } from "next/server";

const CDEK_API_URL = "https://api.cdek.ru/v2";
const CLIENT_ID = "TCfsmdvHt9OKoxWXlX6Llr8AfuecoXqX";
const CLIENT_SECRET = "2wSzOWb0zXaeJkFxgZUQYQ6fJWNb5W5O";

async function getCdekAuthToken(): Promise<string>
{
  const response = await axios.post(
      `${CDEK_API_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
  );
  return response.data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const token = await getCdekAuthToken();
    const body = await req.json();

    const response = await axios.post(`${CDEK_API_URL}/calculator/tarifflist`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: any) {
    console.error("Ошибка запроса к CDEK API:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
