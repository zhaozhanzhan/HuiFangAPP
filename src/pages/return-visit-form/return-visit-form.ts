import { Component } from "@angular/core";
import {
  AlertController,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  MenuController,
  IonicPage,
  ModalController
} from "ionic-angular";
import { NativeAudio } from "@ionic-native/native-audio";
import _ from "underscore"; // underscore工具类
import { GlobalService } from "../../common/service/GlobalService";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
// import { Storage } from "@ionic/storage";
// import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { FormValidService } from "../../common/service/FormValid.Service";
// import { GlobalMethod } from "../../common/service/GlobalMethod";
// import { reqObj } from "../../common/config/BaseConfig";

@IonicPage()
@Component({
  selector: "page-return-visit-form",
  templateUrl: "return-visit-form.html"
})
export class ReturnVisitFormPage {
  public paramObj: any = null; // 传递过来的参数对象
  public formData: any = {}; // 表单数据
  public formInfo: any = {}; // 数据信息
  constructor(
    // public fb: FormBuilder, // 响应式表单
    // public ionicStorage: Storage, // IonicStorage
    public httpReq: HttpReqService, // Http请求服务
    public navCtrl: NavController, // 导航控制器
    public jsUtil: JsUtilsService, // 自定义JS工具类
    public navParams: NavParams, // 导航参数传递控制
    public menuCtrl: MenuController, // 侧滑菜单控制器
    public gloService: GlobalService, // 全局自定义服务
    public actionSheetCtrl: ActionSheetController, // 操作表控制器
    public platform: Platform, // 获取平台信息
    public alertCtrl: AlertController, // Alert消息弹出框
    public nativeAudio: NativeAudio, // 音频播放
    public modalCtrl: ModalController // Modal弹出页控制器
  ) {
    // this.paramObj = this.navParams["data"];
    // console.log("%c 传过来的ID", "color:#DEDE3F", this.paramObj);
    // if (!(_.isObject(this.paramObj) && !_.isEmpty(this.paramObj))) {
    //   this.gloService.showMsg("未获取到ID", null, 2000);
    //   if (this.navCtrl.canGoBack()) {
    //     this.navCtrl.pop();
    //   }
    // }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReturnVisitFormPage");
    // const formData: any = this.jsUtil.deepClone(this.paramObj);
    // if (_.isObject(formData) && !_.isEmpty(formData)) {
    //   const loading = this.gloService.showLoading("正在请求数据，请稍候...");
    // }
    this.httpReq.get(
      "home/a/visit/homeVisitPerson/visitInfo",
      null,
      (data: any) => {
        if (data["data"] && data["data"]["result"] == 0) {
          // this.gloService.showMsg("登录成功", null, 1000);
          // loading.dismiss();
          this.formInfo = data["data"];
        } else {
          // loading.dismiss();
          this.formInfo = {};
          this.gloService.showMsg("获取信息失败！");
          if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
          }
        }
      }
    );
  }

  /**
   * 返回到主页
   * @memberof PersonInfoPage
   */
  public backHome() {
    this.navCtrl.setRoot("MainPage", null, { animate: true }); // 跳转到主页
  }

  /**
   * 打开新页面
   * @param {*} pageName 页面组件类名称
   * @param {*} obj 页面组件类名称
   * @param {*} opts 转场动画
   * @memberof ServiceConfigPage
   */
  public jumpPage(pageName: any, obj?: any, opts?: any): void {
    if (_.isObject(obj) && !_.isEmpty(obj)) {
      this.navCtrl.push(pageName, obj);
    } else {
      if (pageName == "ScanPage") {
        this.navCtrl.push(pageName, null, opts);
      } else {
        this.navCtrl.push(pageName);
      }
    }
  }

  /**
   * 未开发提示
   * @memberof HomePage
   */
  public noDevTit() {
    this.gloService.showMsg("该功能正在加急开发中...", null, 2000);
  }

  /**
   * 改变评价单选项
   * @param {Array<any>} arr
   * @param {string} selKey
   * @param {number} i
   * @param {string} listKey
   * @param {number} j
   * @memberof ReturnVisitFormPage
   */
  public changeSel(
    arr: Array<any>,
    selKey: string,
    i: number,
    listKey: string,
    j: number
  ) {
    arr[i][selKey] = arr[i][listKey][j]["value"];
  }
}
