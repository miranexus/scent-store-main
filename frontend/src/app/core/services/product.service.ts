import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/models/product.model';

/**
 * ProductService is responsible for all HTTP communication with the PHP backend.
 * Components should never call HttpClient directly; they go through this service.
 *
 * Data flow: Component → ProductService → PHP /api/index.php?path=/products → JSON → Observable<Product[]>
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all products, optionally filtered by category.
   * The category filter is applied server-side by the PHP endpoint.
   */
  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams().set('path', '/products');
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }
}
