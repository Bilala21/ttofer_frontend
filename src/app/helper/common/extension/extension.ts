import { Component, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class Extension {
  constructor(
    private _sanitizer: DomSanitizer
) {}

getUserId() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jsonStringGetData = localStorage.getItem('key');
      if (jsonStringGetData) {
        const user = JSON.parse(jsonStringGetData);
        let currentUserId = user.id;
        return currentUserId
      }
    }
}

fileToByteArray(file: any) {
    return new Promise((resolve, reject) => {
        try {
            let reader = new FileReader();
            let fileByteArray: any = [];
            reader.readAsArrayBuffer(file);
            reader.onloadend = (evt: any) => {
                if (evt.target.readyState == FileReader.DONE) {
                    let arrayBuffer = evt.target.result;
                    let array = new Uint8Array(arrayBuffer);
                    for (let byte of array) {
                        fileByteArray.push(byte);
                    }

                }
                resolve(fileByteArray);
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

byteArrayToImage(array: Uint8Array) {
  const STRING_CHAR = array.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
  }, '');
  let base64String = btoa(STRING_CHAR);
  return this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
}

}
