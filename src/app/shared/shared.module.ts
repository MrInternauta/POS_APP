import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { SearchPipe } from './pipes/search.pipe';
import { ThemeConstantService } from './services/theme-constant.service';
import { HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  exports: [CommonModule, FormsModule, HttpClientJsonpModule, NzIconModule, SearchPipe],
  imports: [RouterModule, CommonModule, NzIconModule, NzToolTipModule],
  declarations: [SearchPipe],
  providers: [ThemeConstantService],
})
export class SharedModule {}
