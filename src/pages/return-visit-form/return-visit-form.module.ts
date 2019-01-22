import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { ReturnVisitFormPage } from "./return-visit-form";

@NgModule({
  declarations: [ReturnVisitFormPage],
  imports: [IonicPageModule.forChild(ReturnVisitFormPage), IonicModule],
  exports: [ReturnVisitFormPage]
})
export class ReturnVisitFormPageModule {}
