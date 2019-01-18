import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { ReturnVisitListPage } from "./return-visit-list";

@NgModule({
  declarations: [ReturnVisitListPage],
  imports: [IonicPageModule.forChild(ReturnVisitListPage), IonicModule],
  exports: [ReturnVisitListPage]
})
export class ReturnVisitListPageModule {}
