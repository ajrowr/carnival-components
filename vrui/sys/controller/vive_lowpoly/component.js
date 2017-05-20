CARNIVAL.registerComponent('vrui.sys.controller.vive_lowpoly', function () {
    
    var drawableclass = CARNIVAL.primitive.Container;
	
	var GenericMotionControllerComponent = function (params={}) {
		// CARNIVAL.component.Component.call(this, params, drawableclass);
		
	}
	
	GenericMotionControllerComponent.prototype.mapButtons = function (params={}) {
		
	}
	
	/* Add a behavior to the controller that runs through a sequence of action detector -> enactor tuples and triggers any that qualify */
	GenericMotionControllerComponent.prototype.mapActions = function (params={}) {
		
	}
	
	GenericMotionControllerComponent.getControllers = function () {
		
	}
    
    var ViveController = function (params={}) {
        CARNIVAL.component.Component.call(this, params, drawableclass);
        this.drawable.pos.y = 0; // default is 1 which really doesn't work for us
        
        var cfg = params.config || {};
        var input = params.input || {};
        
        this.gamepadIndex = cfg.gamepadIndex;
        this.mainTextureLabel = cfg.mainTextureLabel;
        this.altTextureLabel = cfg.altTextureLabel;
        this.mainTexture = cfg.mainTexture;
        this.altTexture = cfg.altTexture;
        
        var ctrl = this;
        var dr = this.drawable;
        var parts = ['controller_body', 'controller_button_menu', 'controller_button_sys',
             'controller_trigger', 'controller_trackpad', 'controller_grip_l', 'controller_grip_r'];
        let pieceTex = idx => (i == 0 && ctrl.mainTexture) || (ctrl.altTexture || ctrl.mainTexture);
        let pieceTexLabel = idx => (i == 0 && ctrl.mainTextureLabel) || (ctrl.altTextureLabel || ctrl.mainTextureLabel);
        for (var i = 0; i < parts.length; i++) {
            var piecemesh = ctrl.resources[parts[i]].mesh;
            var piececfg = {
                materialLabel: 'matteplastic'
            };
            if (ctrl.mainTextureLabel) piececfg.textureLabel = pieceTexLabel(i);
            else if (ctrl.mainTexture) piececfg.texture = pieceTex(i);
            
            var piece = new CARNIVAL.mesh.Mesh(piecemesh, {x:0, y:0, z:0}, {scale:1.0}, null, piececfg);
            dr.addChild(piece);
        }
    };
    
    ViveController.prototype = Object.create(CARNIVAL.component.Component.prototype);
    
    ViveController.makeTracker = FCUtil.makeGamepadTracker;
	ViveController.makeButtonHandler = FCUtil.makeType2ButtonHandler;
    ViveController.makeRayProjector = FCUtil.makeControllerRayProjector;
    
    var asset = function (name) {return '//meshbase.meta4vr.net/_system/platform/htc_vive_v1/controller/vr_controller_lowpoly/@@.obj'.replace('@@', name);}
    ViveController.prototype._requisites = {
        meshes: [
            {label: 'controller_body', src: asset('body')},
            {label: 'controller_button_menu', src: asset('button')},
            {label: 'controller_button_sys', src: asset('sys_button')},
            {label: 'controller_trigger', src: asset('trigger')},
            {label: 'controller_trackpad', src: asset('trackpad')},
            {label: 'controller_grip_l', src: asset('l_grip')},
            {label: 'controller_grip_r', src: asset('r_grip')}
        ]
    }
    
    
    ViveController.prototype.meta = {
        ident: 'net.meta4vr.vivecontroller',
        config: [
            {ident:'mainTextureLabel'},
            {ident:'altTextureLabel'},
            {ident:'gamepadIndex'}
        ],
        input: [
            {ident:'twitchIntensity'},
            {ident:'twitchDuration'}
        ]
    };
    
    return ViveController;
    
}());