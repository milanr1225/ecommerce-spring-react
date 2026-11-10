package io.github.milanr1225.ecommerce.catalog;

import io.github.milanr1225.ecommerce.common.PageResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public PageResponse<ProductResponse> searchProducts(String q, String category, Pageable pageable) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        String slug = (category == null || category.isBlank()) ? null : category.trim();
        return PageResponse.from(
                productRepository.search(slug, query, pageable).map(ProductResponse::from));
    }

    public ProductResponse getProduct(String slug) {
        return productRepository.findBySlugAndActiveTrue(slug)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll(Sort.by("name")).stream()
                .map(CategoryResponse::from)
                .toList();
    }
}
