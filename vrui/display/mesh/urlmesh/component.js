CARNIVAL.registerComponent('vrui.display.mesh.urlmesh', function () {
    
    var drawableClass = CARNIVAL.mesh.Mesh2;
    
    var UrlMesh = function (params = {}) {
        CARNIVAL.component.Component.call(this, params, drawableClass);
        this.drawable.mesh = null;
        
        var cfg = params.config || {};
        this.meshURL = cfg.meshURL;
        
    }
    
    UrlMesh.prototype = Object.create(CARNIVAL.component.Component.prototype);
    
    UrlMesh.prototype.prepare = function () {
        let component = this;
        
        return new Promise(function (resolve, reject) {
            let url = component.meshURL;
            console.log(`Loading mesh from ${url}`);
            CARNIVAL.mesh.load(url)
            .then(function (mesh) {
                console.log(mesh);
                component.drawable.mesh = mesh;
                resolve(component);
            })
        })
    }
    
    
    UrlMesh.prototype.meta = {
        ident: 'net.meta4vr.urlmesh',
        config: [
            {ident: 'meshURL', title:'Mesh Path', type:'text'}
        ],
        input: [
            
        ]
    };
    
    return UrlMesh;
    
    
}());