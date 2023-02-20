import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

const FILE_EXISTS = "Uploaded file exists";

declare var gapi: any;
declare var google: any;
@Component({
  selector: "app-google-drive",
  templateUrl: "./google-drive.component.html",
  styleUrls: ["./google-drive.component.css"],
})
export class GoogleDriveComponent implements OnInit {
  title = "app works!";
  developerKey = "EyyxmvxVBC9m99rfUIunhMjq";
  clientId =
    "301865587350-qv0of60ae4d0mc1hblrase6igug9efcc.apps.googleusercontent.com";
  scope = ["https://www.googleapis.com/auth/drive.readonly"];
  pickerApiLoaded = false;
  oauthToken?: any;
  ngOnInit() {}
  constructor(private dialogRef: MatDialogRef<GoogleDriveComponent>) {}

  onApiLoad() {
    gapi.load("auth", { callback: this.onAuthApiLoad.bind(this) });
    gapi.load("picker", { callback: this.onPickerApiLoad.bind(this) });
  }

  onAuthApiLoad() {
    gapi.auth.authorize(
      {
        client_id: this.clientId,
        scope: this.scope,
        immediate: false,
      },
      this.handleAuthResult
    );
  }

  onPickerApiLoad() {
    this.pickerApiLoaded = true;
    this.createPicker();
  }

  handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      if (authResult.access_token) {
        var pickerBuilder = new google.picker.PickerBuilder();
        var picker = pickerBuilder
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .setOAuthToken(authResult.access_token)
          .addView(google.picker.ViewId.PHOTOS)
          .setDeveloperKey("EyyxmvxVBC9m99rfUIunhMjq")
          .setCallback(function (e) {
            var url = "nothing";

            if (
              e[google.picker.Response.ACTION] == google.picker.Action.PICKED
            ) {
              var doc = e[google.picker.Response.DOCUMENTS][0];
              url = doc[google.picker.Document.URL];
            }
            var message = "You picked: " + url;
          })
          .build();
        picker.setVisible(true);
      }
    }
  }

  createPicker() {
    if (this.pickerApiLoaded && this.oauthToken) {
      var picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCUMENTS)
        .setOAuthToken(this.oauthToken)
        .setDeveloperKey(this.developerKey)
        .setCallback(this.pickerCallback)
        .build();
      picker.setVisible(true);
    }
  }

  pickerCallback(data) {
    var url = "nothing";

    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      var doc = data[google.picker.Response.DOCUMENTS][0];
      url = doc[google.picker.Document.URL];
    }
    var message = "You picked: " + url;
    alert(message);
  }

  closeBox() {
    this.dialogRef.close();
  }
}
