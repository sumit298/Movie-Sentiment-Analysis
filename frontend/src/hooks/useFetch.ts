import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

type HttpMethod = "post" | "get" | "put" | "patch";

const useFetch = <T>(url: string, method: HttpMethod) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                let response: AxiosResponse<T[]>;
                switch (method) {
                    case "get":
                        response = await axios.get<T[]>(url);
                        break;
                    case "post":
                        response = await axios.post<T[]>(url);
                        break;
                    case "put":
                        response = await axios.put<T[]>(url);
                        break;
                    case "patch":
                        response = await axios.patch<T[]>(url);
                        break;
                    default:
                        throw new Error("Invalid method specified.");
                }

                setData(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();

        // Clean up function to cancel the request if the component unmounts
        return () => {
            // Cancel the request if it's still ongoing
        };
    }, [url, method]); // Dependency on 'url' and 'method', so it refetches when they change

    return { data, loading, error };
};

export default useFetch;
