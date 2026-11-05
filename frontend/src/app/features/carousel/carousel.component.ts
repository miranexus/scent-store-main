import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../core/services/product.service';

/**
 * ProductCarouselComponent fetches all products on init and splits them
 * into two PrimeNG carousels: Featured Perfumes and Special Offers.
 *
 * Data flow: ProductService.getProducts() → subscribe → partition into
 * featuredProducts / specialOffers → rendered by p-carousel templates.
 */
@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CarouselModule, CardModule, TagModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class ProductCarouselComponent implements OnInit {
  featuredProducts: Product[] = [];
  specialOffers: Product[] = [];

  // PrimeNG responsive breakpoints for the carousel
  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px',  numVisible: 1, numScroll: 1 },
  ];

  constructor(
    private productService: ProductService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    // Single HTTP call; partition locally to avoid two network requests
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.featuredProducts = products.filter((p) => p.featured);
        this.specialOffers    = products.filter((p) => p.specialOffer);
      });
  }

  getDiscountedPrice(product: Product): number {
    if (!product.discount || product.discount <= 0 || product.discount >= 100) {
      return product.price;
    }
    return Math.round(product.price * (1 - product.discount / 100) * 100) / 100;
  }
}
