package io.github.milanr1225.ecommerce.order;

import io.github.milanr1225.ecommerce.cart.CartItem;
import io.github.milanr1225.ecommerce.cart.CartItemRepository;
import io.github.milanr1225.ecommerce.catalog.Product;
import io.github.milanr1225.ecommerce.catalog.ProductRepository;
import io.github.milanr1225.ecommerce.user.UserRepository;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByIdAsc(userId).stream()
                .sorted(Comparator.comparing((CartItem i) -> i.getProduct().getId()))
                .toList();

        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        Order order = new Order();
        order.setUser(userRepository.getReferenceById(userId));
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setShippingFullName(request.fullName().trim());
        order.setShippingAddress(request.address().trim());
        order.setShippingCity(request.city().trim());
        order.setShippingPostalCode(request.postalCode().trim());
        order.setShippingCountry(request.country().trim());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (!product.isActive()
                    || productRepository.decreaseStock(product.getId(), cartItem.getQuantity()) == 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Not enough stock for " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setUnitPrice(product.getPrice());
            item.setQuantity(cartItem.getQuantity());
            order.addItem(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotal(total);
        orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);

        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(Long userId) {
        return orderRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long userId, Long orderId) {
        return OrderResponse.from(findOwnedOrder(userId, orderId));
    }

    public OrderResponse cancel(Long userId, Long orderId) {
        Order order = findOwnedOrder(userId, orderId);

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only orders awaiting payment can be cancelled");
        }

        for (OrderItem item : order.getItems()) {
            productRepository.increaseStock(item.getProduct().getId(), item.getQuantity());
        }
        order.setStatus(OrderStatus.CANCELLED);

        return OrderResponse.from(order);
    }

    private Order findOwnedOrder(Long userId, Long orderId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }
}