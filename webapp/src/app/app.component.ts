import { Component, OnInit, VERSION } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:8009/api/upload';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  title = 'ng8fileupload';
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'file' });

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
    };
 }
}
