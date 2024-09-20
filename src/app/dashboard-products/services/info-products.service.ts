import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Product } from '../models';
import { SupabaseService } from '../../shared';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class InfoProductsService {
  //Injects
  private readonly http = inject(HttpClient);
  private supabaseClient = inject(SupabaseService).supabaseClient;

  deleteProducts(id: string) {
    return from(
      this.supabaseClient.from('productos').delete().eq('id', id),
    ).pipe(switchMap(() => this.getAllProducts()));
  }

  getAllProducts() {
    return from(
      this.supabaseClient.from('productos').select().returns<Product[]>(),
    ).pipe(map((data: any) => data.data));
  }

  addProduct(product: {
    name: string;
    price: string;
    category: string;
    description: string | null;
    image: string | null;
  }) {
    return from(
      this.supabaseClient.from('productos').insert({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
      }),
    );
  }

  editProduct(product: {
    id: string;
    name: string;
    price: string;
    category: string;
    description: string | null;
    image: string | null;
  }) {
    return from(
      this.supabaseClient
        .from('productos')
        .update({
          ...product,
        })
        .eq('id', product.id)
        .select(),
    );
  }
}
