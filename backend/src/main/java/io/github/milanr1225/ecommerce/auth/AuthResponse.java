package io.github.milanr1225.ecommerce.auth;

import io.github.milanr1225.ecommerce.user.UserResponse;

public record AuthResponse(String token, UserResponse user) {}
