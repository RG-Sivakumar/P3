import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChapterActiveService {
  constructor() { }
 
  currentActiveOption = new EventEmitter<any>();


  
}

