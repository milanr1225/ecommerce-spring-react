package io.github.milanr1225.ecommerce.catalog;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")
    @Query("""
            select p from Product p
            where p.active = true
              and (:categorySlug is null or p.category.slug = :categorySlug)
              and (:q is null or lower(p.name) like lower(concat('%', :q, '%')))
            """)
    Page<Product> search(@Param("categorySlug") String categorySlug,
                         @Param("q") String q,
                         Pageable pageable);

    @EntityGraph(attributePaths = "category")
    Optional<Product> findBySlugAndActiveTrue(String slug);
}
