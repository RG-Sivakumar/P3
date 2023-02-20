import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import { v1 as uuidv1 } from "uuid";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import * as settingsvalues from '../commonshared/services/encrypt-settings'

@Injectable({
  providedIn: "root",
})

export class UtilsService {

  constructor(private encrptdecrpt:EncryptDecryptService) { 

  }

  serverKeys = {
    "920":"a2aa7656-0f3e-4147-b1bd-2b9ce056296a",
    "407":"71ef7890-b81f-4c52-a750-0255f74f5a32",
    "817":"5fe80e03-0522-4863-847a-db8197e4d842",
    "596":"48996a9a-c818-4939-8206-5ecba500206b",
    "241":"ab3fc92b-3897-403d-9f3e-f124bf62fd1c",
    "189":"876b3994-441a-4ee1-a367-e8fa32a0d0ff",
    "366":"b5318210-2655-45af-b896-b93dd67e5764",
    "787":"e7c8f5b5-3fc8-4da2-97d8-70f4db162fdc",
    "172":"0869a6bc-e1dd-4745-95b2-910f69c969f3",
    "325":"1dbf00fa-5ec5-4878-a6c6-81d56fd4afca"
  }
  
  localKeys = {
    "920":"9c091c41-f4fe-4687-aa74-99ec051f2003",
    "407":"d36e39d8-b924-4308-87b6-3073cb304f2f",
    "817":"407b2f8f-4b50-4679-9fde-3141cfefc87a",
    "596":"e1bd34b0-d07f-4338-ac7d-1549e8648f3d",
    "241":"a23d1fb54-4868-444b-88c6-e6ba9cef9cac",
    "189":"0763703f-82c2-407d-bf33-d612a8a86939",
    "366":"c9347eec-94d1-4860-8a30-4b08cacf0761",
    "787":"f32b5fa7-5c3d-489f-aeeb-e9d9fd0b5a35",
    "172":"973f57ef-a05f-4007-a739-5d7b66bf9cd9",
    "325":"e867dea3-4730-4ce0-b2c2-e3e342543867"
  }
  
  findencrypetedkey(username:any): string {
    const arrKeys = Object.keys(this.localKeys)
    const randomElement = arrKeys[Math.floor(Math.random() * arrKeys.length)];
    const keyRequried = randomElement + ":" + uuidv1().toUpperCase() + username + this.localKeys[randomElement]
    let generatedKey;
    if (username.includes('@wje.com')) {
      generatedKey = this.encrptdecrpt.encrypt(keyRequried,settingsvalues.mterasfoktj);
    } else {
      generatedKey = this.encrptdecrpt.encrypt(keyRequried,settingsvalues.toeraatpaas);
    }
    return generatedKey
  }

  parseencrypetedkey(username:any,keytoparse:any): any {
    let generatedKey ;
    if (username.includes('@wje.com')) {
      generatedKey = this.encrptdecrpt.decrypt(keytoparse,settingsvalues.mterasfoktj);
    } else {
      generatedKey = this.encrptdecrpt.decrypt(keytoparse,settingsvalues.toeraatpaas);
    }

    const arrkeysplits = generatedKey.split(":")
    if(arrkeysplits.length > 0 && this.serverKeys[arrkeysplits[0]] != undefined){
      const filteredValue = this.serverKeys[arrkeysplits[0]]
      if(generatedKey.includes(filteredValue)){
        // let finalKey = generatedKey.replace(filteredValue,"")
        // finalKey = finalKey.replace(this.serverKeys[arrkeysplits[0]],"")
        return keytoparse
      }
    }
    return undefined
  }
  
}