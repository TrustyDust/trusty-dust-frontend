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

/**
 * Validasi Ethereum wallet address
 * Format: 0x diikuti 40 karakter hexadecimal (0-9, a-f, A-F)
 * 
 * @param address - Wallet address yang akan divalidasi
 * @returns true jika valid, false jika tidak valid
 */
export function isValidEthereumAddress(address: string | null | undefined): boolean {
  if (!address) return false
  
  const trimmed = address.trim()
  
  // Check format: 0x diikuti 40 karakter hex
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
  
  return ethereumAddressRegex.test(trimmed)
}

/**
 * Normalize wallet address (trim dan lowercase)
 * 
 * @param address - Wallet address yang akan dinormalisasi
 * @returns Normalized address atau null jika invalid
 */
export function normalizeWalletAddress(address: string | null | undefined): string | null {
  if (!address) return null
  
  const trimmed = address.trim()
  
  if (!isValidEthereumAddress(trimmed)) {
    return null
  }
  
  return trimmed.toLowerCase()
}
