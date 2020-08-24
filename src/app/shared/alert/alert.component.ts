import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl : './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent{
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  constructor(){}
  onCloseError(){
    this.close.emit();
  }
}