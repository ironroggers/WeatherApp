import { CONFIG } from '../config/env';

interface CityResult {
    city: string;
    country: string;
    countryCode: string;
}

export const searchCities = async (query: string): Promise<CityResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(
            `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=10&sort=-population`,
            {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': CONFIG.RAPID_API_KEY,
                    'X-RapidAPI-Host': CONFIG.RAPID_API_HOST
                }
            }
        );

        const data = await response.json();
        
        return data.data.map((item: any) => ({
            city: item.name,
            country: item.country,
            countryCode: item.countryCode
        }));
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}; 