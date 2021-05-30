/*
global

XR8,
*/



import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './index.scss';
import './style.css';
import '@babel/polyfill';



// const _try = (_function) =>
// {
// 	try
// 	{
// 		_function();
// 	}
// 	catch (_error)
// 	{
// 		alert(_error);
// 	}
// };



window.THREE = THREE;



const [ canvas ] = document.getElementsByTagName('canvas');



const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const gltf_loader = new GLTFLoader();
gltf_loader.setDRACOLoader(draco_loader);

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

// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// const scene = new THREE.Scene();

// const orbit_controls = new OrbitControls(camera, canvas);
// LOG(orbit_controls)
// orbit_controls.enableZoom = true;
// orbit_controls.enableDamping = true;
// orbit_controls.dumpingFactor = 10;



const touch_start1 = new THREE.Vector2();
const touch_start2 = new THREE.Vector2();
let touch_distance_start = 0;
const touch_move1 = new THREE.Vector2();
const touch_move2 = new THREE.Vector2();
let zoom = 1;

window.addEventListener(

	'touchstart',

	(evt) =>
	{
		if (evt.touches.length === 2)
		{
			touch_start1.set(evt.touches[0].clientX / window.innerWidth, evt.touches[0].clientY / window.innerHeight);
			touch_start2.set(evt.touches[1].clientX / window.innerWidth, evt.touches[1].clientY / window.innerHeight);

			touch_distance_start = touch_start1.distanceTo(touch_start2);
		}
	},
);

window.addEventListener(

	'touchmove',

	(evt) =>
	{
		if (evt.touches.length === 2)
		{
			touch_move1.set(evt.touches[0].clientX / window.innerWidth, evt.touches[0].clientY / window.innerHeight);
			touch_move2.set(evt.touches[1].clientX / window.innerWidth, evt.touches[1].clientY / window.innerHeight);

			zoom += (touch_move1.distanceTo(touch_move2) - touch_distance_start) * 2;

			if (zoom <= 0.1)
			{
				zoom = 0.1;
			}

			touch_distance_start = touch_move1.distanceTo(touch_move2);

			_scene.children.forEach(

				(elm) =>
				{
					if (elm.isMesh || elm instanceof THREE.Object3D)
					{
						elm.scale.set(zoom, zoom, zoom);
					}
				},
			);
		}
	},
);



let animation_end_counter = 0;



