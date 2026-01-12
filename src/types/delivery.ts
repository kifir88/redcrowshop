export interface DeliveryOption {
    calendar_max: number;
    calendar_min: number;
    delivery_date_range: {
        min: string; // "2026-01-05"
        max: string; // "2026-01-05"
    };
    delivery_mode: number;
    delivery_sum: number;
    period_max: number;
    period_min: number;
    tariff_code: number;
    tariff_description: string;
    tariff_name: string;
}
export type DeliveryMethod = 'self_storage' | 'self_showroom' | 'cdek' | 'dhl';