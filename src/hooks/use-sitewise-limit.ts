import * as React from "react";

const storageKey = "siteWiseLimits"
export function useLimits() {
    const [limits, setLimits] = React.useState(() => {
        const value = localStorage.getItem(storageKey)
        if (value !== null) {
            return JSON.parse(value)
        }
        return ""
    })

    React.useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(limits))
    }, [limits])

    return [limits, setLimits]
}