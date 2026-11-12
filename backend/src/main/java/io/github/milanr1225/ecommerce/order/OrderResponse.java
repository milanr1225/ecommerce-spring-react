package io.github.milanr1225.ecommerce.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal total,
        String fullName,
        String address,
        String city,
        String postalCode,
        String country,
        Instant createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotal(),
                order.getShippingFullName(),
                order.getShippingAddress(),
                order.getShippingCity(),
                order.getShippingPostalCode(),
                order.getShippingCountry(),
                order.getCreatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList()
        );
    }
}