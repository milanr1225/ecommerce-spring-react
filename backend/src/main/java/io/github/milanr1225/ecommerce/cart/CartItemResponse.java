package io.github.milanr1225.ecommerce.cart;

import io.github.milanr1225.ecommerce.catalog.Product;
import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String slug,
        String name,
        String imageUrl,
        BigDecimal unitPrice,
        int quantity,
        int stockQuantity,
        BigDecimal lineTotal
) {
    public static CartItemResponse from(CartItem item) {
        Product p = item.getProduct();
        return new CartItemResponse(
                p.getId(),
                p.getSlug(),
                p.getName(),
                p.getImageUrl(),
                p.getPrice(),
                item.getQuantity(),
                p.getStockQuantity(),
                p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}