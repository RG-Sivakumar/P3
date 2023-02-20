import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormnameService } from "src/app/formname.service";

@Component({
  selector: "app-imagetostub",
  templateUrl: "./imagetostub.component.html",
  styleUrls: ["./imagetostub.component.css"],
})
export class ImagetostubComponent implements OnInit {
  filepath: any;
  url: string | ArrayBuffer;
  stubid: any;
  constructor(
    private dialog: MatDialogRef<ImagetostubComponent>,
    public messageService: FormnameService,
    private dialogref: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stubid = data.stubIdData;
  }

  ngOnInit(): void {}
  closeBox() {
    this.dialog.close();
  }
  onSelectFile(event, fileinput) {
    this.filepath = event.target.files[0].name;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
        let stubimageData: any = {
          filepath: this.filepath,
          url: this.url,
          stubIdData: this.stubid,
        };

        this.messageService.sendMessage(stubimageData);
        // this.dialog.close({
        //   data: { data1: this.url, data2: this.filepath },
        // });
        this.dialogref.closeAll();
      };
    }
  }
}
