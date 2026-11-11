package io.github.milanr1225.ecommerce.cart;

import io.github.milanr1225.ecommerce.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal User user) {
        return cartService.getCart(user.getId());
    }

    @PostMapping("/items")
    public CartResponse addItem(@AuthenticationPrincipal User user,
                                @Valid @RequestBody AddToCartRequest request) {
        return cartService.addItem(user.getId(), request);
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateQuantity(@AuthenticationPrincipal User user,
                                       @PathVariable Long productId,
                                       @Valid @RequestBody UpdateQuantityRequest request) {
        return cartService.updateQuantity(user.getId(), productId, request);
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(@AuthenticationPrincipal User user,
                                   @PathVariable Long productId) {
        return cartService.removeItem(user.getId(), productId);
    }

    @DeleteMapping
    public CartResponse clear(@AuthenticationPrincipal User user) {
        return cartService.clear(user.getId());
    }
}