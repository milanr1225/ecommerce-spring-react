package io.github.milanr1225.ecommerce.order;

import io.github.milanr1225.ecommerce.user.User;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@AuthenticationPrincipal User user,
                                  @Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(user.getId(), request);
    }

    @GetMapping
    public List<OrderResponse> orders(@AuthenticationPrincipal User user) {
        return orderService.getOrders(user.getId());
    }

    @GetMapping("/{id}")
    public OrderResponse order(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return orderService.getOrder(user.getId(), id);
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return orderService.cancel(user.getId(), id);
    }
}