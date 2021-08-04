const canvas = document.getElementById("babcanv"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true);
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin);
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 3, 30, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 20, -40));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:0.3}, scene);
    var wallz = [15, 0, 0, -15];
    var wallrot = [0, 1, 1, 0];
    var wallx = [null, -15, 15, null];
    for (i=0;i<4;i++) {
        var wall = BABYLON.MeshBuilder.CreatePlane("wall", {width:30, height:2}, scene);
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution: 0.9}, scene);
        wall.position.y = 1;
        wall.position.z = wallz[i];
        if (wallrot[i] == 1) {
            wall.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2, BABYLON.Space.LOCAL);
        }
        if  (!(wallx[i] == null)) {
            wall.position.x = wallx[i];
        }
    }

    var pole = BABYLON.MeshBuilder.CreateBox("pole", {height:10, width:1, depth:1}, scene);
    pole.position.set(0, 5, 14);
    pole.physicsImpostor = new BABYLON.PhysicsImpostor(pole, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:2}, scene);

    hoop = BABYLON.MeshBuilder.CreateTorus("hoop", {diameter:3, thickness:1}, scene);
    hoop.position.set(0, 10, 12.5);
    hoop.physicsImpostor = new BABYLON.PhysicsImpostor(hoop, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:2}, scene);

    target = new BABYLON.MeshBuilder.CreateBox("targ", {depth:1, width:1, height:1}, scene);
    target.position.set(0, 15, 6.7);
    target.visibility = 0.5;
    var targmat = new BABYLON.StandardMaterial("targmat", scene);
    targmat.diffuseColor = new BABYLON.Color3(0, 0, 1);
    target.material = targmat;
    return scene;
};

basketballs = [];
window.onclick = function() {
    var basketball = BABYLON.MeshBuilder.CreateSphere("basketball", {diameter:1, segments:32}, scene);
    basketball.position.set(0, 4, 0);
    basketball.physicsImpostor = new BABYLON.PhysicsImpostor(basketball, BABYLON.PhysicsImpostor.SphereImpostor, {mass:4.5, restitution:0.3}, scene);
    baskmat = new BABYLON.StandardMaterial("baskmat", scene);
    baskmat.diffuseColor = new BABYLON.Color3(1.00, 0.44, 0.00);
    basketball.material = baskmat;
    var forcedir = target.getAbsolutePosition().subtract(basketball.getAbsolutePosition());
    var forceMag = 5;
    basketball.physicsImpostor.applyImpulse(forcedir.scale(forceMag), basketball.getAbsolutePosition());
    basketballs.push(basketball);
}

setInterval(function() {
    for (i=0;i<basketballs.length;i++) {
        if (basketballs[i].intersectsPoint(new BABYLON.Vector3(0, 9, 12.5))) {
            basketballs[i].material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        }
    }
}, 10);

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
