declare global {
    interface Number {
        moneyFormatting(options?: {
            currency?: string
            decimal?: number
        }): string
    }
}

Number.prototype.moneyFormatting = function ({
    currency = "Rp ",
    decimal = 0,
}: {
    currency?: string
    decimal?: number
} = {}): string {
    const value = Number(this)

    const isNegative = value < 0
    const absValue = Math.abs(value)

    // Handle decimal places
    const numericString = absValue.toFixed(decimal)

    const [integerPart, decimalPart = ""] = numericString.split(".")

    // Add thousand separators
    let formattedInt = ""
    for (let i = 0; i < integerPart.length; i++) {
        const n = integerPart.length - i
        formattedInt += integerPart[i]

        if (n > 1 && n % 3 === 1) {
            formattedInt += "."
        }
    }

    let formatted = `${currency}${formattedInt}`

    if (decimal > 0 && decimalPart) {
        formatted += `,${decimalPart}`
    }

    return isNegative ? `- ${formatted}` : formatted
}

export { }
