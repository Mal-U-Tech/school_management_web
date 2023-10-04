import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PanelComponent } from './panel/panel.component';
import { ContentComponent } from './content/content.component';
import { BannerComponent } from './banner/banner.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LoaderComponent, PanelComponent, ContentComponent, BannerComponent],
  exports: [LoaderComponent, PanelComponent, ContentComponent, BannerComponent],
  imports: [
    CommonModule,

    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ComponentsModule {}
