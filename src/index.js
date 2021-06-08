/*
global

XR8,
*/

/*
eslint-disable

max-statements,
*/



// import * as THREE from 'three';
import * as THREE from 'three/src/Three.js';
import ExternalDataLoader from 'external-data-loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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



const touch_start1 = new THREE.Vector2();
const touch_start2 = new THREE.Vector2();
let touch_distance_start = 0;
const touch_move1 = new THREE.Vector2();
const touch_move2 = new THREE.Vector2();
let zoom = 1;

let trans = 0;
let trans2 = 0;
let change_trans = false;

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
					if (elm?.scale?.set?.call)
					{
						elm.scale.set(zoom, zoom, zoom);
					}
				},
			);
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
									animation.name !== 'Idle_Food' &&
									animation.name !== 'Final_Idle' &&
									animation.name !== 'Scene_Idle_Food' &&
									animation.name !== 'Scene_Marinade&Spices'
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
											_elm.envMap = cube_map;
											_elm.needsUpdate = true;
											_elm.transparent2 = _elm.transparent;
										},
									);
								}
								else
								{
									elm.material.envMap = cube_map;
									elm.material.needsUpdate = true;
									elm.material.transparent2 = elm.material.transparent;
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
const meshes = {};

let plane_material = null;
let plane = null;
let tray = null;
let tray_barbecue = null;
let meat = null;



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

						camera.matrixAutoUpdate = false;

						// _renderer = renderer;
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

						scene.add(ambient_light);

						const [ scale_item ] = document.getElementsByClassName('scale-item');
						const [ percent ] = document.getElementsByClassName('percent');

						const sources = {};

						const paths =
						[
							'models/Scene.glb',
							'models/Meatman.glb',
							'models/Grill.glb',
							'models/Sauces.glb',
							'models/Spices.glb',
							'models/Kupaty_Extra.glb',
							'models/Bacon.glb',
							'models/Sausages_Barbecue.glb',
							'models/Burger.glb',
							'models/Barbecue_Classic.glb',
							'models/Steak.glb',
							'models/Chevapchichi.glb',
						];

						paths
							.forEach(

								(elm) =>
								{
									sources[elm] =
									{
										source: elm,
										type: 'arraybuffer',
									};
								},
							);

						await external_data_loader.load(

							{
								sources,

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

						for (let i = 0; i < paths.length; ++i)
						{
							meshes[paths[i]] = await parseGlb(external_data_loader.content[paths[i]]);
						}

						cube_map =
							await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

						const meat_buttons =
							Array.from(document.getElementsByClassName('camera-section')[2].getElementsByClassName('slider-block-item'));

						const sauce_buttons =
							Array.from(document.getElementsByClassName('camera-section')[3].getElementsByClassName('slider-block-item'));

						const spices_buttons =
							Array.from(document.getElementsByClassName('camera-section')[4].getElementsByClassName('slider-block-item'));

						[
							'models/Kupaty_Extra.glb',
							'models/Bacon.glb',
							'models/Sausages_Barbecue.glb',
							'models/Burger.glb',
							'models/Barbecue_Classic.glb',
							'models/Steak.glb',
							'models/Chevapchichi.glb',
						]
							.forEach(

								(elm, elm_index) =>
								{
									if (elm === 'models/Barbecue_Classic.glb')
									{
										meat_buttons[elm_index].addEventListener(

											'click',

											() =>
											{
												meat = meshes[elm];

												meat.__test.visible = true;

												tray.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												meshes['models/Meatman.glb'].animations['Idle_Food'].stop();
												meshes['models/Meatman.glb'].animations['Get_Food'].play();

												meshes['models/Scene.glb'].animations['Scene_Idle_Food'].stop();
												meshes['models/Scene.glb'].animations['Scene_GetFood'].play();
											},
										);
									}
									else
									{
										meat_buttons[elm_index].addEventListener(

											'click',

											() =>
											{
												meat = meshes[elm];

												meat.__test.visible = true;

												tray_barbecue.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												meshes['models/Meatman.glb'].animations['Idle_Food'].stop();
												meshes['models/Meatman.glb'].animations['Get_Food'].play();

												meshes['models/Scene.glb'].animations['Scene_Idle_Food'].stop();
												meshes['models/Scene.glb'].animations['Scene_GetFood'].play();
											},
										);
									}
								},
							);

						meshes['models/Scene.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								action?._clip?.name &&

									meshes['models/Scene.glb'].animations[action._clip.name].stop();

								switch (action._clip.name)
								{
								case 'Scene_Start':

									meshes['models/Scene.glb'].animations['Scene_Idle_Food'].play();

									break;

								case 'Scene_GetFood':

									meshes['models/Scene.glb'].animations['Scene_Marinade&Spices'].play();

									break;

								default:
								}
							},
						);

						meshes['models/Grill.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Grill.glb'].visible = false;

									meshes['models/Grill.glb'].animations[action._clip.name].stop();
								}
							},
						);

						meshes['models/Sauces.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Sauces.glb'].animations[action._clip.name].stop();

									document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
							},
						);

						meshes['models/Spices.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Spices.glb'].animations[action._clip.name].stop();

									document.getElementsByClassName('camera-section')[4].style.display = 'block';
								}
							},
						);

						meshes['models/Meatman.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Meatman.glb'].animations[action._clip.name].stop();

									switch (action._clip.name)
									{
									case 'Start':

										meshes['models/Meatman.glb'].animations['Idle_Food'].play();

										document.getElementsByClassName('camera-section')[2].style.display = 'block';

										break;

									case 'Get_Food':
									case 'Get_Barbecue':

										meshes['models/Sauces.glb'].visible = true;

										meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();

										meshes['models/Sauces.glb'].animations['Sauces_Start'].play();

										break;


									case 'Marinade_Wrong02':
									case 'Marinade_Wrong02.001':
									case 'Marinade_Wrong03':
									case 'Get_Spices':

										meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();

										break;

									case 'Marinade_Speak':

										meshes['models/Sauces.glb'].visible = false;
										meshes['models/Spices.glb'].visible = true;

										meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();

										meshes['models/Spices.glb'].animations['Spices_Start'].play();

										break;

									case 'Final':

										meshes['models/Meatman.glb'].animations['Final_Idle'].play();

										document.getElementsByClassName('camera-section')[4].style.display = 'none';
										document.getElementsByClassName('camera-section')[5].style.display = 'block';

										break;

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

								meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Marinade_Wrong02'].play();
							},
						);

						sauce_buttons[1].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[1].style.display = 'none';

								meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Marinade_Wrong02.001'].play();
							},
						);

						sauce_buttons[2].addEventListener(

							'click',

							() =>
							{
								sauce_buttons[2].style.display = 'none';

								meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Marinade_Wrong03'].play();
							},
						);

						sauce_buttons[3].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[3].style.display = 'none';

								meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Marinade_Speak'].play();
							},
						);

						spices_buttons.slice(0, -1).forEach(

							(elm) =>
							{
								elm.addEventListener(

									'click',

									() =>
									{
										meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
										meshes['models/Meatman.glb'].animations['Get_Spices'].play();
									},
								);
							},
						);

						spices_buttons.slice(-1)[0].addEventListener(

							'click',

							() =>
							{
								change_trans = true;

								tray.visible = false;

								plane.visible = true;

								meat.visible = true;

								meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Final'].play();
							},
						);

						grid_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true, transparent: true }));

						grid_mesh.rotation.x = -Math.PI * 0.5;

						scene.add(grid_mesh);



						const plane_noise_texture = new THREE.TextureLoader().load('textures/smooth-noise.jpg');
						plane_noise_texture.wrapS = THREE.RepeatWrapping;
						plane_noise_texture.wrapT = THREE.RepeatWrapping;

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

									gl_Position = projectionMatrix * viewMatrix * transformed;

									gl_Position.z = -1.0;
								}`,

								fragmentShader:

								`uniform sampler2D noise;
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

									gl_FragColor.rgb += smoothstep(0.0, 1.0, 1.0 - length(vUv1)) * 3.0 * (1.0 + sin(time * 50.0) * 0.1);

									gl_FragColor.rgb *= vec3(95.0 / 255.0, 86.0 / 255.0, 175.0 / 255.0);

									gl_FragColor.a = smoothstep(0.5, 1.0, pow(length(gl_FragColor.rgb), 2.0)) * smoothstep(0.0, 1.0, 0.8 - length(vUv1));
								}`,

								uniforms:
								{
									noise: { value: plane_noise_texture },

									// n2: { value: plane_noise_texture2 },

									time: { value: 0 },
								},

								transparent: true,

								depthTest: false,
								// depthWrite: true,
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

										xz_plane_intersection.set(0, 0, 0);

										plane.scale.set(zoom, zoom, zoom);
										plane.position.copy(xz_plane_intersection);
										plane.position.add(new THREE.Vector3(0.030909, 0.760915, 0.520341));
										plane.visible = false;

										Object.keys(meshes).forEach(

											(elm) =>
											{
												meshes[elm].scale.set(zoom, zoom, zoom);
												meshes[elm].position.copy(xz_plane_intersection);
											},
										);

										tray = meshes['models/Meatman.glb'].children[0].children[15];
										tray_barbecue = meshes['models/Meatman.glb'].children[0].children[16];
										window._Q = meshes['models/Scene.glb'].children[0].children;
										LOG(_Q)

										meshes['models/Scene.glb'].children[0].children.slice(25).forEach(

											(elm) =>
											{
												elm.visible = false;
											},
										);

										meshes['models/Sauces.glb'].visible = false;
										meshes['models/Spices.glb'].visible = false;

										meshes['models/Kupaty_Extra.glb'].__test = meshes['models/Scene.glb'].children[0].children[27];
										meshes['models/Bacon.glb'].__test = meshes['models/Scene.glb'].children[0].children[25];
										meshes['models/Sausages_Barbecue.glb'].__test = meshes['models/Scene.glb'].children[0].children[28];
										meshes['models/Burger.glb'].__test = meshes['models/Scene.glb'].children[0].children[29];
										meshes['models/Barbecue_Classic.glb'].__test = meshes['models/Scene.glb'].children[0].children[26];
										meshes['models/Steak.glb'].__test = meshes['models/Scene.glb'].children[0].children[31];
										meshes['models/Chevapchichi.glb'].__test = meshes['models/Scene.glb'].children[0].children[30];

										meshes['models/Kupaty_Extra.glb'].visible = false;
										meshes['models/Bacon.glb'].visible = false;
										meshes['models/Sausages_Barbecue.glb'].visible = false;
										meshes['models/Burger.glb'].visible = false;
										meshes['models/Barbecue_Classic.glb'].visible = false;
										meshes['models/Steak.glb'].visible = false;
										meshes['models/Chevapchichi.glb'].visible = false;

										scene.add(meshes['models/Scene.glb']);
										scene.add(meshes['models/Meatman.glb']);
										scene.add(meshes['models/Grill.glb']);
										scene.add(meshes['models/Sauces.glb']);
										scene.add(meshes['models/Spices.glb']);
										scene.add(plane);
										scene.add(meshes['models/Kupaty_Extra.glb']);
										scene.add(meshes['models/Bacon.glb']);
										scene.add(meshes['models/Sausages_Barbecue.glb']);
										scene.add(meshes['models/Burger.glb']);
										scene.add(meshes['models/Barbecue_Classic.glb']);
										scene.add(meshes['models/Steak.glb']);
										scene.add(meshes['models/Chevapchichi.glb']);

										document.getElementsByClassName('camera-section')[1].style.display = 'none';

										setTimeout(

											() =>
											{
												meshes['models/Scene.glb'].animations['Scene_Start'].play();
												meshes['models/Meatman.glb'].animations['Start'].play();
												meshes['models/Grill.glb'].animations.Grill_Start.play();

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

							if (change_trans && trans < 1)
							{
								plane_material.uniforms.time.value = 0;
								trans += clock_delta;
								trans2 += Math.sin(trans * Math.PI) * 0.05;
							}

							const s = Math.cos(plane_material.uniforms.time.value * 30.0);
							const sc = (1 + ((s + 1) / 2)) * zoom;

							_camera.position.set(0, 5, 0);
							_camera.lookAt(xz_plane_intersection);
							_camera.updateMatrix();
							_camera.updateMatrixWorld();

							plane.lookAt(_camera.position);
							plane.position.y = xz_plane_intersection.y + 0.760915 + (((trans2 * 0.8) + (s * trans2 * 0.1)) * zoom);
							plane.scale.set(trans2, trans2, trans2);

							if (meat)
							{
								meat.position.y = xz_plane_intersection.y + (((trans2 * 0.8) + (s * trans2 * 0.1)) * zoom);
							}
						}

						meshes['models/Scene.glb'] && meshes['models/Scene.glb'].mixer.update(clock_delta);
						meshes['models/Meatman.glb'] && meshes['models/Meatman.glb'].mixer.update(clock_delta);
						meshes['models/Grill.glb'] && meshes['models/Grill.glb'].mixer.update(clock_delta);
						meshes['models/Sauces.glb'] && meshes['models/Sauces.glb'].mixer.update(clock_delta);
						meshes['models/Spices.glb'] && meshes['models/Spices.glb'].mixer.update(clock_delta);
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
