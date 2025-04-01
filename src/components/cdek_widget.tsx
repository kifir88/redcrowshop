'use client';
import { useEffect, useRef, useCallback } from 'react';
import {Button} from "flowbite-react";

interface CDEKWidgetType {
    open: () => void; // Method to open the widget
}

const CdekWidget = (): JSX.Element => {
    // Create a ref to store the widget instance
    const widget = useRef<CDEKWidgetType | null>(null);

    // Function to log errors
    const logError = (message: string, error: any) => {
        console.error(message, error);
    };

    // Function to initialize the CDEK widget
    const initializeWidget = useCallback(() => {
        setTimeout(() => {
            if (window.CDEKWidget) {
                try {
                    widget.current = new window.CDEKWidget(getWidgetConfig());
                } catch (error) {
                    console.error('Error initializing CDEK Widget:', error);
                }
            } else {
                console.error("CDEKWidget is not available");
            }
        }, 1000);
    }, []);

    // Widget configuration
    const getWidgetConfig = () => ({
        apiKey: process.env.PUBLIC_YANDEX_MAPS_API_KEY, // API key for Yandex Maps
        canChoose: true, // Ability to choose the pickup point
        servicePath: '/sapi/service.php', // Path to the PHP file
        hideFilters: {
            have_cashless: false, // Control visibility of the "Cashless Payment" filter
            have_cash: false, // Control visibility of the "Cash Payment" filter
            is_dressing_room: false, // Control visibility of the "Dressing Room Available" filter
            type: false, // Display the "Pickup Point Type" filter
        },
        debug: true, // Enable debug information output
        defaultLocation: 'Москва', // Default address
        lang: 'rus', // Widget language
        hideDeliveryOptions: {
            office: false, // Ability to choose delivery to the pickup point
            door: true, // Hide delivery to the door
        },
        popup: true, // Open the widget in a modal window

        // Function called after the widget finishes loading
        onReady: () => console.log('Widget is ready'),
        // Function called after the customer selects a pickup point
        onChoose: (delivery: string, rate: string, address: string) => {
            console.log(delivery, rate, address);
        },
    });

    useEffect(() => {
        if (document.readyState === 'complete') {
            initializeWidget();
        } else {
            window.addEventListener('load', initializeWidget);
        }

        return () => {
            window.removeEventListener('load', initializeWidget);
        };
    }, [initializeWidget]);

    return (
        <div className="widget-container">
        <Button
            className="font-medium text-base"
            onClick={() => {
                if (widget.current) {
                    try {
                        widget.current.open();
                    } catch (error) {
                        logError('Error opening CDEK Widget:', error);
                    }
                }
            }}
        >
        Open CDEK widget
        </Button>
    </div>
);
};

export default CdekWidget;