import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
})
export class CopyToClipboardDirective {
  @Input('appCopyToClipboard') text!: string;

  constructor() {}

  @HostListener('click') onClick() {
    this.copyToClipboard(this.text);
  }

  copyToClipboard(text: string) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
