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
  public userCode: string = ""; // 310106001100001 老人档案编号
  public nursWorkerArr: Array<any> = [];
  public isSeeOldMan: boolean = true; // 是否看见老人
  public nursWorkerId: string = null; // 护工ID
  public oldManId: string = null; // 老人ID
  public noSeeOldManReason: string = null; // 未看见老人原因
  public situationDescription: string = ""; // 回访情况描述

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
    this.paramObj = this.navParams["data"];
    console.log("%c 传过来的ID", "color:#DEDE3F", this.paramObj);
    if (!(_.isObject(this.paramObj) && !_.isEmpty(this.paramObj))) {
      this.gloService.showMsg("获取参数失败", null, 2000);
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      }
    } else {
      if (this.paramObj.intoWay == "scanCode") {
        this.serNursWorker(this.paramObj.userCode);
      }
    }
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

  /**
   * 设置护工ID和老人ID
   * @param {string} personId 护工ID
   * @param {string} userId 老人ID
   * @memberof ReturnVisitFormPage
   */
  public setNursWorkerId(personId: string, userId: string) {
    this.nursWorkerId = personId;
    this.oldManId = userId;
  }

  /**
   * 设置是否看见老人
   * @param {boolean} state
   * @memberof ReturnVisitFormPage
   */
  public setSeeOldMan(state: boolean) {
    console.error("state", state);
    console.error("this.isSeeOldMan", this.isSeeOldMan);
    if (!(this.isSeeOldMan == state)) {
      this.isSeeOldMan = state;
      this.noSeeOldManReason = null;
    }
  }

  /**
   * 切换是否看见老人
   * @memberof ReturnVisitFormPage
   */
  public toggleIsSeeOldMan() {
    this.noSeeOldManReason = null;
  }

  /**
   * 设置未看见老人原因
   * @param {string} val
   * @memberof ReturnVisitFormPage
   */
  public setNoSeeOldManReason(val: string) {
    this.noSeeOldManReason = val;
  }

  /**
   * 查询服务人员列表
   * @param {string} userCode
   * @memberof ReturnVisitFormPage
   */
  public serNursWorker(userCode: string) {
    if (_.isString(userCode) && userCode.length > 0) {
      const sendObj: any = {};
      sendObj.userCode = userCode; // 老人编号
      const loading = this.gloService.showLoading("正在查询...");
      this.httpReq.get(
        "home/a/visit/homeVisit/checkUserCode",
        sendObj,
        (data: any) => {
          if (data["data"] && data["data"]["result"] == 0) {
            loading.dismiss();
            this.nursWorkerId = null; // 重置护工ID
            this.oldManId = null; // 重置老人ID
            this.nursWorkerArr = data["data"]["userPerson"];
          } else {
            loading.dismiss();
            this.nursWorkerId = null; // 重置护工ID
            this.oldManId = null; // 重置老人ID
            this.nursWorkerArr = [];
            this.gloService.showMsg(data["message"]);
          }
        }
      );
    } else {
      this.gloService.showMsg("获取长者档案编号失败");
    }
  }

  /**
   * 保存表单数据
   * @memberof ReturnVisitFormPage
   */
  public saveForm() {
    // pictureId: this.pictureId, // 图片ID
    // intoWay: "uploadImg", // 'uploadImg'上传照片 "scanCode" 扫码 进入方式
    // userCode: "" // 老人编号
    const formData: any = {};
    if (this.paramObj.intoWay == "uploadImg") {
      // 上传照片方式回访
      formData.visitFalg = "2"; // 上传照片进入回访情况
      if (
        _.isString(this.paramObj.pictureId) &&
        this.paramObj.pictureId.length > 0
      ) {
        formData.pictureId = this.paramObj.pictureId; // 照片ID
      } else {
        this.gloService.showMsg("未获取到照片ID");
        return;
      }
    } else if (this.paramObj.intoWay == "scanCode") {
      // 扫码方式回访
      formData.visitFalg = "1"; // 扫描进入回访情况
    } else {
      this.gloService.showMsg("未获取到入口类型");
      return;
    }

    if (_.isString(this.nursWorkerId) && this.nursWorkerId.length > 0) {
      formData.personCode = this.nursWorkerId; // 护工ID
    } else {
      this.gloService.showMsg("请选择护工");
      return;
    }

    if (_.isString(this.oldManId) && this.oldManId.length > 0) {
      formData.userCode = this.oldManId; // 长者ID
    } else {
      this.gloService.showMsg("未获取到长者ID");
      return;
    }

    if (this.isSeeOldMan) {
      // 看见老人
      formData.seeOlder = "1";
    } else {
      // 未看见老人
      formData.seeOlder = "0";
      if (
        _.isString(this.noSeeOldManReason) &&
        this.noSeeOldManReason.length > 0
      ) {
        formData.unsightedReason = this.noSeeOldManReason; // 没见到原因
      } else {
        this.gloService.showMsg("请选择未见到长者原因");
        return;
      }
    }

    const dictData = this.formInfo.DictData;
    if (_.isArray(dictData) && dictData.length > 0) {
      for (let i = 0; i < dictData.length; i++) {
        formData[dictData[i]["labelName"]] = dictData[i]["hasSelect"];
      }
    } else {
      this.gloService.showMsg("未获取到评价信息");
    }

    if (
      _.isString(this.situationDescription) &&
      this.situationDescription.length > 0
    ) {
      formData.situationDescription = this.situationDescription; // 回访情况描述
    } else {
      this.gloService.showMsg("请输入回访情况描述");
      return;
    }

    console.error("formData", formData);
    const loading = this.gloService.showLoading("正在提交，请稍候...");
    this.httpReq.get(
      "home/a/visit/homeVisit/saveVisit",
      formData,
      (data: any) => {
        if (data["data"] && data["data"]["result"] == 0) {
          loading.dismiss();
          if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
          }
          this.gloService.showMsg("保存成功！");
        } else {
          loading.dismiss();
          if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
          }
          this.gloService.showMsg(data["message"]);
        }
      }
    );
  }
}
