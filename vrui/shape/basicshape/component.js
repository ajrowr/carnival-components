CARNIVAL.registerComponent('vrui.shape.basicshape', function () {
    
    /* TODO explain this */
    // let drawableclass = null;
    
    var Shape = function (params={}) {
        /* Normally a component would pass in a drawable class for autoconstruction. */
        /* However Shape selects a drawable class by examining its parameters. */
        /* Hence we pass in null. */
        /* Note that this also means we need to instanciate our own drawable class and */
        /* handle the adding of behaviours */
        this.shapeName = params.shape;
        if (this.shapeName == 'partition') {
            this._explicitSize = params.draw.size;
        }
        CARNIVAL.component.Component.call(this, params, null);
        
        var config = params.config || {};
        var input = params.input || {};
        var myBehaviors = params.behaviors || [];
        
        var dp = this.drawParams;
        
        /* Decide which drawableClass to use */
        var drawableClass = {
            cuboid: CARNIVAL.shape.Cuboid,
            partition: CARNIVAL.shape.Rectangle,     /* this whole rectangle / segmentedrectangle thing makes no sense */
            segmentedrectangle: CARNIVAL.shape.SegmentedRectangle
        }[this.shapeName];
        
        // drawableClass = CARNIVAL.shape.Cuboid;
        
        this.drawable = new drawableClass(dp.position, dp.size, dp.orientation, {
            materialLabel:dp.materialLabel, textureLabel:dp.textureLabel, 
            texture:dp.texture, shaderLabel:dp.shaderLabel, rotationQuaternion:dp.rotationQuaternion
        });
        myBehaviors.forEach(b => this.addBehavior(b));
        
    }
    
    Shape.prototype = Object.create(CARNIVAL.component.Component.prototype);
    
    Shape.prototype.getCollider = function (colliderType, params) {
        let cT = t => colliderType == t;
        if (cT('planar') && this.shapeName == 'partition') {
            /* TODO FCUtil? */
            return new FCUtil.PlanarCollider({planeNormal:[0, 0, -1], pointOnPlane:[0,0,0]}, this.drawable, null);
        }
    }
    
    
    return Shape;
}());