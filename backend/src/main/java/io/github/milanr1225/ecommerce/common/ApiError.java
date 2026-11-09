package io.github.milanr1225.ecommerce.common;

import java.time.Instant;
import java.util.Map;

public record ApiError(
        int status,
        String message,
        Map<String, String> errors,
        Instant timestamp
) {}