import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidatorP {
  static cannotContaintSpace(
    control: AbstractControl
  ): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContaintSpace: true };
    }
    return null;
  }
  static upperCase(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;
    const pattern: RegExp = /^(?=.*[A-Z]).*$/;

    if (!pattern.test(password)) {
      return { upperCase: true };
    }
    return null;
  }

  static number(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;
    const pattern: RegExp = /^(?=.*\d).*$/;

    if (!pattern.test(password)) {
      return { number: true };
    }
    return null;
  }

  static specialCaracter(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;
    const pattern: RegExp = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
    if (!pattern.test(password)) {
      return { specialCaracter: true };
    }
    return null;
  }

  static passwordMismatch(control: AbstractControl): ValidationErrors | null {
    let Password = control.get('password');
    let ConfirmPassword = control.get('confirmPassword');
    if (Password?.value !== ConfirmPassword?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
