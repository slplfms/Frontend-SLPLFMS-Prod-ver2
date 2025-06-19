export const RenderCell = (params: any) => {
    if (['dayName'].includes(params.id)) {
        return params.value;
    }

    const value = +params.value
    if (!params.value || isNaN(value)) {
        return " - "
    }

    return Number.isInteger(value) ? value : value.toFixed(2)
}