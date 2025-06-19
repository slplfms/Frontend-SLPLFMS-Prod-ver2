export function safeSubtraction(num1: any, num2: any){
    const value1 = parseInt(num1)
    const value2 = parseInt(num2);

    if(isNaN(value1) || isNaN(value2)){
        return 0;
    }


    return value1 - value2

}

interface NumberCurrencyFormatType {
    (amount: number | string): string
}

export const currencyCommaFormatter: NumberCurrencyFormatType = (amount) => Number(amount).toLocaleString();

export const decimalPlaceFormatter: NumberCurrencyFormatType = (amount) => Number(amount).toFixed(2);

export const commaDecimalFormatter: NumberCurrencyFormatType = (amount) => currencyCommaFormatter(Number(decimalPlaceFormatter(Number(amount))));