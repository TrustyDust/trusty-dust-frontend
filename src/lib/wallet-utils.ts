/**
 * Trim wallet address untuk menampilkan format yang lebih pendek
 * Format: 0x1234...5678 (default: 6 karakter awal + 4 karakter akhir)
 * 
 * @param address - Wallet address yang akan di-trim
 * @param startLength - Jumlah karakter dari awal yang ditampilkan (default: 6)
 * @param endLength - Jumlah karakter dari akhir yang ditampilkan (default: 4)
 * @returns Trimmed wallet address atau address asli jika terlalu pendek
 */
export function trimWalletAddress(
  address: string | null | undefined,
  startLength = 6,
  endLength = 4,
): string {
  if (!address) return ""
  
  // Jika address terlalu pendek, return as is
  if (address.length <= startLength + endLength) {
    return address
  }

  const start = address.slice(0, startLength)
  const end = address.slice(-endLength)
  
  return `${start}...${end}`
}

