/*
global

XR8,
*/

/*
eslint-disable

max-statements,
*/



import * as THREE from 'three/src/Three.js';
import ExternalDataLoader from 'external-data-loader';
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

const external_data_loader = new ExternalDataLoader();
const CubeTextureLoader = new THREE.CubeTextureLoader();
CubeTextureLoader.setPath('textures/cubemap/');

let cube_map = null;



const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);



const raycaster = new THREE.Raycaster();
const screen_center = new THREE.Vector2();
const xz_plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
const xz_plane_intersection = new THREE.Vector3();
let _renderer = null;
let _camera = null;
let _scene = null;
const __scene = new THREE.Scene();
// __scene.add(ambient_light);
// LOG(__scene)

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

			// _scene.scale.set(zoom, zoom, zoom);

			_scene.children.forEach(

				(elm) =>
				{
					if (elm?.scale?.set?.call)
					{
						elm.scale.set(zoom, zoom, zoom);
					}
				},
			);

			// __scene.children.forEach(

			// 	(elm) =>
			// 	{
			// 		if (elm.isMesh || elm instanceof THREE.Object3D)
			// 		{
			// 			elm.scale.set(zoom, zoom, zoom);
			// 		}
			// 	},
			// );
		}
	},
);

const parseGlb = (arraybuffer) =>
	new Promise(

		(resolve) =>
		{
			gltf_loader.parse(

				arraybuffer,

				'/',

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

								if (

									animation.name !== 'Idle_Marinade&Spices' &&
									animation.name !== 'Scene_Idle_Food' &&
									animation.name !== 'Scene_Marinade&Spices' &&
									animation.name !== 'Final_Idle'
								)
								{
									action.loop = THREE.LoopOnce;

									action.clampWhenFinished = true;
								}

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
											// _elm.depthTest = false;
											_elm.envMap = cube_map;
											_elm.needsUpdate = true;
										},
									);
								}
								else
								{
									// elm.material.depthTest = false;
									elm.material.envMap = cube_map;
									elm.material.needsUpdate = true;
								}
							}
						},
					);

					resolve(gltf.scene);
				},
			);
		},
	);



