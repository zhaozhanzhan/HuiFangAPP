import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { ReturnVisitObjPage } from "./return-visit-obj";

@NgModule({
  declarations: [ReturnVisitObjPage],
  imports: [IonicPageModule.forChild(ReturnVisitObjPage), IonicModule],
  exports: [ReturnVisitObjPage]
})
export class ReturnVisitObjPageModule {}
