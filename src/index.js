/*
global

XR8,
*/



import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './index.scss';
import '@babel/polyfill';



window.THREE = THREE;



const [ canvas ] = document.getElementsByTagName('canvas');



const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltf_loader = new GLTFLoader();
gltf_loader.setDRACOLoader(draco_loader);



// let mixer = null;
// const clock = new THREE.Clock();



const loadModel = (scene, file_path) =>
{
	return new Promise(

		(resolve) =>
		{
			gltf_loader.load(

				file_path,

				async (gltf) =>
				{
					// mixer = new THREE.AnimationMixer(gltf.scene);
					// // alert(gltf.animations.length);
					// const action = mixer.clipAction(gltf.animations[0]);

					// const CubeTextureLoader = new THREE.CubeTextureLoader();
					// CubeTextureLoader.setPath('textures/cubemap/');

					// const cube_map =
					// 	await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

					// // alert(cube_map);

					// gltf.scene.traverse((elm) => {

					// 	if (elm.isMesh) {

					// 		if (Array.isArray(elm.material)) {

					// 			elm.material.forEach(

					// 				(_elm) => {

					// 					_elm.envMap = cube_map;
					// 					// _elm.side = THREE.FrontSide;
					// 					_elm.needsUpdate = true;
					// 				},
					// 			);
					// 		}
					// 		else {

					// 			elm.material.envMap = cube_map;
					// 			// elm.material.side = THREE.FrontSide;
					// 			elm.material.needsUpdate = true;
					// 		}
					// 	}
					// });

					scene.add(gltf.scene);

					gltf.scene.position.z = -2;

					resolve();

					// const animate = () => {

					// 	mixer && mixer.update(clock.getDelta());

					// 	requestAnimationFrame(animate);
					// };

					// animate();

					// action.play();

					// gltf.animations; // Array<THREE.AnimationClip>
					// gltf.scene; // THREE.Group
					// gltf.scenes; // Array<THREE.Group>
					// gltf.cameras; // Array<THREE.Camera>
					// gltf.asset; // Object
				},

				// (xhr) =>
				// {
				// 	console.log((xhr.loaded / xhr.total * 100) + '% loaded');
				// },

				// (error) =>
				// {
				// 	alert('An error happened');
				// },
			);
		},
	);
}



window.addEventListener(

	'xrloaded',

	() => {

		XR8.XrController.configure({ imageTargets: [ 'logo' ] });

		XR8.addCameraPipelineModules(

			[

				XR8.GlTextureRenderer.pipelineModule(),
				XR8.Threejs.pipelineModule(),
				XR8.XrController.pipelineModule(),

				{
					name: 'eventlogger',

					listeners:

						[
							// {event: 'reality.imageloading', process: logEvent },
							// {event: 'reality.imagescanning', process: logEvent },
							{
								event: 'reality.imagefound',

								process:

									async () => {

										XR8.XrController.configure({ imageTargets: [] });

										alert('image found');

										document.getElementById('spinner').style.display = 'block';

										const { scene } = XR8.Threejs.xrScene();

										await loadModel(

											scene,

											'models/Butcher\'s_Word_ Factory.glb',
											// 'models/Grill.glb',
										);

										await loadModel(scene, 'models/Meatman.glb');

										document.getElementById('spinner').style.display = 'none';
									},
							},
							// {event: 'reality.imageupdated', process: logEvent},
							// {event: 'reality.imagelost', process: logEvent},
						],
				},

				{

					name: 'threejsinitscene',

					onStart: () => {

						const { renderer, camera, scene } = XR8.Threejs.xrScene();

						renderer.setSize(window.innerWidth, window.innerHeight);

						renderer.outputEncoding = THREE.sRGBEncoding;

						// Sync the xr controller's 6DoF position and camera paremeters with our scene.
						XR8.XrController.updateCameraProjectionMatrix(

							{
								cam: {
									pixelRectWidth: window.innerWidth,
									pixelRectHeight: window.innerHeight,
									nearClipPlane: 0.1,
									farClipPlane: 100,
								},

								origin: camera.position,
								facing: camera.quaternion,
							},
						);

						const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);

						scene.add(ambient_light);

						// const spot_light = new THREE.SpotLight(0xFFFFFF);
						// spot_light.intensity = 2;
						// spot_light.distance = 0;
						// spot_light.penumbra = 1;
						// spot_light.decay = 2;
						// spot_light.angle = Math.PI * 0.5;
						// spot_light.position.set(0, 10, 0);

						// scene.add(spot_light);
						// scene.add(spot_light.target);

						// Prevent scroll/pinch gestures on canvas.
						// canvas.addEventListener(

						// 	'touchmove',

						// 	(evt) => evt.preventDefault(),
						// );

						// Recenter content when the canvas is tapped.
						canvas.addEventListener(

							'touchstart',

							(evt) => {

								evt.touches.length === 1 && XR8.XrController.recenter();
							},

							true,
						);
					},
				},
			],
		);

		// XR8.XrController.configure({ disableWorldTracking: true });

		XR8.run({ canvas });
	},
);
