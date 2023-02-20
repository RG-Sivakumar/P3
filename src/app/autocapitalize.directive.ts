import { Directive, HostBinding, HostListener, ElementRef, Input} from '@angular/core';  
 
 @Directive({ 
    selector:'[capitalizevalue]'
 }) 
 
 export class AutoCapitalizeDirective { 

    @Input() capitalizevalue: string;

     constructor(private element:ElementRef){
        console.log(this.capitalizevalue);
    }
     
 } 