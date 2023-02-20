// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'titleCase' })
// export class TitleCasePipe implements PipeTransform {
//   public transform(input: string): string {
//     if (input) {
//       let firsttypeLetter = input[0].toUpperCase();
//       let othertypeletters = input.slice(1);
//       let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
//       console.log(changeUpperCaseProjectName);
//       return changeUpperCaseProjectName;
//     }
//   }
// }
import { Directive, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('blur') onBlur() {
    if (this.el.nativeElement.value) {
      let word = this.el.nativeElement.value;
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.el.nativeElement.value = changeUpperCaseProjectName;
   }
  }
}