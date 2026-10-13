import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';

import { ModalInfoService } from '../../core/services/modal.service';
import { ReportPeriod } from '../reports/models/report.model';
import { ReportPdfService } from '../reports/services/report-pdf.service';
import { Intent, Message, SUGGESTED } from './models/assistant.model';
import { AssistantService } from './services/assistant.service';

/** Long enough to read as someone writing, short enough not to make anyone wait */
const TYPING_MS = 700;

@Component({
  selector: 'app-assistant',
  templateUrl: 'assistant.page.html',
  styleUrls: ['assistant.page.scss'],
})
export class AssistantPage {
  @ViewChild(IonContent) content?: IonContent;

  /** Kept only while the app is open, nothing is stored */
  messages: Message[] = [];
  draft = '';
  busy = false;
  exporting: ReportPeriod | null = null;
  private nextId = 1;

  constructor(
    private assistantService: AssistantService,
    private reportPdfService: ReportPdfService,
    private modalInfoService: ModalInfoService,
    private transloco: TranslocoService
  ) {}

  ionViewWillEnter(): void {
    if (!this.messages.length) {
      this.push({ from: 'assistant', text: this.transloco.translate('assistant.greeting'), followUps: SUGGESTED });
    }
  }

  trackByMessage(_index: number, message: Message) {
    return message.id;
  }

  /** Only the latest answer offers chips, older ones would be noise */
  isLast(message: Message) {
    return message === this.messages[this.messages.length - 1];
  }

  pick(intent: Intent): void {
    this.converse(this.transloco.translate(`assistant.options.${intent}`), { intent });
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.busy) return;
    this.draft = '';
    this.converse(text, { text });
  }

  async exportPdf(period: ReportPeriod): Promise<void> {
    if (this.exporting) return;
    this.exporting = period;
    try {
      await this.reportPdfService.export(period, this.transloco.translate('reports.shareTitle'));
    } catch (error) {
      //A failed request was already shown by the interceptor, which hands back its message as a string
      if (typeof error !== 'string') {
        console.log(error);
        this.modalInfoService.error(this.transloco.translate('reports.exportFailed'), '');
      }
    } finally {
      this.exporting = null;
    }
  }

  private async converse(question: string, input: { intent: Intent } | { text: string }): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.push({ from: 'user', text: question });
    const typing = this.push({ from: 'assistant', text: '', typing: true });

    //The answer and the pause run together, a slow API does not add the pause on top
    const [reply] = await Promise.all([this.assistantService.ask(input), wait(TYPING_MS)]);

    this.messages = this.messages.map(message =>
      message.id === typing.id ? { ...message, ...reply, typing: false } : message
    );
    this.busy = false;
    this.scrollDown();
  }

  private push(message: Omit<Message, 'id'>): Message {
    const added = { ...message, id: this.nextId++ };
    this.messages = [...this.messages, added];
    this.scrollDown();
    return added;
  }

  private scrollDown(): void {
    //After angular has drawn the new bubble, and again once ionic's chips and buttons took their size
    setTimeout(() => this.content?.scrollToBottom(250));
    setTimeout(() => this.content?.scrollToBottom(250), 300);
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
