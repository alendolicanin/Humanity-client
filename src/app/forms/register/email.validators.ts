import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidator {
  //validator for cant have space
  static cannotContaintSpace(
    control: AbstractControl
  ): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContaintSpace: true };
    }
    return null;
  }
  static email(control: AbstractControl): ValidationErrors | null {
    const email: string = control.value;
    const pattern: RegExp =
      /^[A-Z]{1}[A-Z0-9.*(){}&^#@!$/_?|><%+-]{1,}[A-Z0-9]+@[A-Z]+(?:\.[A-Z]+)*$/i;

    if (!pattern.test(email)) {
      return { email: true };
    }
    return null;
  }
}
