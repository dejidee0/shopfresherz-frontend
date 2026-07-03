export function SAVED_CARDS_QUERY_KEY(token: string | null | undefined) {
  return ["checkout-saved-cards", token] as const;
}

export function CHECKOUT_ADDRESSES_QUERY_KEY(token: string | null | undefined) {
  return ["checkout-addresses", token] as const;
}
