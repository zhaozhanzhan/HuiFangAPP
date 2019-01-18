import { Component, ViewChild } from "@angular/core";
import {
  AlertController,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  MenuController,
  IonicPage
} from "ionic-angular";
import { NativeAudio } from "@ionic-native/native-audio";
import { Storage } from "@ionic/storage";
import { GlobalService } from "../../common/service/GlobalService";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { LoginPage } from "../login/login";
import { loginInfo, reqObj } from "../../common/config/BaseConfig";
import { PhotoPrevComponent } from "../../common/component/components/photo-prev/photo-prev";
import { Local } from "../../common/service/Storage";
import _ from "underscore";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
// import _ from "underscore"; // underscore工具类
// import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { FormValidService } from "../../common/service/FormValid.Service";
// import { GlobalMethod } from "../../common/service/GlobalMethod";

@IonicPage()
@Component({
  selector: "page-user-info",
  templateUrl: "user-info.html"
})
export class UserInfoPage {
  public baseImgUrl: any = reqObj.baseImgUrl; // 基础图片URL
  public paramObj: any = null; // 传递过来的参数对象
  public formInfo: any = {}; // 数据信息
  constructor(
    // private fb: FormBuilder, // 响应式表单
    private jsUtil: JsUtilsService, // 自定义JS工具类
    private httpReq: HttpReqService, // Http请求服务
    private ionicStorage: Storage, // IonicStorage
    public navCtrl: NavController, // 导航控制器
    public navParams: NavParams, // 导航参数传递控制
    public menuCtrl: MenuController, // 侧滑菜单控制器
    public gloService: GlobalService, // 全局自定义服务
    public actionSheetCtrl: ActionSheetController, // 操作表控制器
    public platform: Platform, // 获取平台信息
    public alertCtrl: AlertController, // Alert消息弹出框
    public nativeAudio: NativeAudio // 音频播放
  ) {
    this.paramObj = this.navParams["data"];
    console.log("%c 传过来的ID", "color:#DEDE3F", this.paramObj);
    if (!(_.isObject(this.paramObj) && !_.isEmpty(this.paramObj))) {
      this.gloService.showMsg("未获取到ID", null, 2000);
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UserInfoPage");

    const formData: any = this.jsUtil.deepClone(this.paramObj);
    // if (loginInfo.LoginId) {
    //   formData.visitPensonID = loginInfo.LoginId;
    // }
    if (_.isObject(formData) && !_.isEmpty(formData)) {
      const loading = this.gloService.showLoading("正在查询，请稍候...");
      this.httpReq.get(
        "home/a/visit/homeVisitPerson/userInfo",
        formData,
        (data: any) => {
          if (data["data"] && data["data"]["result"] == 0) {
            // this.gloService.showMsg("登录成功", null, 1000);
            loading.dismiss();
            this.formInfo = data["data"]["HomeUserArchives"];
            // loginInfo.LoginState = "success"; // 登录状态
            // loginInfo.LoginTime = new Date().getTime(); // 登录时间
            // loginInfo.UserName = formData.username; // 用户名
            // loginInfo.Password = formData.password; // 用户密码
            // loginInfo.UserInfo = data["data"]; // 后台返回用户信息对象
            // if (
            //   data["data"] &&
            //   data["data"]["user"] &&
            //   data["data"]["user"]["extend"]
            // ) {
            //   loginInfo.LoginId = data["data"]["user"]["extend"]["extendS1"]; // 登录者Token
            // }
            // if (data["data"] && data["data"]["sessionid"]) {
            //   loginInfo.SessionId = data["data"]["sessionid"]; // 登录者Token
            // }
            // this.ionicStorage.set("userInfo", data["data"]); // 后台返回用户信息对象
            // this.ionicStorage.set("loginInfo", loginInfo); // 登录信息配置对象
            // this.navCtrl.setRoot("MainPage"); // 跳转到主页
          } else {
            loading.dismiss();
            this.formInfo = {};
            this.gloService.showMsg("获取信息失败！");
            if (this.navCtrl.canGoBack()) {
              this.navCtrl.pop();
            }
          }
        }
      );
    }
  }

  /**
   * 返回到主页
   * @memberof PersonInfoPage
   */
  public backHome() {
    this.navCtrl.setRoot("MainPage", null, { animate: true }); // 跳转到主页
  }
}
