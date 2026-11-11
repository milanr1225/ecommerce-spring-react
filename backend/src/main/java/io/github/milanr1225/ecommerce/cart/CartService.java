package io.github.milanr1225.ecommerce.cart;

import io.github.milanr1225.ecommerce.catalog.Product;
import io.github.milanr1225.ecommerce.catalog.ProductRepository;
import io.github.milanr1225.ecommerce.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        List<CartItemResponse> items = cartItemRepository.findByUserIdOrderByIdAsc(userId).stream()
                .map(CartItemResponse::from)
                .toList();
        return CartResponse.of(items);
    }

    public CartResponse addItem(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.productId())
                .filter(Product::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .orElseGet(() -> newItem(userId, product));

        int newQuantity = item.getQuantity() + request.quantity();
        checkStock(product, newQuantity);

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    public CartResponse updateQuantity(Long userId, Long productId, UpdateQuantityRequest request) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item is not in the cart"));

        checkStock(item.getProduct(), request.quantity());

        item.setQuantity(request.quantity());
        return getCart(userId);
    }

    public CartResponse removeItem(Long userId, Long productId) {
        cartItemRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(cartItemRepository::delete);
        return getCart(userId);
    }

    public CartResponse clear(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        return getCart(userId);
    }

    private CartItem newItem(Long userId, Product product) {
        CartItem item = new CartItem();
        item.setUser(userRepository.getReferenceById(userId));
        item.setProduct(product);
        return item;
    }

    private void checkStock(Product product, int quantity) {
        if (product.getStockQuantity() == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product is out of stock");
        }
        if (quantity > product.getStockQuantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only " + product.getStockQuantity() + " left in stock");
        }
    }
}