const loadModel = (file_path) =>
	new Promise(

		(resolve) =>
		{
			gltf_loader.load(

				file_path,

				(gltf) =>
				{
					if (gltf.animations.length > 0)
					{
						gltf.scene.animations = {};

						gltf.scene.mixer = new THREE.AnimationMixer(gltf.scene);

						gltf.animations.forEach(

							(animation) =>
							{
								const action = gltf.scene.mixer.clipAction(animation);

								action.loop = THREE.LoopOnce;

								action.clampWhenFinished = true;

								gltf.scene.animations[animation.name] = action;
							},
						);
					}

					gltf.scene.traverse(

						(elm) =>
						{
							if (elm.isMesh)
							{
								if (Array.isArray(elm.material))
								{
									elm.material.forEach(

										(_elm) =>
										{
											_elm.envMap = cube_map;
											_elm.needsUpdate = true;
										},
									);
								}
								else
								{
									elm.material.envMap = cube_map;
									elm.material.needsUpdate = true;
								}
							}
						},
					);

					// gltf.scene.scale.set(zoom, zoom, zoom);
					// gltf.scene.position.copy(xz_plane_intersection);

					// alert(xz_plane_intersection.x, xz_plane_intersection.y, xz_plane_intersection.z);

					// gltf.scene.position.set(0, 0, -10);

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



let grid_mesh = null;
let scene_mesh = null;
let meatman_mesh = null;
let grill_mesh = null;
let sauces_mesh = null;
let spices_mesh = null;
const sauces_children = {};



// window.addEventListener(

// 	'load',

// 	async () =>
// 	{
// 		const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);

// 		scene.add(ambient_light);

// 		cube_map =
// 			await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

// 		scene_mesh = await loadModel('models/Scene.glb');
// 		meatman_mesh = await loadModel('models/Meatman.glb');
// 		grill_mesh = await loadModel('models/Grill.glb');

// 		scene.add(scene_mesh);
// 		scene.add(meatman_mesh);
// 		scene.add(grill_mesh);

// 		scene.visible = false;

// 		window.__START__ = () =>
// 		{
// 			scene_mesh.animations['Scene_Start'].stop();
// 			meatman_mesh.animations['Start'].stop();
// 			grill_mesh.animations['Grill_Start'].stop();

// 			scene_mesh.animations['Scene_Start'].play();
// 			meatman_mesh.animations['Start'].play();
// 			grill_mesh.animations['Grill_Start'].play();

// 			scene.visible = true;
// 		};

// 		document.getElementsByClassName('load-section')[0].style.display = 'none';
// 		document.getElementsByClassName('camera-section')[0].style.display = 'block';

// 		// const animate = () =>
// 		// {
// 		// 	requestAnimationFrame(animate);

// 		// 	// orbit_controls.update();

// 		// 	const clock_delta = clock.getDelta();

// 		// 	scene_mesh.mixer.update(clock_delta);
// 		// 	meatman_mesh.mixer.update(clock_delta);
// 		// 	grill_mesh.mixer.update(clock_delta);

// 		// 	renderer.render(scene, camera);
// 		// };

// 		// animate();
// 	},
// );



window.addEventListener(

	'xrloaded',

	() =>
	{
		XR8.addCameraPipelineModules(

			[
				XR8.GlTextureRenderer.pipelineModule(),
				XR8.Threejs.pipelineModule(),
				XR8.XrController.pipelineModule(),

				{
					name: 'threejsinitscene',

					onStart: async () =>
					{
						document.getElementsByClassName('load-section')[0].style.display = 'none';
						document.getElementsByClassName('camera-header')[0].style.display = '';
						document.getElementsByClassName('camera-section')[0].style.display = 'block';

						const { renderer, camera, scene } = XR8.Threejs.xrScene();

						_scene = scene;
						_camera = camera;

						renderer.setSize(window.innerWidth, window.innerHeight);

						renderer.outputEncoding = THREE.sRGBEncoding;

						XR8.XrController.updateCameraProjectionMatrix(

							{
								cam:
								{
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

						cube_map =
							await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

						scene_mesh = await loadModel('models/Scene.glb');
						meatman_mesh = await loadModel('models/Meatman.glb');
						grill_mesh = await loadModel('models/Grill.glb');
						sauces_mesh = await loadModel('models/Sauces.glb');
						spices_mesh = await loadModel('models/Spices.glb');

						Array.from(document.getElementsByClassName('camera-section')[2].getElementsByClassName('slider-block-item')).forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										document.getElementsByClassName('camera-section')[2].style.display = 'none';

										scene_mesh.animations['Scene_Start'].stop();
										meatman_mesh.animations['Start'].stop();
										grill_mesh.animations['Grill_Start'].stop();

										scene_mesh.animations['Scene_GetFood'].play();
										meatman_mesh.animations['Get_Food'].play();
									},
								);
							},
						);

						meatman_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name === 'Start')
								{
									document.getElementsByClassName('camera-section')[2].style.display = 'block';
								}
								else if (action?._clip?.name === 'Get_Food')
								{
									scene.add(sauces_mesh);

									scene_mesh.animations['Scene_GetFood'].stop();
									meatman_mesh.animations['Get_Food'].stop();

									sauces_mesh.animations['Sauces_Start'].play();
								}
								else if (action?._clip?.name === 'Marinade_Speak')
								{
									scene.remove(sauces_mesh);
									scene.add(spices_mesh);

									meatman_mesh.animations['Marinade_Speak'].stop();

									spices_mesh.animations['Spices_Start'].play();
								}
							},
						);

						const sauce_buttons = Array.from(document.getElementsByClassName('camera-section')[3].getElementsByClassName('slider-block-item'));

						sauce_buttons.forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										sauces_mesh.animations['Sauces_Start'].stop();
										sauces_mesh.animations['Sauces_Vinegar'].stop();
										sauces_mesh.animations['Sauces_Mayonnaise'].stop();
										sauces_mesh.animations['Sauces_SoySauce'].stop();

										meatman_mesh.animations['Marinade_Vinegar'].stop();
										meatman_mesh.animations['Marinade_Mayonnaise'].stop();
										meatman_mesh.animations['Marinade_SoySauce'].stop();
										meatman_mesh.animations['Marinade_Speak'].stop();
									},
								);
							},
						);

						sauce_buttons[0].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[0].style.display = 'none';

								sauces_mesh.animations['Sauces_Vinegar'].play();
								meatman_mesh.animations['Marinade_Vinegar'].play();
							},
						);

						sauce_buttons[1].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[1].style.display = 'none';

								sauces_mesh.animations['Sauces_Mayonnaise'].play();
								meatman_mesh.animations['Marinade_Mayonnaise'].play();
							},
						);

						sauce_buttons[2].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[2].style.display = 'none';

								sauces_mesh.animations['Sauces_SoySauce'].play();
								meatman_mesh.animations['Marinade_SoySauce'].play();
							},
						);

						sauce_buttons[3].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[3].style.display = 'none';

								meatman_mesh.animations['Marinade_Speak'].play();
							},
						);

						sauces_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name === 'Sauces_Start')
								{
									document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
								else if (action?._clip?.name === 'Sauces_Vinegar')
								{
									sauces_children['Uksus'].visible = false;
								}
								else if (action?._clip?.name === 'Sauces_Mayonnaise')
								{
									sauces_children['Mayonez'].visible = false;
								}
								else if (action?._clip?.name === 'Sauces_SoySauce')
								{
									sauces_children['Soy_sous'].visible = false;
								}
							},
						);

						Array.from(document.getElementsByClassName('camera-section')[4].getElementsByClassName('slider-block-item')).forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										document.getElementsByClassName('camera-section')[4].style.display = 'none';
										document.getElementsByClassName('camera-section')[5].style.display = 'block';
									},
								);
							},
						);

						spices_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name === 'Spices_Start')
								{
									document.getElementsByClassName('camera-section')[4].style.display = 'block';
								}
							},
						);

						grid_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));

						grid_mesh.rotation.x = -Math.PI * 0.5;

						scene.add(grid_mesh);

						raycaster.setFromCamera(screen_center, camera);

						raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

						document.getElementsByClassName('camera-section')[0].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[1].addEventListener(

									'click',

									() =>
									{
										scene.visible = false;

										scene.remove(grid_mesh);

										grid_mesh = null;

										scene_mesh.scale.set(zoom, zoom, zoom);
										scene_mesh.position.copy(xz_plane_intersection);

										meatman_mesh.scale.set(zoom, zoom, zoom);
										meatman_mesh.position.copy(xz_plane_intersection);

										grill_mesh.scale.set(zoom, zoom, zoom);
										grill_mesh.position.copy(xz_plane_intersection);

										sauces_mesh.scale.set(zoom, zoom, zoom);
										sauces_mesh.position.copy(xz_plane_intersection);

										sauces_mesh.traverse(

											(elm) =>
											{
												if (

													elm.name === 'Mayonez' ||
													elm.name === 'Uksus' ||
													elm.name === 'Soy_sous'
												)
												{
													sauces_children[elm.name] = elm;
												}
											},
										);

										LOG(sauces_children)

										spices_mesh.scale.set(zoom, zoom, zoom);
										spices_mesh.position.copy(xz_plane_intersection);

										scene.add(scene_mesh);
										scene.add(meatman_mesh);
										scene.add(grill_mesh);

										document.getElementsByClassName('camera-section')[1].style.display = 'none';

										setTimeout(

											() =>
											{
												// scene_mesh.animations['Scene_Start'].stop();
												// meatman_mesh.animations['Start'].stop();
												// grill_mesh.animations['Grill_Start'].stop();

												scene_mesh.animations['Scene_Start'].play();
												meatman_mesh.animations['Start'].play();
												grill_mesh.animations['Grill_Start'].play();

												scene.visible = true;
											},

											0,
										);
									},
								);

								document.getElementsByClassName('camera-section')[0].style.display = 'none';
								document.getElementsByClassName('camera-section')[1].style.display = 'block';
							},
						);

						// document.getElementsByClassName('load-section')[0].style.display = 'none';
						// document.getElementsByClassName('camera-section')[0].style.display = 'block';



						// // Recenter content when the canvas is tapped.
						// canvas.addEventListener(

						// 	'touchstart',

						// 	(evt) => {

						// 		evt.touches.length === 1 && XR8.XrController.recenter();
						// 	},

						// 	true,
						// );
					},

					onUpdate: () =>
					{
						if (grid_mesh)
						{
							raycaster.setFromCamera(screen_center, _camera);

							raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

							grid_mesh.position.copy(xz_plane_intersection);

							return;
						}

						const clock_delta = clock.getDelta();

						scene_mesh && scene_mesh.mixer.update(clock_delta);
						meatman_mesh && meatman_mesh.mixer.update(clock_delta);
						grill_mesh && grill_mesh.mixer.update(clock_delta);
						sauces_mesh && sauces_mesh.mixer.update(clock_delta);
						spices_mesh && spices_mesh.mixer.update(clock_delta);
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
