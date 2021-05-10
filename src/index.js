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



window.addEventListener(

	'xrloaded',

	() => {

		XR8.addCameraPipelineModules(

			[

				XR8.GlTextureRenderer.pipelineModule(),
				XR8.Threejs.pipelineModule(),
				XR8.XrController.pipelineModule(),

				{

					name: 'threejsinitscene',

					onStart: () => {

						const { scene, camera, renderer } = XR8.Threejs.xrScene();

						const ambient_light = new THREE.AmbientLight(0xFFFFFF);
						// ambient_light.intensity = 2;

						scene.add(ambient_light);

						const spot_light = new THREE.SpotLight(0xFFFFFF);
						spot_light.intensity = 2;
						spot_light.distance = 0;
						spot_light.penumbra = 1;
						spot_light.decay = 2;
						spot_light.angle = Math.PI * 0.5;
						spot_light.position.set(0, 10, 0);

						scene.add(spot_light);
						scene.add(spot_light.target);

						// prevent scroll/pinch gestures on canvas
						canvas.addEventListener(

							'touchmove',

							(evt) => evt.preventDefault(),
						);

						// Sync the xr controller's 6DoF position and camera paremeters with our scene.
						XR8.XrController
							.updateCameraProjectionMatrix({ origin: camera.position, facing: camera.quaternion });

						const gl = renderer.getContext();

						gl.viewport(0, 0, window.innerWidth, window.innerHeight);

						renderer.setSize(window.innerWidth, window.innerHeight);

						canvas.width = window.innerWidth;
						canvas.height = window.innerHeight;
						canvas.style.width = '100%';
						canvas.style.height = '100%';

						// Recenter content when the canvas is tapped.
						canvas.addEventListener(

							'touchstart',

							(evt) => {

								evt.touches.length === 1 && XR8.XrController.recenter();
							},

							true,
						);

						gltf_loader.load(

							'models/Butcher\'s_Word_ Factory.glb',

							(gltf) => {

								scene.add(gltf.scene);

								// document.getElementById('spinner').style.display = 'none';

								// gltf.animations; // Array<THREE.AnimationClip>
								// gltf.scene; // THREE.Group
								// gltf.scenes; // Array<THREE.Group>
								// gltf.cameras; // Array<THREE.Camera>
								// gltf.asset; // Object
							},

							// (xhr) => {

							// 	console.log((xhr.loaded / xhr.total * 100) + '% loaded');
							// },

							// (error) => {

							// 	alert('An error happened');
							// },
						);
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
