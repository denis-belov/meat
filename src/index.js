/*
global

XR8,
*/



import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './index.scss';
import '@babel/polyfill';



const _try = (_function) =>
{
	try {

		_function();
	}
	catch (_error) {

		alert(_error);
	}
};



window.THREE = THREE;



const [ canvas ] = document.getElementsByTagName('canvas');



const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltf_loader = new GLTFLoader();
gltf_loader.setDRACOLoader(draco_loader);



let meatman_mixer = null;
let meatman_actions = null;
let meatman_animation_index = 0;
const clock = new THREE.Clock();



const CubeTextureLoader = new THREE.CubeTextureLoader();
CubeTextureLoader.setPath('textures/cubemap/');

let cube_map = null;



const raycaster = new THREE.Raycaster();
const screen_center = new THREE.Vector2();
const xz_plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
const xz_plane_intersection = new THREE.Vector3();
let _camera = null;
let _scene = null;

let grid_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));

grid_mesh.rotation.x = -Math.PI * 0.5;



// const ind = document.createElement('div');
// ind.style.position = 'absolute';
// ind.style.zIndex = 999999;
// ind.style.left = 0;
// ind.style.top = 0;
// document.body.appendChild(ind);



const touch_start1 = new THREE.Vector2();
const touch_start2 = new THREE.Vector2();
let touch_distance_start = 0;
const touch_move1 = new THREE.Vector2();
const touch_move2 = new THREE.Vector2();
let zoom = 1;

window.addEventListener('touchstart', (evt) => {

	if (evt.touches.length === 2) {

		touch_start1.set(evt.touches[0].clientX / window.innerWidth, evt.touches[0].clientY / window.innerHeight);
		touch_start2.set(evt.touches[1].clientX / window.innerWidth, evt.touches[1].clientY / window.innerHeight);

		touch_distance_start = touch_start1.distanceTo(touch_start2);
	}
});

window.addEventListener('touchmove', (evt) => {

	if (evt.touches.length === 2) {

		touch_move1.set(evt.touches[0].clientX / window.innerWidth, evt.touches[0].clientY / window.innerHeight);
		touch_move2.set(evt.touches[1].clientX / window.innerWidth, evt.touches[1].clientY / window.innerHeight);

		zoom += (touch_move1.distanceTo(touch_move2) - touch_distance_start) * 2;

		if (zoom <= 0.1)
		{
			zoom = 0.1;
		}

		touch_distance_start = touch_move1.distanceTo(touch_move2);

		_scene.children.forEach((elm) => {

			if (elm.isMesh || elm instanceof THREE.Object3D) {

				elm.scale.set(zoom, zoom, zoom);
			}
		});
	}
});



const loadModel = (camera, scene, file_path, object_type) =>
{
	return new Promise(

		(resolve) =>
		{
			gltf_loader.load(

				file_path,

				async (gltf) =>
				{
					if (gltf.animations.length > 0 && object_type === 0)
					{
						meatman_mixer = new THREE.AnimationMixer(gltf.scene);
						meatman_actions = gltf.animations.map
						(
							(animation) =>
							{
								const action = meatman_mixer.clipAction(animation);

								action.loop = THREE.LoopOnce;

								return action;
							},
						);
					}

					// alert(gltf.animations.length);
					// // mixer = new THREE.AnimationMixer(gltf.scene);
					// // const action = mixer.clipAction(gltf.animations[0]);

					gltf.scene.traverse((elm) => {

						if (elm.isMesh) {

							if (Array.isArray(elm.material)) {

								elm.material.forEach(

									(_elm) => {

										_elm.envMap = cube_map;
										_elm.needsUpdate = true;
									},
								);
							}
							else {

								elm.material.envMap = cube_map;
								elm.material.needsUpdate = true;
							}
						}
					});

					gltf.scene.scale.set(zoom, zoom, zoom);
					gltf.scene.position.copy(xz_plane_intersection);

					resolve(gltf.scene);
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

									() => {

										XR8.XrController.configure({ imageTargets: [] });

										document.getElementById('wrapper').style.display = 'block';

										const { camera, scene } = XR8.Threejs.xrScene();

										scene.add(grid_mesh);

										raycaster.setFromCamera(screen_center, camera);

										raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

										const tap3 = async () => {

											document.getElementById('wrapper').style.display = 'none';
											document.getElementById('spinner').style.display = 'block';

											scene.remove(grid_mesh);
											grid_mesh = null;

											cube_map = await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ])

											const factory_mesh = await loadModel(

												camera,

												scene,

												'models/Butcher\'s_Word_ Factory.glb',
											);

											const meatman_mesh = await loadModel(camera, scene, 'models/Meatman.glb', 0);

											scene.add(factory_mesh);
											scene.add(meatman_mesh);

											document.getElementById('next_animation').addEventListener(

												'click',

												(evt) =>
												{
													meatman_actions[meatman_animation_index].play();

													++meatman_animation_index;

													if (meatman_animation_index > meatman_actions.length - 1)
													{
														meatman_animation_index = 0;
													}
												},
											);

											document.getElementById('spinner').style.display = 'none';

											document.getElementById('next_animation').style.display = 'block';
										};

										const tap2 = () => {

											document.getElementById('zoom').style.display = 'none';
											document.getElementsByTagName('span')[2].style.display = 'none';
											document.getElementById('start').style.display = 'inline-block';

											document.getElementById('wrapper').removeEventListener('click', tap2);
											document.getElementById('start').addEventListener('click', tap3);
										};

										const tap1 = () => {

											document.getElementById('click').style.display = 'none';
											document.getElementsByTagName('span')[1].style.display = 'none';
											document.getElementsByTagName('span')[2].style.display = 'initial';
											document.getElementById('zoom').style.display = 'initial';

											document.getElementById('wrapper').removeEventListener('click', tap1);
											document.getElementById('wrapper').addEventListener('click', tap2);
										};

										document.getElementById('wrapper').addEventListener('click', tap1);
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

						_scene = scene;
						_camera = camera;

						renderer.setSize(window.innerWidth, window.innerHeight);

						renderer.outputEncoding = THREE.sRGBEncoding;

						// Sync the xr controller's 6DoF position and camera paremeters with our scene.

						XR8.XrController.updateCameraProjectionMatrix(

							{
								cam: {
									pixelRectWidth: window.innerWidth,
									pixelRectHeight: window.innerHeight,
									nearClipPlane: 0.1,
									farClipPlane: 1000,
								},

								origin: camera.position,
								facing: camera.quaternion,
							},
						);

						const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);

						scene.add(ambient_light);



						// // Recenter content when the canvas is tapped.
						// canvas.addEventListener(

						// 	'touchstart',

						// 	(evt) => {

						// 		evt.touches.length === 1 && XR8.XrController.recenter();
						// 	},

						// 	true,
						// );
					},

					onUpdate: () => {

						if (grid_mesh) {

							raycaster.setFromCamera(screen_center, _camera);

							raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

							grid_mesh.position.copy(xz_plane_intersection);
						}

						meatman_mixer && meatman_mixer.update(clock.getDelta());
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
