package io.github.milanr1225.ecommerce.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        @NotBlank @Size(max = 150) String fullName,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 100) String city,
        @NotBlank @Size(max = 20) String postalCode,
        @NotBlank @Size(max = 100) String country
) {}