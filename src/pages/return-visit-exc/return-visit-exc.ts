import { Component } from "@angular/core";
import {
  AlertController,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  MenuController,
  IonicPage,
  ModalController,
  normalizeURL
} from "ionic-angular";
import { NativeAudio } from "@ionic-native/native-audio";
import _ from "underscore"; // underscore工具类
import { File } from "@ionic-native/file"; // 文件选择
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "@ionic-native/file-transfer";
import { GlobalService } from "../../common/service/GlobalService";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { GlobalMethod } from "../../common/service/GlobalMethod";
import { reqObj } from "../../common/config/BaseConfig";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { Local } from "../../common/service/Storage";
import { FilePath } from "@ionic-native/file-path";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
// import { Storage } from "@ionic/storage";
// import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { FormValidService } from "../../common/service/FormValid.Service";

declare var cordova: any;
@IonicPage()
@Component({
  selector: "page-return-visit-exc",
  templateUrl: "return-visit-exc.html"
})
export class ReturnVisitExcPage {
  public imgObj: any = {
    filePath: "", // 文件路径不含文件名
    fileName: "", // 文件名包含扩展名
    fileType: "", // 文件扩展名
    fileFullPath: "" // 文件完整路径
  }; // 文件初始化对象
  public imgArr: any = []; // 图片对象数组
  public pictureId: any = null; // 图片ID

