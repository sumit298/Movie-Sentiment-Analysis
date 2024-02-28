import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, debounceTime = 500) => {
    const [state, setState] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setState(value);
        }, debounceTime);

        return () => clearTimeout(timeoutId);
    }, [value, debounceTime]);

    return state;
};

export default useDebounce;