let grid_mesh = null;
let scene_mesh = null;
let meatman_mesh = null;
let grill_mesh = null;
let sauces_mesh = null;
let spices_mesh = null;
let plane_material = null;
let plane = null;
// let custom_material = null;
let qwe = null;
let qwe2 = null;
// const sauces_children = {};



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
						const { renderer, camera, scene } = XR8.Threejs.xrScene();

						// camera.matrixAutoUpdate = false;

						_renderer = renderer;
						_camera = camera;
						_scene = scene;

						renderer.setSize(window.innerWidth, window.innerHeight);

						renderer.outputEncoding = THREE.sRGBEncoding;
						renderer.sortObjects = false;

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

						// const ambient_light = new THREE.AmbientLight(0xFFFFFF, 1);

						scene.add(ambient_light);
						// __scene.add(ambient_light.clone());

						const [ scale_item ] = document.getElementsByClassName('scale-item');
						const [ percent ] = document.getElementsByClassName('percent');

						const
							{
								// posx,
								// negx,
								// posy,
								// negy,
								// posz,
								// negz,
								scene_model_binary,
								meatman_model_binary,
								grill_model_binary,
								sauces_model_binary,
								spices_model_binary,
							} = await external_data_loader.load(

								{
									sources:
									{
										// posx:
										// {
										// 	source: 'textures/cubemap/posx.jpg',
										// 	type: 'image',
										// },

										// negx:
										// {
										// 	source: 'textures/cubemap/negx.jpg',
										// 	type: 'image',
										// },

										// posy:
										// {
										// 	source: 'textures/cubemap/posy.jpg',
										// 	type: 'image',
										// },

										// negy:
										// {
										// 	source: 'textures/cubemap/negy.jpg',
										// 	type: 'image',
										// },

										// posz:
										// {
										// 	source: 'textures/cubemap/posz.jpg',
										// 	type: 'image',
										// },

										// negz:
										// {
										// 	source: 'textures/cubemap/negz.jpg',
										// 	type: 'image',
										// },

										scene_model_binary:
										{
											source: 'models/Scene.glb',
											type: 'arraybuffer',
										},

										meatman_model_binary:
										{
											source: 'models/Meatman.glb',
											type: 'arraybuffer',
										},

										grill_model_binary:
										{
											source: 'models/Grill.glb',
											type: 'arraybuffer',
										},

										sauces_model_binary:
										{
											source: 'models/Sauces.glb',
											type: 'arraybuffer',
										},

										spices_model_binary:
										{
											source: 'models/Spices.glb',
											type: 'arraybuffer',
										},
									},

									progress:

									() =>
									{
										const percent_loaded =
											`${ Math.round(external_data_loader.loaded / external_data_loader.length * 100) }%`;

										percent.innerHTML = percent_loaded;

										scale_item.style.width = percent_loaded;
									},
								},
							);

						// cube_map = new THREE.CubeTexture(

						// 	[
						// 		posx,
						// 		negx,
						// 		posy,
						// 		negy,
						// 		posz,
						// 		negz,
						// 	],
						// );

						cube_map =
							await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

						scene_mesh = await parseGlb(scene_model_binary);
						meatman_mesh = await parseGlb(meatman_model_binary);
						grill_mesh = await parseGlb(grill_model_binary);
						sauces_mesh = await parseGlb(sauces_model_binary);
						spices_mesh = await parseGlb(spices_model_binary);

						const meat_buttons =
							Array.from(document.getElementsByClassName('camera-section')[2].getElementsByClassName('slider-block-item'));

						const sauce_buttons =
							Array.from(document.getElementsByClassName('camera-section')[3].getElementsByClassName('slider-block-item'));

						const spices_buttons =
							Array.from(document.getElementsByClassName('camera-section')[4].getElementsByClassName('slider-block-item'));

						meat_buttons.forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										document.getElementsByClassName('camera-section')[2].style.display = 'none';

										meatman_mesh.animations['Idle_Food'].stop();
										meatman_mesh.animations['Get_Food'].play();

										scene_mesh.animations['Scene_Idle_Food'].stop();
										scene_mesh.animations['Scene_GetFood'].play();
									},
								);
							},
						);

						scene_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								action?._clip?.name &&

									scene_mesh.animations[action._clip.name].stop();

								switch (action._clip.name)
								{
								case 'Scene_Start':

									scene_mesh.animations['Scene_Idle_Food'].play();

									break;

								case 'Scene_GetFood':

									scene_mesh.animations['Scene_Marinade&Spices'].play();

									break;

								default:
								}
							},
						);

						grill_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									grill_mesh.visible = false;

									grill_mesh.animations[action._clip.name].stop();
								}
							},
						);

						sauces_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									sauces_mesh.animations[action._clip.name].stop();

									document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
							},
						);

						spices_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									spices_mesh.animations[action._clip.name].stop();

									document.getElementsByClassName('camera-section')[4].style.display = 'block';
								}
							},
						);

						meatman_mesh.mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meatman_mesh.animations[action._clip.name].stop();

									switch (action._clip.name)
									{
									case 'Start':

										meatman_mesh.animations['Idle_Food'].play();

										document.getElementsByClassName('camera-section')[2].style.display = 'block';

										break;

									case 'Get_Food':

										// scene.add(sauces_mesh);
										sauces_mesh.visible = true;

										meatman_mesh.animations['Idle_Marinade&Spices'].play();

										sauces_mesh.animations['Sauces_Start'].play();

										break;


									case 'Marinade_Wrong02':
									case 'Marinade_Wrong02.001':
									case 'Marinade_Wrong03':
									case 'Get_Spices':

										meatman_mesh.animations['Idle_Marinade&Spices'].play();

										break;

									case 'Marinade_Speak':

										sauces_mesh.visible = false;
										spices_mesh.visible = false;

										meatman_mesh.animations['Idle_Marinade&Spices'].play();

										spices_mesh.animations['Spices_Start'].play();

										break;

									case 'Final':

										meatman_mesh.animations['Final_Idle'].play();

										document.getElementsByClassName('camera-section')[4].style.display = 'none';
										document.getElementsByClassName('camera-section')[5].style.display = 'block';

										// break;

										break;

									// case 'Final_Speak':

									// 	meatman_mesh.animations['Final_Idle'].play();

									// 	document.getElementsByClassName('camera-section')[4].style.display = 'none';
									// 	document.getElementsByClassName('camera-section')[5].style.display = 'block';

									// 	break;

									default:
									}
								}
							},
						);

						sauce_buttons[0].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[0].style.display = 'none';

								meatman_mesh.animations['Idle_Marinade&Spices'].stop();
								meatman_mesh.animations['Marinade_Wrong02'].play();
							},
						);

						sauce_buttons[1].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[1].style.display = 'none';

								meatman_mesh.animations['Idle_Marinade&Spices'].stop();
								meatman_mesh.animations['Marinade_Wrong02.001'].play();
							},
						);

						sauce_buttons[2].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[2].style.display = 'none';

								meatman_mesh.animations['Idle_Marinade&Spices'].stop();
								meatman_mesh.animations['Marinade_Wrong03'].play();
							},
						);

						sauce_buttons[3].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[3].style.display = 'none';

								meatman_mesh.animations['Idle_Marinade&Spices'].stop();
								meatman_mesh.animations['Marinade_Speak'].play();
							},
						);

						spices_buttons.slice(0, -1).forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										meatman_mesh.animations['Idle_Marinade&Spices'].stop();
										meatman_mesh.animations['Get_Spices'].play();
									},
								);
							},
						);

						spices_buttons.slice(-1)[0].addEventListener(

							'click',

							() =>
							{
								meatman_mesh.animations['Idle_Marinade&Spices'].stop();
								meatman_mesh.animations['Final'].play();
							},
						);

						grid_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));

						grid_mesh.rotation.x = -Math.PI * 0.5;

						scene.add(grid_mesh);



						const plane_noise_texture = new THREE.TextureLoader().load('textures/smooth-noise.jpg');
						plane_noise_texture.wrapS = THREE.RepeatWrapping;
						plane_noise_texture.wrapT = THREE.RepeatWrapping;

						const plane_circle_texture = new THREE.TextureLoader().load('textures/smooth-circle.png');
						plane_circle_texture.wrapS = THREE.RepeatWrapping;
						plane_circle_texture.wrapT = THREE.RepeatWrapping;

						plane_material = new THREE.ShaderMaterial(

							{

								vertexShader:

								`varying vec2 vUv1;
								varying vec2 vUv2;
								uniform float time;

								void main ()
								{
									vUv1 = vec2(length(position));
									vUv2 = uv;

									vec4 transformed = modelMatrix * vec4(position, 1.0);

									// transformed.y += 1.5 + sin(time * 30.0) * 0.1;

									gl_Position = projectionMatrix * viewMatrix * transformed;
								}`,

								fragmentShader:

								`uniform sampler2D noise;
								uniform sampler2D circle;
								uniform float time;

								varying vec2 vUv1;
								varying vec2 vUv2;

								float rand (vec2 co)
								{
									return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
								}

								void main ()
								{
									gl_FragColor.rgb =
										texture2D(noise, vUv1 - time + acos((vUv2.t - 0.5))).rgb +
										texture2D(noise, vUv1 - time + acos((vUv2.s - 0.5))).rgb +
										texture2D(noise, vUv1 - time + asin((vUv2.t - 0.5))).rgb +
										texture2D(noise, vUv1 - time + asin((vUv2.s - 0.5))).rgb;

									gl_FragColor.rgb /= 4.0;

									gl_FragColor.a = 1.0;

									// gl_FragColor.rgb /= 4.0;

									gl_FragColor.rgb += smoothstep(0.0, 1.0, 1.0 - length(vUv1)) * 3.0 * (1.0 + sin(time * 50.0) * 0.1);

									gl_FragColor.rgb *= vec3(95.0 / 255.0, 86.0 / 255.0, 175.0 / 255.0);

									// gl_FragColor.rgb *= 1.5;

									gl_FragColor.a = smoothstep(0.5, 1.0, pow(length(gl_FragColor.rgb), 2.0)) * smoothstep(0.0, 1.0, 0.8 - length(vUv1));

									// // gl_FragColor.a *= 0.75;

									// gl_FragColor.rgb *= vec3(95.0 / 255.0, 86.0 / 255.0, 175.0 / 255.0);

									// // gl_FragColor.a = 1.0;
								}`,

								uniforms:
								{
									noise: { value: plane_noise_texture },

									circle: { value: plane_circle_texture },

									time: { value: 0 },
								},

								transparent: true,

								depthTest: false,
								// depthWrite: false,
							},
						);

						plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), plane_material);



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

										grid_mesh.visible = false;

										grid_mesh = null;

										// xz_plane_intersection.set(0, -0.8, -6);

										plane.scale.set(zoom, zoom, zoom);
										plane.position.copy(xz_plane_intersection);
										// plane.renderOrder = 1;

										scene_mesh.scale.set(zoom, zoom, zoom);
										scene_mesh.position.copy(xz_plane_intersection);
										scene_mesh.visible = false;
										// scene_mesh.children[0].children[24].visible = false;

										meatman_mesh.scale.set(zoom, zoom, zoom);
										meatman_mesh.position.copy(xz_plane_intersection);

										meatman_mesh.children[0].children[15].visible = false;
										// meatman_mesh.children[0].children[16].visible = false;
