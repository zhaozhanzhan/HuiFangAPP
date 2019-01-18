import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { UserInfoPage } from "./user-info";
import { PipesModule } from "../../common/pipe/pipes.module";
import { ComponentsModule } from "../../common/component/components.module";

@NgModule({
  declarations: [UserInfoPage],
  imports: [
    IonicPageModule.forChild(UserInfoPage),
    IonicModule,
    PipesModule,
    ComponentsModule
  ],
  exports: [UserInfoPage]
})
export class UserInfoPageModule {}
