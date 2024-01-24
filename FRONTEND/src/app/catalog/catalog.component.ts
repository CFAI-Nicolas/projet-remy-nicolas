import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { Store, Select } from '@ngxs/store';
import { AddToCart, RemoveFromCart, CartState } from '../cart/cart.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClearCart } from '../cart/cart.state';
import { Router } from '@angular/router';




@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filterText: string = '';
  sortBy: string = 'name';
  reverseSort: boolean = false;

  @Select(CartState.getCart) cart$!: Observable<Product[]>; // Ajouté ici


  constructor(
    private productService: ProductService,
    private store: Store,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      (error) => {
        if (error.status === 401) {
          // Redirection vers la page de connexion
          this.router.navigate(['/connexion']);
        }
      }
    );
  }


  applyFilter(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  applySort(): void {
    if (this.sortBy === 'name') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'price') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    }else if (this.sortBy === 'id') {
      this.filteredProducts.sort((a, b) => a.id - b.id);
    }else if (this.sortBy === 'Description') {
      this.filteredProducts.sort((a, b) => a.description.localeCompare(b.description));
    }

    this.reverseSort = !this.reverseSort;

    if (this.reverseSort) {
      this.filteredProducts.reverse();
    }
  }

  addToCart(product: Product): void {
    this.store.dispatch(new AddToCart(product));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(new RemoveFromCart(productId));
  }

  getTotalQuantity(): Observable<number> {
    return this.cart$.pipe(
      map(products => products.reduce((total, product) => total + product.quantity, 0))
    );
  }

  getTotalPrice(): Observable<number> {
    return this.cart$.pipe(map(products => products.reduce((total, p) => total + p.price * p.quantity, 0)));
  }

  clearCart(): void {
    this.store.dispatch(new ClearCart());
  }

}
