import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToCart, fetchCart, removeCartItem, updateCartItem } from '../api/cart'
import { useAuth } from '../auth/useAuth'
import type { Cart } from '../types'

export function useCart() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['cart', user?.id]

  const query = useQuery({
    queryKey,
    queryFn: fetchCart,
    enabled: user !== null,
  })

  const onSuccess = (cart: Cart) => queryClient.setQueryData(queryKey, cart)

  const add = useMutation({
    mutationFn: (productId: number) => addToCart(productId, 1),
    onSuccess,
  })

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess,
  })

  const remove = useMutation({
    mutationFn: removeCartItem,
    onSuccess,
  })

  return {
    cart: user ? query.data : undefined,
    isLoading: user !== null && query.isPending,
    isError: query.isError,
    add,
    update,
    remove,
  }
}