import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';

import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, productForm } from '../../models';
import { InfoProductsService } from '../../services';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogContentComponent,
    HlmDialogComponent,
    HlmFormFieldModule,
    HlmSelectImports,
    HlmSelectModule,
    HlmInputDirective,
    BrnSelectImports,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductComponent {
  product = input<Product>();
  productEdit = output();

  //Injects
  private readonly productService = inject(InfoProductsService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.productForm().reset(this.product());
  }

  productForm = signal(
    this.fb.group<productForm>({
      id: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
      name: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
      price: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
      category: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
      description: new FormControl<string | null>(null),
      image: new FormControl<string | null>(null),
    }),
  );

  editProduct(ctx: any) {
    if (this.productForm().invalid) return;

    this.productService
      .editProduct({
        id: this.productForm().value.id ?? '',
        name: this.productForm().value.name ?? '',
        category: this.productForm().value.category ?? '',
        price: this.productForm().value.price ?? '',
        description: this.productForm().value.description!,
        image: this.productForm().value.image!,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.productEdit.emit();
          ctx.close();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
