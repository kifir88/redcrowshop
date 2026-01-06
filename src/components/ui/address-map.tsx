'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/20/solid';

// Dynamic import of LeafletMap with SSR disabled to avoid window not defined error
const LeafletMap = dynamic(() => import('./leaflet-map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-gray-500">Загрузка карты...</div>
        </div>
    ),
});

export interface AddressResult {
    lat: number;
    lng: number;
    displayName: string;
    address?: {
        city?: string;
        state?: string;
        country?: string;
        country_code?: string;
        postcode?: string;
        road?: string;
        house_number?: string;
    };
}

interface AddressMapProps {
    onAddressSelect: (address: AddressResult) => void;
    initialPosition?: LatLngExpression;
    height?: string;
}

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
    address: {
        city?: string;
        state?: string;
        country?: string;
        country_code?: string;
        postcode?: string;
        road?: string;
        house_number?: string;
        village?: string;
        town?: string;
        municipality?: string;
    };
}

export default function AddressMap({
    onAddressSelect,
    initialPosition = [43.2220, 76.8512] as LatLngExpression, // Almaty default
    height = '400px',
}: AddressMapProps) {
    const [position, setPosition] = useState<LatLngExpression>(initialPosition);
    const [address, setAddress] = useState<string>('');
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Reverse geocoding to get address from coordinates
    const fetchAddressFromCoords = useCallback(async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`
            );
            const data = await response.json();

            if (data && data.display_name) {
                const addressData = data as NominatimResult;
                setAddress(data.display_name);
                onAddressSelect({
                    lat,
                    lng,
                    displayName: data.display_name,
                    address: {
                        city: addressData.address.city || addressData.address.town || addressData.address.village,
                        state: addressData.address.state,
                        country: addressData.address.country,
                        country_code: addressData.address.country_code,
                        postcode: addressData.address.postcode,
                        road: addressData.address.road,
                        house_number: addressData.address.house_number,
                    },
                });
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    }, [onAddressSelect]);

    // Search addresses using Nominatim
    const searchAddress = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ru`
            );
            const results = await response.json();
            setSearchResults(results as NominatimResult[]);
            setShowResults(results.length > 0);
        } catch (error) {
            console.error('Error searching address:', error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Handle location selection from map click
    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        fetchAddressFromCoords(lat, lng);
    }, [fetchAddressFromCoords]);

    // Handle search result selection
    const handleSearchResultClick = (result: NominatimResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setPosition([lat, lng]);
        setAddress(result.display_name);
        setShowResults(false);

        onAddressSelect({
            lat,
            lng,
            displayName: result.display_name,
            address: {
                city: result.address.city || result.address.town || result.address.village,
                state: result.address.state,
                country: result.address.country,
                country_code: result.address.country_code,
                postcode: result.address.postcode,
                road: result.address.road,
                house_number: result.address.house_number,
            },
        });
    };

    return (
        <div className="relative w-full" style={{ height }}>
            {/* Search input */}
            <div className="absolute top-2 right-2 z-[1000] max-w-lg">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Поиск адреса..."
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            searchAddress(e.target.value);
                        }}
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowResults(true);
                            }
                        }}
                        onBlur={() => {
                            // Delay hiding results to allow click on result
                            setTimeout(() => setShowResults(false), 200);
                        }}
                        className="pl-[40px] pr-2"
                    />
                    {isSearching && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Search results dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto z-[1001]">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                                onClick={() => handleSearchResultClick(result)}
                            >
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-900">{result.display_name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <LeafletMap
                center={position}
                onLocationSelect={handleLocationSelect}
            />

            {/* Selected address display */}
            {address && (
                <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white/95 backdrop-blur-sm rounded-md p-3 shadow-lg border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Выбранный адрес:</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1 ml-6">{address}</p>
                </div>
            )}
        </div>
    );
}

