import { Component } from '@angular/core';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
})
export class HowToUseComponent {
  togglePlayPause(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}
