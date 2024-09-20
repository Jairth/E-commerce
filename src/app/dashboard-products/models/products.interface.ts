import { Form, FormControl } from '@angular/forms';

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description?: string | null;
  image?: string | null;
}

export interface productForm {
  id?: FormControl<string | null>;
  name: FormControl<string | null>;
  price: FormControl<string | null>;
  category: FormControl<string | null>;
  description: FormControl<string | null>;
  image: FormControl<string | null>;
}
