import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { ReturnVisitExcPage } from "./return-visit-exc";

@NgModule({
  declarations: [ReturnVisitExcPage],
  imports: [IonicPageModule.forChild(ReturnVisitExcPage), IonicModule],
  exports: [ReturnVisitExcPage]
})
export class ReturnVisitExcPageModule {}
