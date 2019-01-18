import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-return-visit-exc",
  templateUrl: "return-visit-exc.html"
})
export class ReturnVisitExcPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReturnVisitExcPage");
  }
}