// window.__qwe = scene_mesh.children[0].children;
										// LOG(scene_mesh.children[0].children)
										// meatman_mesh.children[0].children[15].position.y += 1;
										// meatman_mesh.children[0].children[15].material.depthTest = false;

										meatman_mesh.children[0].children[15].material.transparent = true;
										qwe = new THREE.Mesh(meatman_mesh.children[0].children[15].geometry.clone(), meatman_mesh.children[0].children[15].material);
										qwe.visible = true;
										qwe.scale.set(zoom, zoom, zoom);
										qwe.position.copy(xz_plane_intersection);

										meatman_mesh.children[0].children[16].material.transparent = true;
										qwe2 = new THREE.Mesh(meatman_mesh.children[0].children[16].geometry.clone(), meatman_mesh.children[0].children[16].material);
										qwe2.visible = true;
										qwe2.scale.set(zoom, zoom, zoom);
										qwe2.position.copy(xz_plane_intersection);

										grill_mesh.scale.set(zoom, zoom, zoom);
										grill_mesh.position.copy(xz_plane_intersection);

										sauces_mesh.visible = false;
										sauces_mesh.scale.set(zoom, zoom, zoom);
										sauces_mesh.position.copy(xz_plane_intersection);

										spices_mesh.visible = false;
										spices_mesh.scale.set(zoom, zoom, zoom);
										spices_mesh.position.copy(xz_plane_intersection);

										plane.position.z += 0.5;
										qwe.position.z += 0.5;
										qwe2.position.z += 0.5;

										scene.add(scene_mesh);
										scene.add(meatman_mesh);
										scene.add(grill_mesh);
										scene.add(sauces_mesh);
										scene.add(spices_mesh);
										scene.add(plane);
										scene.add(qwe);
										scene.add(qwe2);

										document.getElementsByClassName('camera-section')[1].style.display = 'none';

										setTimeout(

											() =>
											{
												scene_mesh.animations['Scene_Start'].play();
												meatman_mesh.animations['Start'].play();
												grill_mesh.animations.Grill_Start.play();

												scene.visible = true;
											},

											500,
										);
									},
								);

								document.getElementsByClassName('camera-section')[0].style.display = 'none';
								document.getElementsByClassName('camera-section')[1].style.display = 'block';
							},
						);

						document.getElementsByClassName('load-section')[0].style.display = 'none';
						document.getElementsByClassName('camera-header')[0].style.display = '';
						document.getElementsByClassName('camera-section')[0].style.display = 'block';
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

						if (plane_material)
						{
							plane_material.uniforms.time.value += clock_delta * 0.1;

							plane.rotation.copy(_camera.rotation);

							plane.position.y = (1.5 + Math.sin(plane_material.uniforms.time.value * 30.0) * 0.1) * zoom;
							qwe.position.y = plane.position.y;
							const sc = (1 + (Math.sin(plane_material.uniforms.time.value * 30.0) + 1) / 2) * zoom;
							qwe.scale.set(sc, sc, sc);
							qwe2.position.y = plane.position.y;
						}

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
