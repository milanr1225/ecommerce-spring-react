package io.github.milanr1225.ecommerce.catalog;

import io.github.milanr1225.ecommerce.common.PageResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/products")
    public PageResponse<ProductResponse> products(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return catalogService.searchProducts(q, category, pageable);
    }

    @GetMapping("/products/{slug}")
    public ProductResponse product(@PathVariable String slug) {
        return catalogService.getProduct(slug);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return catalogService.getCategories();
    }
}
