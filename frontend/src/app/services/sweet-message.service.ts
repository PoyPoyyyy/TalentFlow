import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetMessageService {
  constructor() {}

  public showAlert(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    showCancelButton: boolean = false,
    cancelButtonText: string = 'Cancel',
    confirmButtonText: string = 'OK',
    timer: number = 0
  ): Promise<any> {
    return Swal.fire({
      title: title,
      text: message,
      icon: type,
      showCancelButton: showCancelButton,
      confirmButtonColor: "#406380",
      cancelButtonColor: "#d33",
      cancelButtonText: cancelButtonText,
      confirmButtonText: confirmButtonText,
      timer: timer,
      timerProgressBar: true
    });
  }

  public showToast(message: string, icon: 'success' | 'error' | 'info' | 'warning'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: icon,
      title: message,
    });
  }
}
