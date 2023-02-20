import { Directive,ElementRef,OnInit,AfterViewInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appSpecialcharater]'
})
export class SpecialcharaterDirective implements OnInit,AfterViewInit {

  constructor(private eleRef: ElementRef) { }

  ngOnInit(): void { 
  }

  ngAfterViewInit() {
    let get_element_name = this.eleRef.nativeElement.innerHTML;
    let get_special_char_view = this.changeSpecialtoKeyFormat(get_element_name);
    this.eleRef.nativeElement.innerHTML = get_special_char_view;
  }
  public changeSpecialtoKeyFormat(name) {
    // var changedName = name.split("'").join("‘");
    // changedName = changedName.split("\"").join("“");
    var changedName = "";
    if(name!=undefined)
    {
      changedName = name.split('â').join("\\");
      changedName = changedName.split("ê").join("'");
      changedName = changedName.split('ô').join('"');
      // changedName = changedName.split("Â").join("\\");
      changedName = changedName.split("Ê").join("'");
      changedName = changedName.split('Ô').join('"');
    }
    else{
      changedName = "";
    }
    return changedName;
  }

}
