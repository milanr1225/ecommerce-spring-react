package io.github.milanr1225.ecommerce.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String name,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}