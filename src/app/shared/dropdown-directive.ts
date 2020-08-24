import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective{
  @HostBinding('class.open')  isopen = false;

  @HostListener('document:click', ['$event']) toggleOpen(eventData: Event){
    this.isopen = this.ref.nativeElement.contains(event.target) ? !this.isopen : false;
  }

  constructor(private ref: ElementRef){}
}