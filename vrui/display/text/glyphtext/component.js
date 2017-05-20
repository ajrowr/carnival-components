CARNIVAL.registerComponent('vrui.display.text.glyphtext', function () {
    
    var drawableclass = CARNIVAL.primitive.Container;
    
    var GlyphText = function (params) {
        CARNIVAL.component.Component.call(this, params, drawableclass);
        
        var cfg = (params || {}).config || {};
        var input = (params || {}).input || {};
        
        this.fontTag = cfg.fontTag || 'lato-bold';
        this.text = input.text;
        this.glyphPath = '//meshbase.meta4vr.net/_typography/@F@/glyph_@@.obj'.replace('@F@', this.fontTag);
        
        // this.drawable.behaviours.push(function (d,t) {
        //     // return;
        //     var gl = CARNIVAL.engine.gl;
        //     // var p = CARNIVAL.primitive.Poly;
        //
        //     var b = d.bounds;
        //     // var b = {
        //     //     maxX: 1, minX:-1, maxY: 1, minY: -1, maxZ: 1, minZ: -1
        //     // }
        //     var xplus = b.maxX, xminus = b.minX;
        //     var yplus = b.maxY, yminus = b.minY;
        //     var zplus = b.maxZ, zminus = b.minZ;
        //
        //     // var P = CARNIVAL.primitive.Poly;
        //     var P = FCPrimitives;
        //     var A = P.mkVert(xminus, yplus, zplus);
        //     var B = P.mkVert(xplus, yplus, zplus);
        //     var C = P.mkVert(xplus, yminus, zplus);
        //     var D = P.mkVert(xminus, yminus, zplus);
        //     var E = P.mkVert(xplus, yminus, zminus);
        //     var F = P.mkVert(xplus, yplus, zminus);
        //     var G = P.mkVert(xminus, yminus, zminus);
        //     var H = P.mkVert(xminus, yplus, zminus);
        //
        //     var shape = new P.Poly();
        //
        //     /* Front */
        //     shape.normal(0, 0, 1);
        //     shape.add(A, P.tex.tl, D, P.tex.bl, B, P.tex.tr);
        //     shape.add(D, P.tex.bl, C, P.tex.br, B, P.tex.tr);
        //
        //     /* Back */
        //     shape.normal(0, 0, -1);
        //     shape.add(F, P.tex.tl, E, P.tex.bl, H, P.tex.tr);
        //     shape.add(E, P.tex.bl, G, P.tex.br, H, P.tex.tr);
        //
        //     /* Left */
        //     shape.normal(-1, 0, 0);
        //     shape.add(H, P.tex.tl, G, P.tex.bl, A, P.tex.tr);
        //     shape.add(G, P.tex.bl, D, P.tex.br, A, P.tex.tr);
        //
        //     /* Right */
        //     shape.normal(1, 0, 0);
        //     shape.add(B, P.tex.tl, C, P.tex.bl, F, P.tex.tr);
        //     shape.add(C, P.tex.bl, E, P.tex.br, F, P.tex.tr);
        //
        //     /* Top */
        //     shape.normal(0, 1, 0);
        //     shape.add(H, P.tex.tl, A, P.tex.bl, F, P.tex.tr);
        //     shape.add(A, P.tex.bl, B, P.tex.br, F, P.tex.tr);
        //
        //     /* Bottom */
        //     shape.normal(0, -1, 0);
        //     shape.add(D, P.tex.tl, G, P.tex.bl, C, P.tex.tr);
        //     shape.add(G, P.tex.bl, E, P.tex.br, C, P.tex.tr);
        //
        //
        //     d._temporaryGeometry.push({
        //         drawMode: gl.LINES,
        //         indices: shape.indices,
        //         vertices: shape.verts,
        //         modelMat: d.transformationMatrix(),
        //         shape: shape
        //     });
        // })
    };
    
    GlyphText.prototype = Object.create(CARNIVAL.component.Component.prototype);
    
    GlyphText.prototype.prepare = function () {
        var textContainer = this;
        return new Promise(function (resolve, reject) {
            var glyphPromises = [];
            var xOffset = 0;
            for (var i=0; i<textContainer.text.length; i++) {
                var chrCode = textContainer.text.charCodeAt(i);
                if (chrCode == 32) {
                    glyphPromises.push(new Promise(function (resolve, reject){resolve(null);}));
                    continue;
                }
                var meshPath = textContainer.glyphPath.replace('@@', chrCode);
                glyphPromises.push(CARNIVAL.mesh.load(meshPath));
            }
            Promise.all(glyphPromises).then(function (meshes) {
                var bounds = {maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity, minX: Infinity, minY: Infinity, minZ: Infinity};
                for (var i=0; i<meshes.length; i++) {
                    var mesh = meshes[i];
                    if (mesh == null) {
                        xOffset += 0.3*textContainer.drawable.scale;
                        continue;
                    }
                    var meshInfo = CARNIVAL.mesh.analyse(mesh);
                    bounds.maxX = Math.max(bounds.maxX, xOffset+meshInfo.maxX);
                    bounds.minX = Math.min(bounds.minX, meshInfo.minX);
                    bounds.maxY = Math.max(bounds.maxY, meshInfo.maxY);
                    bounds.minY = Math.min(bounds.minY, meshInfo.minY);
                    bounds.maxZ = Math.max(bounds.maxZ, meshInfo.maxZ);
                    bounds.minZ = Math.min(bounds.minZ, meshInfo.minZ);
                    var glyph = new CARNIVAL.mesh.Mesh(mesh, {x:xOffset, y:0, z:0}, {scale:textContainer.drawable.scale}, null,
                                {materialLabel:textContainer.drawable.materialLabel, textureLabel:textContainer.drawable.textureLabel, texture:textContainer.drawable.texture});
                    textContainer.drawable.addChild(glyph);
                    xOffset += meshInfo.maxX*1.2*textContainer.drawable.scale;
                    // console.log('Glyph text bounds:', bounds);
                }
                
                textContainer.bounds = bounds;
                textContainer.drawable.bounds = bounds;
                resolve(textContainer);
            });
            
        })
    };
    
    GlyphText.prototype.meta = {
        ident: 'net.meta4vr.glyphtext'
    };
    
    return GlyphText;
    
}());