package io.github.milanr1225.ecommerce.catalog;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        int stockQuantity,
        String imageUrl,
        CategoryResponse category
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl(),
                CategoryResponse.from(product.getCategory())
        );
    }
}