  constructor(
    // public fb: FormBuilder, // 响应式表单
    // public ionicStorage: Storage, // IonicStorage
    public httpReq: HttpReqService, // Http请求服务
    public jsUtil: JsUtilsService, // 自定义JS工具类
    public camera: Camera, // 相机
    public file: File, // 文件
    public filePath: FilePath, // 文件路径
    public transfer: FileTransfer, // 文件上传
    public navCtrl: NavController, // 导航控制器
    public navParams: NavParams, // 导航参数传递控制
    public menuCtrl: MenuController, // 侧滑菜单控制器
    public gloService: GlobalService, // 全局自定义服务
    public actionSheetCtrl: ActionSheetController, // 操作表控制器
    public platform: Platform, // 获取平台信息
    public alertCtrl: AlertController, // Alert消息弹出框
    public nativeAudio: NativeAudio, // 音频播放
    public modalCtrl: ModalController // Modal弹出页控制器
  ) {
    for (let i = 0; i < 1; i++) {
      // 初始化图片上传数组
      const fileObj = this.jsUtil.deepClone(this.imgObj);
      this.imgArr.push(fileObj);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReturnVisitExcPage");
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
   * 为文件生成一个新的文件名
   * @returns
   * @memberof RegisterPage
   */
  public createFileName(fileType: string) {
    let dateObj = new Date();
    let timeMill = dateObj.getTime(); // 时间戳
    let newFileName = timeMill + "." + fileType; //拼接文件名
    console.error("新文件名AAAAAAAAAAA");
    return newFileName;
  }

  /**
   * 处理图片的路径为当前设备可上传路径
   * @param {*} imgName 图片名称
   * @memberof RegisterPage
   */
  public imgUploadPath(imgName: any) {
    if (!imgName) {
      return "";
    } else {
      // window.Ionic.WebView.convertFileSrc
      return GlobalMethod.rmFileStr(
        normalizeURL(cordova.file.dataDirectory + imgName)
      );
    }
  }

  /**
   * 将获取到的图片或者相机拍摄到的图片进行一下另存为，用于后期的图片上传使用
   * @param {*} path 文件路径
   * @param {*} currentName 文件名
   * @param {*} newFileName 新文件名
   * @memberof RegisterPage
   */
  public copyFileToLocalDir(
    filePath: string,
    fileName: string,
    newFileName: any
  ) {
    return new Promise((resolve, reject) => {
      this.file
        .copyFile(filePath, fileName, cordova.file.dataDirectory, newFileName)
        .then(
          success => {
            // this.lastImg = newFileName;
            console.error(
              "cordova.file.dataDirectory",
              cordova.file.dataDirectory
            );
            console.error("newFileNameCCCCCCCCCCCCCCCCCC", newFileName);
            console.error(
              "fileFullPathDDDDDDDDDDDDDDDDDDD",
              normalizeURL(cordova.file.dataDirectory + newFileName)
            );
            this.imgArr[0]["filePath"] = cordova.file.dataDirectory; // 文件路径
            this.imgArr[0]["fileName"] = newFileName; // 文件名包含扩展名
            this.imgArr[0]["fileFullPath"] = normalizeURL(
              cordova.file.dataDirectory + newFileName
            ); // 文件完整路径
            resolve();
          },
          error => {
            this.gloService.showMsg("存储图片到本地图库出现错误", null, 3000);
            reject();
          }
        );
    });
  }

  /**
   * 拼接完整请求URL
   * @param url 传入接口的部分URL
   */
  private getFullUrl(url: string): string {
    const baseUrl: String = reqObj.baseUrl;
    return baseUrl + url;
  }

  /**
   * 上传声音文件
   * @param {string} fileKey 后台需要取值的key,input标签类型file上的name
   * @param {string} fileName 文件名称
   * @param {string} filePath 文件设备路径
   * @param {string} uploadUrl 上传文件地址URL
   * @returns {Promise<any>}
   * @memberof EvalStepOnePage
   */
  public uploadFile(
    fileKey: string,
    fileName: string,
    filePath: string,
    uploadUrl: string
  ): Promise<any> {
    // 设置上传参数
    const options: FileUploadOptions = {
      fileKey: fileKey,
      fileName: fileName,
      chunkedMode: false,
      mimeType: "multipart/form-data"
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    console.error("filePath:" + filePath);
    console.error("uploadUrl:" + uploadUrl);
    console.error("options:", options);
    return new Promise((resolve, reject) => {
      fileTransfer
        .upload(filePath, uploadUrl, options)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          this.gloService.showMsg("上传发生错误,请重试", "top", 3000);
          reject(err);
        });
    });
  }

  /**
   * 获取图片
   * @param {number} sourceType 获取图片的方式 PHOTOLIBRARY：0，CAMERA：1
   * @memberof RegisterPage
   */
  public getPicture(sourceType: number) {
    const options: CameraOptions = {
      quality: 40, // 图片质量范围为0-100。默认值为50
      destinationType: this.camera.DestinationType.FILE_URI, //返回的数据类型，默认DATA_URL
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType, // 设置图片,的来源。在Camera.PictureSourceType中定义。默认是CAMERA。PHOTOLIBRARY：0，CAMERA：1，SAVEDPHOTOALBUM：2
      saveToPhotoAlbum: false, //是否保存拍摄的照片到相册中去
      correctOrientation: true //是否纠正拍摄的照片的方向
    };

    this.camera.getPicture(options).then(
      imagePath => {
        // let base64Image = "data:image/jpeg;base64," + imageData;
        const isAndroid = this.platform.is("android"); // 判断是否是安卓
        const isPhotoLib =
          sourceType === this.camera.PictureSourceType.PHOTOLIBRARY; // 判断是否是相册

        const upUrl = "home/a/visit/homeVisit/fileUpload";
        const queryObj: any = {};
        queryObj.isPicture = true; // 文件类型

        const sid: any = Local.get("sessionId");
        if (_.isString(sid) && sid.length > 0) {
          queryObj.__sid = sid;
        } else {
          this.gloService.showMsg("未获取到sessionId", "top");
          return;
        }

        //===========安卓平台文件路径特殊处理 Begin===========//
        if (isAndroid && isPhotoLib) {
          //特别处理 android 平台的文件路径问题
          // Android相册
          this.filePath
            .resolveNativePath(imagePath) //获取 android 平台下的真实路径
            .then(filePath => {
              // 解析获取Android真实路径
              console.error(window);
              // 获取图片正确的路径;
              const correctPath = GlobalMethod.getFilePath(filePath);
              // 获取图片文件名和文件类型;
              const correctNameType = GlobalMethod.getFileNameAndType(
                imagePath
              );
              // 获取图片文件名;
              // const correctName = GlobalMethod.getFileName(filePath);

              // 获取图片文件类型;
              const correctType = GlobalMethod.getFileType(filePath);
              console.error("correctPath", correctPath);
              console.error("correctNameType", correctNameType);
              console.error("correctType", correctType);
              this.imgArr[0]["fileType"] = correctType; // 文件类型扩展名

              this.copyFileToLocalDir(
                correctPath,
                correctNameType,
                this.createFileName(correctType)
              ).then(
                suc => {
                  queryObj.fileName = this.imgArr[0]["fileName"]; // 文件名称
                  // queryObj.bizType = "homeServerWork_before"; // 开启服务图片标识

                  const queryParam = this.jsUtil.queryStr(queryObj);
                  let uploadUrl: string =
                    this.getFullUrl(upUrl) + "?" + queryParam;

                  const loading = this.gloService.showLoading("上传中...");

                  // queryObj.bizKey = this.paramId; // 服务ID
                  this.uploadFile(
                    "multipartFile",
                    this.imgArr[0]["fileName"],
                    this.imgArr[0]["fileFullPath"],
                    uploadUrl
                  ).then(
                    upSuc => {
                      console.error("upSuc", upSuc);
                      loading.dismiss();
                      console.error("JSON", JSON.parse(upSuc.response));
                      this.pictureId = JSON.parse(upSuc.response).pictureId;
                      if (
                        _.isString(this.pictureId) &&
                        this.pictureId.length > 0
                      ) {
                        this.jumpPage("ReturnVisitFormPage", {
                          pictureId: this.pictureId, // 图片ID
                          intoWay: "uploadImg", // 'uploadImg'上传照片 "scanCode" 扫码 进入方式
                          userCode: "" // 老人编号
                        });
                        // const sendData = this.jsUtil.deepClone(this.paramObj);
                        // const nfcId = ParamService.getParamNfc();
                        // sendData.nfcNo = nfcId;
                        // sendData.pictureId = this.pictureId;
                        // this.httpReq.get(
                        //   "home/a/home/homeServerWork/start",
                        //   sendData,
                        //   (data: any) => {
                        //     if (data["data"] && data["data"]["result"] == 0) {
                        //       this.jumpPage("ServiceConductPage");
                        //     } else {
                        //       if (data["data"] && data["data"]["message"]) {
                        //         this.gloService.showMsg(
                        //           data["data"]["message"]
                        //         );
                        //       } else {
                        //         this.gloService.showMsg("请求数据出错！");
                        //       }
                        //     }
                        //   }
                        // );
                      }
                    },
                    upErr => {
                      console.error("upErr", upErr);
                      loading.dismiss();
                    }
                  );
                },
                err => {}
              );
            });
        } else {
          // 非安卓Android平台及相册
          console.error(window);
          // 获取图片正确的路径;
          const correctPath = GlobalMethod.getFilePath(imagePath);
          // 获取图片文件名和文件类型;
          const correctNameType = GlobalMethod.getFileNameAndType(imagePath);
          // 获取图片文件名;
          // const correctName = GlobalMethod.getFileName(imagePath);
          // 获取图片文件类型;
          const correctType = GlobalMethod.getFileType(imagePath);
          // this.imgArr[0]["fileType"] = correctType; // 文件类型扩展名
          console.error("correctPath", correctPath);
          console.error("correctNameType", correctNameType);
          console.error("correctType", correctType);
          this.imgArr[0]["fileType"] = correctType; // 文件类型扩展名

          this.copyFileToLocalDir(
            correctPath,
            correctNameType,
            this.createFileName(correctType)
          ).then(
            suc => {
              queryObj.fileName = this.imgArr[0]["fileName"]; // 文件名称
              // queryObj.bizType = "homeServerWork_before"; // 开启服务图片标识

              const queryParam = this.jsUtil.queryStr(queryObj);
              let uploadUrl: string = this.getFullUrl(upUrl) + "?" + queryParam;

              const loading = this.gloService.showLoading("上传中...");

              // queryObj.bizKey = this.paramId; // 服务ID
              this.uploadFile(
                "multipartFile",
                this.imgArr[0]["fileName"],
                this.imgArr[0]["fileFullPath"],
                uploadUrl
              ).then(
                upSuc => {
                  console.error("upSuc", upSuc);
                  loading.dismiss();
                  console.error("JSON", JSON.parse(upSuc.response));
                  this.pictureId = JSON.parse(upSuc.response).pictureId;
                  if (_.isString(this.pictureId) && this.pictureId.length > 0) {
                    this.jumpPage("ReturnVisitFormPage", {
                      pictureId: this.pictureId, // 图片ID
                      intoWay: "uploadImg", // 'uploadImg'上传照片 "scanCode" 扫码 进入方式
                      userCode: "" // 老人编号
                    });
                    // const sendData = this.jsUtil.deepClone(this.paramObj);
                    // const nfcId = ParamService.getParamNfc();
                    // sendData.nfcNo = nfcId;
                    // sendData.pictureId = this.pictureId;
                    // this.httpReq.get(
                    //   "home/a/home/homeServerWork/start",
                    //   sendData,
                    //   (data: any) => {
                    //     if (data["data"] && data["data"]["result"] == 0) {
                    //       this.jumpPage("ServiceConductPage");
                    //     } else {
                    //       if (data["data"] && data["data"]["message"]) {
                    //         this.gloService.showMsg(data["data"]["message"]);
                    //       } else {
                    //         this.gloService.showMsg("请求数据出错！");
                    //       }
                    //     }
                    //   }
                    // );
                  }
                  // this.jumpPage("EvalStepTwoPage", { serviceId: this.paramId });
                },
                upErr => {
                  console.error("upErr", upErr);
                  loading.dismiss();
                }
              );
            },
            err => {}
          );
        }

        //===========安卓平台文件路径特殊处理 End===========//
      },
      err => {
        console.log(err);
        this.gloService.showMsg("未获取到图片", null, 3000);
      }
    );
  }

  /**
   * 开启异常
   * @memberof ReturnVisitExcPage
   */
  public openExc() {
    const confirm = this.alertCtrl.create({
      title: "提示",
      message: "异常情况登记必须要拍照！",
      buttons: [
        {
          text: "取消",
          handler: () => {}
        },
        {
          text: "确定",
          handler: () => {
            console.error("进入拍照页面");
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * 未开发提示
   * @memberof HomePage
   */
  public noDevTit() {
    this.gloService.showMsg("该功能正在加急开发中...", null, 2000);
  }
}
