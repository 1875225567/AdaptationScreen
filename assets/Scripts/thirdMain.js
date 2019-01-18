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
        this.multistageArr = [];

        let self = this;
        // let screenChange = require("screenChangeAction");
        cc.find("Canvas/Layout_landscape/btn_set").on('touchstart', function(event){
            self.cutover();
            console.log("切换");
            // screenChange.testFun();
        });

        this.setFitSreenMode();
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
            this.storeData(hChildren);
            cc.log(this.horizontalConfiguration);
        }

        this.judgeIsHorizontal();
    },

    judgeIsHorizontal:function(){
        let frameSize = cc.view.getFrameSize();
        let hChildren = this.node.getChildByName("Layout_landscape");
        let vChildren = this.node.getChildByName("Layout_portrait");
        if(frameSize.width > frameSize.height){
            hChildren.width = hChildren.width;
            hChildren.height = hChildren.height;
            this.generalPurpose(true,hChildren,vChildren);
            cc.log("横屏");
        }else{
            hChildren.width = vChildren.width;
            hChildren.height = vChildren.height;
            this.generalPurpose(false,hChildren,vChildren);
            cc.log("竖屏");
        }
    },

    generalPurpose:function(boolen,hChildren,vChildren){//通用排版
        let hClone,vClone,hnc;
        // let hNow = this.node.getChildByName("Layout_landscape");
        this.multistageArr = [];
        for(let i = 0; i < hChildren.childrenCount; i++){
            hClone = hChildren.children[i];
            if(boolen){
                for(let j = 0; j < this.horizontalConfiguration.length; j++){
                    vClone = this.horizontalConfiguration[j];
                    if(hClone.name == vClone.name){
                        hClone.width = vClone.width;
                        hClone.height = vClone.height;
                        hClone.x = vClone.x;
                        hClone.y = vClone.y;
                        hClone.active = vClone.active;
                        if(hClone.childrenCount > 0){
                            this.secondTypesetting(hClone);
                        }
                    }
                }
            }else{
                for(let j = 0; j < vChildren.childrenCount; j++){
                    vClone = vChildren.children[j];
                    if(hClone.name == vClone.name){
                        hClone.width = vClone.width;
                        hClone.height = vClone.height;
                        hClone.x = vClone.x;
                        hClone.y = vClone.y;
                        hClone.active = vClone.active;
                        if(hClone.childrenCount > 0){
                            this.firstTypesetting(hClone,vClone);
                        }
                    }
                }
            }
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

    storeData:function(hChildren){//储存横向布局
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
            this.horizontalConfiguration.push(obj);
            if(hClone.childrenCount > 0){
                let clone = hClone;
                this.multistageArr.push(clone);
            }
        }

        if(this.multistageArr.length > 0){
            var firstChild = this.multistageArr[0];
            this.storeData(firstChild);
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
