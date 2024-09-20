import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
} from '@spartan-ng/ui-sheet-helm';
import { InfoProductsService } from '../../services';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { Product, productForm } from '../../models';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    HlmSheetComponent,
    HlmSheetContentComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSelectModule,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmSelectImports,
    BrnSelectImports,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideCross })],
})
export class AddProductComponent {
  productAdded = output();
  //Injects
  private readonly productService = inject(InfoProductsService);
  private fb = inject(FormBuilder);

  productForm = signal(
    this.fb.group<productForm>({
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

  addProduct(ctx: any) {
    if (this.productForm().invalid) return;

    this.productService
      .addProduct({
        name: this.productForm().value.name ?? '',
        category: this.productForm().value.category ?? '',
        price: this.productForm().value.price ?? '',
        description: this.productForm().value.description!,
        image: this.productForm().value.image!,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.productAdded.emit();
          ctx.close();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
