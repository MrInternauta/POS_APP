import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { AssistantPageRoutingModule } from './assistant-routing.module';
import { AssistantPage } from './assistant.page';

@NgModule({
  imports: [TranslocoModule, IonicModule, CommonModule, FormsModule, AssistantPageRoutingModule],
  declarations: [AssistantPage],
})
export class AssistantPageModule {}
