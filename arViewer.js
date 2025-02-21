class ARViewer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.tshirt = null;
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('arViewport').appendChild(this.renderer.domElement);
        
        // Load 3D model
        const loader = new THREE.GLTFLoader();
        this.tshirt = await loader.loadAsync('/static/models/tshirt.glb');
        this.scene.add(this.tshirt.scene);
        
        this.setupLights();
        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
        this.scene.add(ambientLight, directionalLight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    async startAR() {
        const session = await navigator.xr.requestSession('immersive-ar');
        this.renderer.xr.setSession(session);
    }
}