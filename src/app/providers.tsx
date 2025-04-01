'use client';

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import {useReferralTracker} from "@/components/refferal_url_param";

const queryClient = new QueryClient()

const Providers = ({children}: {children: React.ReactNode}) => {

    useReferralTracker(); // Track referral codes when the layout mounts


    return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{}}
      />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </>
  )
}

export default Providers;