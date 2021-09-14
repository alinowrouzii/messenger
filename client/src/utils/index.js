
import { useRef, useState, useEffect } from 'react';

export const useStateRef = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}