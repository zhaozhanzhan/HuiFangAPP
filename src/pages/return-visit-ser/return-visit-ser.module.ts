import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { ReturnVisitSerPage } from "./return-visit-ser";

@NgModule({
  declarations: [ReturnVisitSerPage],
  imports: [IonicPageModule.forChild(ReturnVisitSerPage), IonicModule],
  exports: [ReturnVisitSerPage]
})
export class ReturnVisitSerPageModule {}
