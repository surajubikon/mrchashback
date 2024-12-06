// src/app/device-info.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  constructor() {}

  getDeviceInfo() {
    const userAgent = navigator.userAgent;

    return {
      os: this.getOS(userAgent),
      deviceType: this.getDeviceType(userAgent),
      browser: this.getBrowser(userAgent),
    };
  }

  private getOS(userAgent: string): string {
    if (/Windows NT/.test(userAgent)) {
      return 'Windows';
    }
    if (
      /Mac OS X/.test(userAgent) &&
      !/Mobile|iPhone|iPad|iPod/.test(userAgent)
    ) {
      return 'MacOS';
    }
    if (/Android/.test(userAgent)) {
      return 'Android';
    }
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return 'iOS';
    }
    if (/Linux/.test(userAgent)) {
      return 'Linux';
    }
    return 'Unknown';
  }

  private getDeviceType(userAgent: string): string {
    if (/iPad/.test(userAgent)) {
      return 'Tablet';
    }
    if (/iPhone|Android.*Mobile/.test(userAgent)) {
      return 'Mobile';
    }
    if (/Android/.test(userAgent)) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  private getBrowser(userAgent: string): string {
    if (/Edg\//.test(userAgent)) {
      return 'Edge';
    }
    if (/OPR\//.test(userAgent)) {
      return 'Opera';
    }
    if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
      return 'Chrome';
    }
    if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
      return 'Safari';
    }
    if (/Firefox\//.test(userAgent)) {
      return 'Firefox';
    }
    if (/MSIE|Trident\//.test(userAgent)) {
      return 'Internet Explorer';
    }
    return 'Unknown';
  }
}
