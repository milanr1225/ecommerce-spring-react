package io.github.milanr1225.ecommerce.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record UpdateQuantityRequest(
        @Min(1) @Max(99) int quantity
) {}