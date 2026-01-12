'use server'

import axios, { AxiosInstance } from "axios";
import redis from "@/libs/redis";


const CACHE_TTL = 86400

async function getCdekAuthToken(): Promise<string> {

    let token = await redis?.get('cdek_token')
    if (token)
        return token
    const response = await axios.post(
        `${process.env.CDEK_API_URL}/oauth/token`,
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.CDEK_CLIENT_ID ?? '',
            client_secret: process.env.CDEK_CLIENT_SECRET ?? ''
        }),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
    );
    redis?.set('cdek_token', response.data.access_token, "EX", response.data.expires_in)

    return response.data.access_token;
}

async function getApiInstance(): Promise<AxiosInstance> {
    const token = await getCdekAuthToken();

    return axios.create({
        baseURL: process.env.CDEK_API_URL,

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },


    });

}


export async function getRegions(params: { country_codes: string; }) {
    const cache_key = `cdek_regions_${params.country_codes}`;
    try {
        let cached_data = await redis?.get(cache_key)
        if (cached_data)
            return cached_data

        const api = await getApiInstance();
        const response = await api.get('/location/regions', { params })
        redis.set(cache_key, response.data, 'EX', CACHE_TTL)
        return response.data
    } catch (error: any) {
        console.error("Ошибка запроса к CDEK API:", error.response?.data || error.message);
    }
}


export async function getPostcodes(params: {
    code: number
}) {
    const cache_key = `cdek_postcodes_${params.code}`;
    try {
        let cached_data = await redis?.get(cache_key)
        if (cached_data)
            return JSON.parse(cached_data)
        const api = await getApiInstance();
        let response = await api.get('/location/postalcodes', { params })
        const data = response.data.postal_codes
        redis.set(cache_key, JSON.stringify(data), 'EX', CACHE_TTL)
        return data
    } catch (error: any) {
        console.error("Ошибка запроса к CDEK API:", error.response?.data || error.message);
    }
}


export async function getCities(params: {
    page?: number,
    size?: number,
    country_codes: string[],
    region_code: number
}) {
    const cache_key = `cdek_cities_${params.region_code}`;
    try {
        let cached_data = await redis?.get(cache_key)
        if (cached_data)
            return JSON.parse(cached_data)
        const api = await getApiInstance();

        let response;
        let page = 0
        let all_data = new Array();
        do {
            response = await api.get('/location/cities', { params: { ...params, page, size: 1000 } })
            all_data = all_data.concat(response.data)
            page++
            console.log('load page', page, response.data.length)
        } while (response.data.length == 1000)


        redis.set(cache_key, JSON.stringify(all_data), 'EX', CACHE_TTL)
        return all_data
    } catch (error: any) {
        console.error("Ошибка запроса к CDEK API:", error.response?.data || error.message);
    }
}

export async function tariffList(body: any) {
    try {
        const api = await getApiInstance();
        let response = await api.post('/calculator/tarifflist', body)
        return {
            success: true,
            data: JSON.parse(JSON.stringify(response.data))
        };
    } catch (error: any) {
        console.error("Ошибка запроса к CDEK API:", error.response?.data || error.message);

        // 2. ВМЕСТО new Response возвращаем простой объект с ошибкой
        return {
            success: false,
            error: error.response?.data || error.message,
            status: 500
        };
    }
}
