Clazz.declarePackage ("J.renderbio");
Clazz.load (["J.renderbio.BioShapeRenderer"], "J.renderbio.BackboneRenderer", ["JU.P3", "JU.C"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isDataFrame = false;
this.scrBox = null;
this.triangles = null;
Clazz.instantialize (this, arguments);
}, J.renderbio, "BackboneRenderer", J.renderbio.BioShapeRenderer);
Clazz.prepareFields (c$, function () {
this.triangles =  Clazz.newIntArray (-1, [1, 0, 3, 1, 3, 2, 0, 4, 7, 0, 7, 3, 4, 5, 6, 4, 6, 7, 5, 1, 2, 5, 2, 6, 2, 3, 7, 2, 7, 6, 0, 1, 5, 0, 5, 4]);
});
Clazz.overrideMethod (c$, "renderBioShape", 
function (bioShape) {
var checkPass2 = (!this.isExport && !this.vwr.gdata.isPass2);
var showBlocks = this.vwr.getBoolean (603979810);
var showSteps = !showBlocks && this.vwr.getBoolean (603979811) && bioShape.bioPolymer.isNucleic ();
var blockHeight = (showBlocks ? this.vwr.getFloat (570425347) : 0);
this.isDataFrame = this.vwr.ms.isJmolDataFrameForModel (bioShape.modelIndex);
var n = this.monomerCount;
var atoms = this.ms.at;
for (var i = this.bsVisible.nextSetBit (0); i >= 0; i = this.bsVisible.nextSetBit (i + 1)) {
var atomA = atoms[this.leadAtomIndices[i]];
var cA = this.colixes[i];
this.mad = this.mads[i];
var i1 = (i + 1) % n;
this.drawSegment (atomA, atoms[this.leadAtomIndices[i1]], cA, this.colixes[i1], 100, checkPass2);
if (showSteps) {
var g = this.monomers[i];
var bps = g.getBasePairs ();
if (bps != null) {
for (var j = bps.size (); --j >= 0; ) {
var iAtom = bps.get (j).getPartnerAtom (g);
if (iAtom > i) this.drawSegment (atomA, atoms[iAtom], cA, cA, 1000, checkPass2);
}
}} else if (showBlocks && atomA.nBackbonesDisplayed > 0 && this.monomers[i].isNucleicMonomer ()) {
cA = JU.C.getColixInherited (cA, atomA.colixAtom);
if (checkPass2 && !this.setBioColix (cA)) continue;
var g = this.monomers[i];
if (this.scrBox == null) {
this.scrBox =  new Array (8);
for (var j = 0; j < 8; j++) this.scrBox[j] =  new JU.P3 ();

}var oxyz = g.getDSSRFrame (this.vwr);
var box = g.dssrBox;
var lastHeight = g.dssrBoxHeight;
var isPurine = g.isPurine ();
if (box == null || lastHeight != blockHeight) {
g.dssrBoxHeight = blockHeight;
if (box == null) {
box =  new Array (8);
for (var j = 8; --j >= 0; ) box[j] =  new JU.P3 ();

g.dssrBox = box;
}var uc = this.vwr.getSymTemp ().getUnitCell (oxyz, false, null);
uc.toFractional (oxyz[0], true);
uc.setOffsetPt (JU.P3.new3 (oxyz[0].x - 2.25, oxyz[0].y + 5, oxyz[0].z - blockHeight / 2));
var x = 4.5;
var y = (isPurine ? -4.5 : -3.0);
var z = blockHeight;
uc.toCartesian (box[0] = JU.P3.new3 (0, 0, 0), false);
uc.toCartesian (box[1] = JU.P3.new3 (x, 0, 0), false);
uc.toCartesian (box[2] = JU.P3.new3 (x, y, 0), false);
uc.toCartesian (box[3] = JU.P3.new3 (0, y, 0), false);
uc.toCartesian (box[4] = JU.P3.new3 (0, 0, z), false);
uc.toCartesian (box[5] = JU.P3.new3 (x, 0, z), false);
uc.toCartesian (box[6] = JU.P3.new3 (x, y, z), false);
uc.toCartesian (box[7] = JU.P3.new3 (0, y, z), false);
}for (var j = 0; j < 8; j++) this.vwr.tm.transformPt3f (box[j], this.scrBox[j]);

for (var j = 0; j < 36; ) this.g3d.fillTriangle3f (this.scrBox[this.triangles[j++]], this.scrBox[this.triangles[j++]], this.scrBox[this.triangles[j++]], false);

var atomB = g.getC1P ();
var atomC = g.getN0 ();
if (atomB != null && atomC != null) {
this.drawSegmentAB (atomA, atomB, cA, cA, 1000);
this.drawSegmentAB (atomB, atomC, cA, cA, 1000);
}}}
}, "J.shapebio.BioShape");
Clazz.defineMethod (c$, "drawSegment", 
 function (atomA, atomB, colixA, colixB, max, checkPass2) {
if (atomA.nBackbonesDisplayed == 0 || atomB.nBackbonesDisplayed == 0 || this.ms.isAtomHidden (atomB.i) || !this.isDataFrame && max < 1000 && atomA.distanceSquared (atomB) > max) return;
colixA = JU.C.getColixInherited (colixA, atomA.colixAtom);
colixB = JU.C.getColixInherited (colixB, atomB.colixAtom);
if (checkPass2 && !this.setBioColix (colixA) && !this.setBioColix (colixB)) return;
this.drawSegmentAB (atomA, atomB, colixA, colixB, max);
}, "JM.Atom,JM.Atom,~N,~N,~N,~B");
Clazz.defineMethod (c$, "drawSegmentAB", 
 function (atomA, atomB, colixA, colixB, max) {
var xA = atomA.sX;
var yA = atomA.sY;
var zA = atomA.sZ;
var xB = atomB.sX;
var yB = atomB.sY;
var zB = atomB.sZ;
var mad = this.mad;
if (max == 1000) mad = mad >> 1;
if (mad < 0) {
this.g3d.drawLine (colixA, colixB, xA, yA, zA, xB, yB, zB);
} else {
var width = Clazz.floatToInt (this.isExport ? mad : this.vwr.tm.scaleToScreen (Clazz.doubleToInt ((zA + zB) / 2), mad));
this.g3d.fillCylinderXYZ (colixA, colixB, 3, width, xA, yA, zA, xB, yB, zB);
}}, "JM.Atom,JM.Atom,~N,~N,~N");
});
