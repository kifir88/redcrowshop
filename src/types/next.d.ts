// types/next.ts
export type AppPageProps<P = {}> = {
    params: Promise<P>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};