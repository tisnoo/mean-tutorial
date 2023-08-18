import { NgModule } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
      exports: [
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ]
})
export class AngularMaterialModule{

}