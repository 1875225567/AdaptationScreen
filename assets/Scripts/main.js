cc.Class({
    extends: cc.Component,

    properties: {
        // label: {
        //     default: null,
        //     type: cc.Label
        // },
    },

    // use this for initialization
    onLoad: function () {
        //设计分辨率
        let designSize = cc.view.getDesignResolutionSize();
        cc.log('设计分辨率',designSize);
        //屏幕物理分辨率 也就是手机分辨率。
        let frameSize = cc.view.getFrameSize();
        cc.log('手机分辨率',frameSize);
        //获取视图的大小，以点为单位。
        let winSize = cc.director.getWinSize();
        // let winSize = cc.winSize();
        cc.log('视图大小',winSize.width,winSize.height);
        //获取运行场景的可见大小。
        // let visiSize = cc.director.getVisibleSize();
        // cc.log('场景大小',visiSize.width,visiSize.height);
        let winSizePixels = cc.director.getWinSizeInPixels();
        cc.log('winSizePixels',winSizePixels);
        this.horizontalConfiguration = [];
        this.verticalConfiguration = [];
        this.multistageArr = [];
        this.childrenArr = [];

        let self = this;
        window.addEventListener('orientationchange', function(event){
            self.startSence();
            // self.setFitSreenMode();
        });

        // let screenChange = require("screenChangeAction");
        cc.find("Canvas/Layout_landscape/btn_set").on('touchstart', function(event){
            self.cutover();
            console.log("切换");
            // screenChange.testFun();
        });

        if(cc.sys.os == cc.sys.OS_ANDROID){
            cc.log("安卓环境。");
            // this.startSence();
            this.setFitSreenMode();
        }else if(cc.sys.os == cc.sys.OS_IOS){
            cc.log("IOS环境。");
            // this.startSence();
            this.setFitSreenMode();
        }else if(cc.sys.isMobile){
            cc.log("手机环境。");
            // this.startSence();
            this.setFitSreenMode();
        }else{
            this.setFitSreenMode();
        }
    },

    startSence:function(){
        // let winSize = cc.director.getWinSize();
        // let frameSize = cc.view.getFrameSize();
        // cc.view.setFrameSize(frameSize.width,frameSize.height);
        // cc.view.setDesignResolutionSize(frameSize.width,frameSize.height)
        // cc.log("屏幕改变：",frameSize.width,frameSize.height);
        if(window.orientation == 180 || window.orientation==0){
            cc.log("竖屏");
            this.generalPurpose(false);
        }
        if(window.orientation == 90 || window.orientation == -90){
            cc.log("横屏");
            this.generalPurpose(true);
        }
    },

    cutover:function(){
        var frameSize = cc.view.getFrameSize();
        var designResolutionSize = cc.view.getDesignResolutionSize();
        cc.view.setFrameSize(frameSize.height,frameSize.width);
        cc.view.setDesignResolutionSize(designResolutionSize.height,designResolutionSize.width)
        this.setFitSreenMode();
    },
    
    setFitSreenMode:function(){
        var size = cc.view.getFrameSize();
        var w = size.width;
        var h = size.height;
    
        var cvs = cc.find('Canvas').getComponent(cc.Canvas);
        var dw = cvs.designResolution.width;
        var dh = cvs.designResolution.height;

        //如果更宽 则让高显示满
        if((w / h) > (dw / dh)){
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        }else{
            //如果更高，则让宽显示满
            cvs.fitHeight = false;
            cvs.fitWidth = true;
        }

        if(this.horizontalConfiguration.length == 0){
            let hChildren = this.node.getChildByName("Layout_landscape");
            let vChildren = this.node.getChildByName("Layout_portrait");
            this.storeData(hChildren,1);
            this.multistageArr = [];
            this.storeData(vChildren,2);
            this.multistageArr = [];
            this.storeData(hChildren,3);
            cc.log(this.horizontalConfiguration,this.verticalConfiguration,this.childrenArr);
        }

        this.judgeIsHorizontal();
    },

    judgeIsHorizontal:function(){
        let frameSize = cc.view.getFrameSize();
        if(frameSize.width > frameSize.height){
            this.generalPurpose(true);
            cc.log("横屏");
        }else{
            this.generalPurpose(false);
            cc.log("竖屏");
        }
    },

    generalPurpose:function(boolen){//通用排版
        let hClone,vClone;
        let hChildren = this.childrenArr;
        let time = 0.7;
        this.multistageArr = [];
        for(let i = 0; i < hChildren.length; i++){
            hClone = hChildren[i];
            if(boolen){
                for(let j = 0; j < this.horizontalConfiguration.length; j++){
                    vClone = this.horizontalConfiguration[j];
                    if(hClone.name == vClone.name){
                        hClone.width = vClone.width;
                        hClone.height = vClone.height;
                        hClone.active = vClone.active;
                        // hClone.x = vClone.x;
                        // hClone.y = vClone.y;
                        var action = cc.moveTo(time, vClone.x, vClone.y);
                    }
                }
            }else{
                for(let j = 0; j < this.verticalConfiguration.length; j++){
                    vClone = this.verticalConfiguration[j];
                    if(hClone.name == vClone.name){
                        hClone.width = vClone.width;
                        hClone.height = vClone.height;
                        hClone.active = vClone.active;
                        // hClone.x = vClone.x;
                        // hClone.y = vClone.y;
                        var action = cc.moveTo(time, vClone.x, vClone.y);
                    }
                }
            }
            hClone.runAction(action);
        }
    },

    firstTypesetting:function(hClone,vClone){//竖屏子节点布局同步
        if(this.multistageArr.length > 0) this.multistageArr.shift();
        
        for(let i = 0; i < hClone.childrenCount; i++){
            let hC = hClone.children[i];
            let vC = vClone.children[i];
            hC.width = vC.width;
            hC.height = vC.height;
            hC.x = vC.x;
            hC.y = vC.y;
            hC.active = vC.active;
            if(hC.childrenCount > 0){
                var arr = [hC,vC];
                this.multistageArr.push(arr);
            }
        }

        if(this.multistageArr.length > 0){
            var firstArr = this.multistageArr[0];
            this.firstTypesetting(firstArr[0],firstArr[1]);
        }
        return;
    },

    secondTypesetting:function(hClone){//横屏子节点布局同步
        if(this.multistageArr.length > 0) this.multistageArr.shift();
        
        for(let i = 0; i < hClone.childrenCount; i++){
            let hC = hClone.children[i];
            for(let j = 0; j < this.horizontalConfiguration.length; j++){
                let vClone = this.horizontalConfiguration[j];
                if(hC.name == vClone.name){
                    hC.width = vClone.width;
                    hC.height = vClone.height;
                    hC.x = vClone.x;
                    hC.y = vClone.y;
                    hC.active = vClone.active;
                    if(hC.childrenCount > 0){
                        let clone = hC;
                        this.multistageArr.push(clone);
                    }
                }
            }
        }

        if(this.multistageArr.length > 0){
            var firstArr = this.multistageArr[0];
            this.secondTypesetting(firstArr);
        }
        return;
    },

    storeData:function(hChildren,num){//储存布局
        if(this.multistageArr.length > 0) this.multistageArr.shift();
        
        let hClone;
        for(let i = 0; i < hChildren.childrenCount; i++){
            hClone = hChildren.children[i];
            let obj = {};
            obj.name = hClone.name;
            obj.width = hClone.width;
            obj.height = hClone.height;
            obj.x = hClone.x;
            obj.y = hClone.y;
            obj.active = hClone.active;
            if(num == 1){
                this.horizontalConfiguration.push(obj);
            }else if(num == 2){
                this.verticalConfiguration.push(obj);
            }else{
                this.childrenArr.push(hClone);
            }
            if(hClone.childrenCount > 0){
                let clone = hClone;
                this.multistageArr.push(clone);
            }
        }

        if(this.multistageArr.length > 0){
            var firstChild = this.multistageArr[0];
            this.storeData(firstChild,num);
        }
        return;
    },

    // called every frame
    update: function (dt) {
        // let frameSize = cc.view.getFrameSize();
        // if(this.oldFrameSize != frameSize){
        //     this.oldFrameSize = frameSize;
        //     this.judgeIsHorizontal(frameSize);
        //     return;
        // }
    },
});
