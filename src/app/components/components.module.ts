import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [LoaderComponent, PanelComponent],
  exports: [LoaderComponent, PanelComponent],
  imports: [MatProgressSpinnerModule],
})
export class ComponentsModule {}
