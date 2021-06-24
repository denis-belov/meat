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



const dpr = confirm('Use device pixel ratio?') ? (window.devicePixelRatio || 1) : 1;



// /* salt */ 0,
// /* perec */ 1,
// /* luk */ 2,
// /* paprika */ 3,
// /* petrushka */ 4,
// /* bazilik */ 5,
// /* chabrec */ 6,
// /* coriander */ 7,
// /* perec gor */ 8,
// /* chesnok */ 9,
// /* perec bel */ 10,
// /* perec slad kras */ 11,
// /* tmin */ 12,
// /* tomat */ 13,
// /* oreagano */ 14,
// /* mayoran */ 15,
// /* imbir */ 16,
// /* ukrop */ 17,
// /* pazit */ 18,



const meat_position = new THREE.Vector3(0.030909, 0.760915, 0.520341);
const meat_position2 = new THREE.Vector3();



// remove sort
const spice_sets =
{
	// kupaty
	'models/Kupaty_Extra.glb':
	{
		'models/Kupaty_Pig.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* chesnok */ 9,
			/* perec bel */ 10,
			/* perec slad kras */ 11,
		],

		'models/Kupaty_Extra.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* luk */ 2,
			/* chesnok */ 9,
			/* tmin */ 12,
		],
	},

	// barbecue
	'models/Barbecue_Classic.glb':
	{
		'models/Barbecue_Classic.glb':
		[
			/* salt */ 0,
			/* luk */ 2,
			/* paprika */ 3,
			/* perec gor */ 8,
		],

		'models/Barbecue_Traditional.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* petrushka */ 4,
			/* bazilik */ 5,
		],

		'models/Barbecue_Pig.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* luk */ 2,
			/* paprika */ 3,
			/* petrushka */ 4,
		],

		'models/Barbecue_Selected.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* chabrec */ 6,
			/* coriander */ 7,
			/* chesnok */ 9,
		],
	},

	// steak
	'models/Steak.glb':
	{
		'models/Steak.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* luk */ 2,
			/* paprika */ 3,
			/* coriander */ 7,
			/* tmin */ 12,
			/* tomat */ 13,
			/* mayoran */ 15,
		],

		'models/Steak_Neck.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* luk */ 2,
			/* paprika */ 3,
			/* chesnok */ 9,
			/* perec slad kras */ 11,
			/* tomat */ 13,
			/* oreagano */ 14,
		],
	},

	// burger
	'models/Burger.glb':
	{
		'models/Burger.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* paprika */ 3,
		],
	},

	// chevapchichi
	'models/Chevapchichi.glb':
	{
		'models/Chevapchichi.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* paprika */ 3,
			/* bazilik */ 5,
			/* coriander */ 7,
			/* perec slad kras */ 11,
			/* tomat */ 13,
			/* ukrop */ 17,
			/* pazit */ 18,
		],
	},

	// bacon
	'models/Bacon.glb':
	{
		'models/Bacon.glb':
		[
			/* salt */ 0,
			/* imbir */ 16,
		],
	},

	// sausages
	'models/Sausages_Barbecue.glb':
	{
		'models/Sausages_Home.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* luk */ 2,
			/* chesnok */ 9,
			/* perec bel */ 10,
			/* perec slad kras */ 11,
		],

		'models/Sausages_Barbecue.glb':
		[
			/* salt */ 0,
			/* perec */ 1,
			/* paprika */ 3,
			/* bazilik */ 5,
			/* coriander */ 7,
			/* tomat */ 13,
		],

		'models/Sausages_Bavarian.glb':
		[
			/* salt */ 0,
			/* luk */ 2,
			/* paprika */ 3,
			/* coriander */ 7,
			/* chesnok */ 9,
		],
	},
};

let spice_set = null;

let selected_spice_set = [];

let marinade_try = 0;

let meat_try = 0;

let current_spice_animation = null;
let current_spice_audio = null;



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
// let _renderer = null;
let _camera = null;
let _scene = null;



let trans = 0;
let trans2 = 0;
let change_trans = false;
let change_trans2 = false;



// const _audio = document.createElement('audio');



let zoom = 1;

{
	const touch_start1 = new THREE.Vector2();
	const touch_start2 = new THREE.Vector2();
	let touch_distance_start = 0;
	const touch_move1 = new THREE.Vector2();
	const touch_move2 = new THREE.Vector2();

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

				// _camera.zoom = zoom;

				// LOG(_camera.zoom)

				// _camera.updateProjectionMatrix();
			}
		},
	);

	// window.addEventListener(

	// 	'wheel',

	// 	() =>
	// 	{
	// 		zoom -= 0.01;

	// 		_scene.children.forEach(

	// 			(elm) =>
	// 			{
	// 				if (elm?.scale?.set?.call)
	// 				{
	// 					elm.scale.set(zoom, zoom, zoom);
	// 				}
	// 			},
	// 		);

	// 		// _camera.zoom = zoom;

	// 		// LOG(_camera)

	// 		// _camera.updateProjectionMatrix();
	// 		// XR8.XrController.updateCameraProjectionMatrix(

	// 		// 	{
	// 		// 		cam:
	// 		// 		{
	// 		// 			pixelRectWidth: window.innerWidth,
	// 		// 			pixelRectHeight: window.innerHeight,
	// 		// 			nearClipPlane: 0.1,
	// 		// 			farClipPlane: 100,
	// 		// 		},

	// 		// 		origin: _camera.position,
	// 		// 		facing: _camera.quaternion,
	// 		// 	},
	// 		// );
	// 	},
	// );
}

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

									animation.name !== 'Idle_Marinade' &&
									animation.name !== 'Idle_Spices' &&
									animation.name !== 'Idle_Food' &&
									animation.name !== 'Final_Idle' &&
									animation.name !== 'Scene_Idle_Food' &&
									animation.name !== 'SceneFood_Marinade&Spices' &&
									animation.name !== 'SceneBarbecue_Marinade&Spices'
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
											_elm.transparent2 = _elm.transparent;
										},
									);
								}
								else
								{
									elm.material.envMap = cube_map;
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
const scene_objects = {};
const audio = {};

let plane_material = null;
let plane = null;
let tray = null;
let tray_barbecue = null;
let meat = null;



{
	let muted = false;

	document.getElementById('sound').addEventListener(

		'click',

		() =>
		{
			// evt.stopImmediatePropagation();

			muted = !muted;

			if (muted)
			{
				document.getElementById('sound').classList.remove('sound-off');
				document.getElementById('sound').classList.add('sound-on');
			}
			else
			{
				document.getElementById('sound').classList.remove('sound-on');
				document.getElementById('sound').classList.add('sound-off');
			}

			for (const key in audio)
			{
				audio[key].muted = muted;
			}
		},
	);
}



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

						// alert(window.devicePixelRatio)
						// alert(renderer.setPixelRatio(window.devicePixelRatio))

						// _renderer = renderer;
						_camera = camera;
						_scene = scene;

						renderer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);

						renderer.outputEncoding = THREE.sRGBEncoding;
						renderer.sortObjects = false;

						canvas.width = window.innerWidth * dpr;
						canvas.height = window.innerHeight * dpr;
						// canvas.style.width = `${ window.innerWidth }px!important`;
						// canvas.style.height = `${ window.innerHeight }px!important`;

						LOG(window.innerWidth)

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
							'models/Kupaty_Extra.glb',
							'models/Bacon.glb',
							'models/Sausages_Barbecue.glb',
							'models/Burger.glb',
							'models/Barbecue_Classic.glb',
							'models/Steak.glb',
							'models/Chevapchichi.glb',
							'models/Mayonnaise.glb',
							'models/SoySauce.glb',
							'models/Vinegar.glb',
						];

						const paths_audio =
						[
							'audio/mp3/Nachalo.mp3',

							'audio/mp3/Svinina1.mp3',
							'audio/mp3/Svinina2.mp3',
							'audio/mp3/lenta.mp3',

							'audio/mp3/Bacon.mp3',
							'audio/mp3/SashlikKass.mp3',
							'audio/mp3/ShashlikTradic.mp3',
							'audio/mp3/SashlikOtborniy.mp3',
							'audio/mp3/ShaslikPig.mp3',
							'audio/mp3/Chevapchichi.mp3',
							'audio/mp3/Burger.mp3',
							'audio/mp3/Kupati.mp3',
							'audio/mp3/KupatiPig.mp3',
							'audio/mp3/Steak.mp3',
							'audio/mp3/Kotleti.mp3',
							'audio/mp3/KolbaskiDom.mp3',
							'audio/mp3/BBQ.mp3',
							'audio/mp3/Bavarskie.mp3',

							'audio/mp3/Marinade_Vinegar.mp3',
							'audio/mp3/mazik.mp3',
							'audio/mp3/soy.mp3',
							'audio/mp3/Marinade_Correct.mp3',
							'audio/mp3/Marinade_Correct (Short).mp3',

							'audio/mp3/salt.mp3',
							'audio/mp3/Perec.mp3',
							'audio/mp3/Luk.mp3',
							'audio/mp3/Paprika.mp3',
							'audio/mp3/Zelen.mp3',
							'audio/mp3/bazilik.mp3',
							'audio/mp3/originalno.mp3',
							'audio/mp3/Chesnok.mp3',
							'audio/mp3/PerecSweet.mp3',
							'audio/mp3/Tmin.mp3',
							'audio/mp3/Tomat.mp3',
							'audio/mp3/PerecBlackGoroshek.mp3',
						];

						[
							...paths,
							...paths_audio,
						]
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

						cube_map =
							await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

						for (let i = 0; i < paths.length; ++i)
						{
							scene_objects[paths[i]] = await parseGlb(external_data_loader.content[paths[i]]);
						}

						for (let i = 0; i < paths_audio.length; ++i)
						{
							let set = null;

							switch (paths_audio[i])
							{
							case 'audio/mp3/Nachalo.mp3':

							case 'audio/mp3/Svinina1.mp3':
							case 'audio/mp3/Svinina2.mp3':
							case 'audio/mp3/lenta.mp3':

							case 'audio/mp3/Marinade_Vinegar.mp3':
							case 'audio/mp3/mazik.mp3':
							case 'audio/mp3/soy.mp3':
							case 'audio/mp3/Marinade_Correct.mp3':
							case 'audio/mp3/Marinade_Correct (Short).mp3':

							case 'audio/mp3/salt.mp3':
							case 'audio/mp3/Perec.mp3':
							case 'audio/mp3/Luk.mp3':
							case 'audio/mp3/Paprika.mp3':
							case 'audio/mp3/Zelen.mp3':
							case 'audio/mp3/bazilik.mp3':
							case 'audio/mp3/originalno.mp3':
							case 'audio/mp3/Chesnok.mp3':
							case 'audio/mp3/PerecSweet.mp3':
							case 'audio/mp3/Tmin.mp3':
							case 'audio/mp3/Tomat.mp3':
							case 'audio/mp3/PerecBlackGoroshek.mp3':
							{
								audio[paths_audio[i]] = document.createElement('audio');

								// audio[paths_audio[i]].addEventListener('ended', () => audio[paths_audio[i]].pause());

								const blob = new Blob([ external_data_loader.content[paths_audio[i]] ], { type: "audio/mpeg" });

								audio[paths_audio[i]].src = window.URL.createObjectURL(blob);

								audio[paths_audio[i]].load();

								// await new Promise(

								// 	(resolve) =>
								// 	{
								// 		audio[paths_audio[i]].addEventListener(

								// 			'canplaythrough',

								// 			resolve,
								// 		);
								// 	},
								// );

								break;
							}

							case 'audio/mp3/Bacon.mp3':
							{
								set = spice_sets['models/Bacon.glb']['models/Bacon.glb'];

								break;
							}

							case 'audio/mp3/SashlikKass.mp3':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Classic.glb'];

								break;
							}

							case 'audio/mp3/ShashlikTradic.mp3':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Traditional.glb'];

								break;
							}

							case 'audio/mp3/SashlikOtborniy.mp3':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Selected.glb'];

								break;
							}

							case 'audio/mp3/ShashlikPig.mp3':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Pig.glb'];

								break;
							}

							case 'audio/mp3/Chevapchichi.mp3':
							{
								set = spice_sets['models/Chevapchichi.glb']['models/Chevapchichi.glb'];

								break;
							}

							case 'audio/mp3/Burger.mp3':
							{
								set = spice_sets['models/Burger.glb']['models/Burger.glb'];

								break;
							}

							case 'audio/mp3/Kupati.mp3':
							{
								set = spice_sets['models/Kupaty_Extra.glb']['models/Kupaty_Extra.glb'];

								break;
							}

							case 'audio/mp3/KupatiPig.mp3':
							{
								set = spice_sets['models/Kupaty_Extra.glb']['models/Kupaty_Pig.glb'];

								break;
							}

							case 'audio/mp3/Steak.mp3':
							{
								set = spice_sets['models/Steak.glb']['models/Steak.glb'];

								break;
							}

							case 'audio/mp3/Kotleti.mp3':
							{
								set = spice_sets['models/Steak.glb']['models/Steak_Neck.glb'];

								break;
							}

							case 'audio/mp3/kolbaskiDom.mp3':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Home.glb'];

								break;
							}

							case 'audio/mp3/BBQ.mp3':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Barbecue.glb'];

								break;
							}

							case 'audio/mp3/Bavarskie.mp3':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Bavarian.glb'];

								break;
							}

							default:
							}

							if (set)
							{
								set.audio = document.createElement('audio');

								// set.audio.addEventListener('ended', () => set.audio.pause());

								const blob = new Blob([ external_data_loader.content[paths_audio[i]] ], { type: "audio/mpeg" });

								// set.audio = window.URL.createObjectURL(blob);

								set.audio.src = window.URL.createObjectURL(blob);

								audio[paths_audio[i]] = set.audio;

								set.audio.load();

								// await new Promise(

								// 	(resolve) =>
								// 	{
								// 		set.audio.addEventListener(

								// 			'canplaythrough',

								// 			resolve,
								// 		);
								// 	},
								// );
							}
						}

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
												spice_set = spice_sets[elm];

												spice_set.name = null;

												spice_set.match = null;

												spice_set.unique = [];

												let count = 0;

												let key = null;
												let _key = null;

												for (key in spice_set)
												{
													if (key !== 'match' && key !== 'unique' && key !== 'name')
													{
														spice_set.unique.push(...spice_set[key]);
														_key = key;
													}

													++count;
												}

												if (count === 4)
												{
													spice_set.match = spice_set[_key];
													spice_set.match.audio = spice_set[_key].audio;
												}

												spice_set.unique = Array.from(new Set(spice_set.unique)).sort((a, b) => (a - b));

												spice_set.unique.forEach(

													(_elm) =>
													{
														spices_buttons[_elm].style.display = 'block';
													},
												);

												meat = scene_objects[elm];

												meat._corresponding_scene_object.visible = true;

												tray.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												scene_objects['models/Meatman.glb'].animations['Idle_Food'].stop();
												scene_objects['models/Meatman.glb'].animations['Get_Barbecue'].play();

												scene_objects['models/Scene.glb'].animations['Scene_Idle_Food'].stop();

												if (meat_try === 0)
												{
													audio['audio/mp3/lenta.mp3'].play();
												}
												else
												{
													audio['audio/mp3/Svinina2.mp3'].play();
												}

												scene_objects['models/Scene.glb'].animations['Scene_GetBarbecue'].play();
											},
										);
									}
									else
									{
										meat_buttons[elm_index].addEventListener(

											'click',

											() =>
											{
												spice_set = spice_sets[elm];

												spice_set.name = null;

												spice_set.match = null;

												spice_set.unique = [];

												let count = 0;

												let key = null;
												let _key = null;

												for (key in spice_set)
												{
													if (key !== 'match' && key !== 'unique' && key !== 'name')
													{
														spice_set.unique.push(...spice_set[key]);
														_key = key;
													}

													++count;
												}

												if (count === 4)
												{
													spice_set.match = spice_set[_key];
													spice_set.match.audio = spice_set[_key].audio;
												}

												spice_set.unique = Array.from(new Set(spice_set.unique)).sort((a, b) => (a - b));

												spice_set.unique.forEach(

													(_elm) =>
													{
														spices_buttons[_elm].style.display = 'block';
													},
												);

												meat = scene_objects[elm];

												meat._corresponding_scene_object.visible = true;

												tray_barbecue.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												scene_objects['models/Meatman.glb'].animations['Idle_Food'].stop();
												scene_objects['models/Meatman.glb'].animations['Get_Food'].play();

												scene_objects['models/Scene.glb'].animations['Scene_Idle_Food'].stop();

												audio['audio/mp3/Svinina1.mp3'].play();
												scene_objects['models/Scene.glb'].animations['Scene_GetFood'].play();
											},
										);
									}
								},
							);

						scene_objects['models/Scene.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								action?._clip?.name &&

									scene_objects['models/Scene.glb'].animations[action._clip.name].stop();

								switch (action._clip.name)
								{
								case 'Scene_Start':

									scene_objects['models/Scene.glb'].animations['Scene_Idle_Food'].play();

									break;

								case 'Scene_GetFood':

									scene_objects['models/Scene.glb'].animations['SceneFood_Marinade&Spices'].play();

									break;

								case 'Scene_GetBarbecue':

									scene_objects['models/Scene.glb'].animations['SceneBarbecue_Marinade&Spices'].play();

									break;

								default:
								}
							},
						);

						scene_objects['models/Grill.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									scene_objects['models/Grill.glb'].visible = false;

									scene_objects['models/Grill.glb'].animations[action._clip.name].stop();
								}
							},
						);

						scene_objects['models/Mayonnaise.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									scene_objects['models/Mayonnaise.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_Mayonnaise')
									{
										scene_objects['models/Mayonnaise.glb'].visible = false;
									}
								}
							},
						);

						scene_objects['models/SoySauce.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									scene_objects['models/SoySauce.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_SoySauce')
									{
										scene_objects['models/SoySauce.glb'].visible = false;
									}
								}
							},
						);

						scene_objects['models/Vinegar.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									scene_objects['models/Vinegar.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_Vinegar')
									{
										scene_objects['models/Vinegar.glb'].visible = false;
									}
								}
							},
						);

						scene_objects['models/Meatman.glb'].mixer.addEventListener(

							'finished',

							async ({ action }) =>
							{
								if (action?._clip?.name)
								{
									scene_objects['models/Meatman.glb'].animations[action._clip.name].stop();

									switch (action._clip.name)
									{
									case 'Start':

										scene_objects['models/Meatman.glb'].animations['Idle_Food'].play();

										document.getElementsByClassName('camera-section')[2].style.display = 'block';

										break;

									case 'Get_Food':
									case 'Get_Barbecue':

										document.getElementsByClassName('camera-section')[3].style.display = 'block';

										scene_objects['models/Mayonnaise.glb'].visible = true;
										scene_objects['models/SoySauce.glb'].visible = true;
										scene_objects['models/Vinegar.glb'].visible = true;

										scene_objects['models/Meatman.glb'].animations['Idle_Marinade'].play();

										scene_objects['models/Mayonnaise.glb'].animations['Sauces_Start'].play();
										scene_objects['models/SoySauce.glb'].animations['Sauces_Start'].play();
										scene_objects['models/Vinegar.glb'].animations['Sauces_Start'].play();

										break;


									case 'Marinade_Vinegar':
									case 'Marinade_Mayonnaise':
									case 'Marinade_SoySauce':

										document.getElementsByClassName('camera-section')[3].classList.remove('disabled');

										scene_objects['models/Meatman.glb'].animations['Idle_Marinade'].play();

										break;

									case 'Get_Spices_Salt':
									case 'Get_Spices_Perec':
									case 'Get_Spices_Luk':
									case 'Get_Spices_Paprika':
									case 'Get_Spices_Petrushka':
									case 'Get_Spices_Bazilik':
									case 'Get_Spices_Chabrec':
									case 'Get_Spices_Coriander':
									case 'Get_Spices_Perec Black peppercorns':
									case 'Get_Spices_Chesnok':
									case 'Get_Spices_Perec White':
									case 'Get_Spices_Perec Red':
									case 'Get_Spices_Tmin':
									case 'Get_Spices_Tomat':
									case 'Get_Spices_Oregano':
									case 'Get_Spices_Maioran':
									case 'Get_Spices_Imbir':
									case 'Get_Spices_Ukrop':
									case 'Get_Spices_Pazhitnik':

										// document.getElementsByClassName('camera-section')[4].classList.remove('disabled');

										if (spice_set.match && selected_spice_set.length === spice_set.match.length)
										{
											scene_objects['models/Meatman.glb'].animations['Idle_Spices'].play();
											// setTimeout(

											// 	() =>
											// 	{
											// 		change_trans = true;
											// 		change_trans2 = true;

											// 		tray.visible = false;
											// 		tray_barbecue.visible = false;

											// 		meat._corresponding_scene_object.visible = false;

											// 		plane.visible = true;

											// 		meat.visible = true;

											// 		spice_set.match.audio.play();
											// 		scene_objects['models/Meatman.glb'].animations['Final'].play();
											// 	},

											// 	1000,
											// );


											// audio[paths_audio[i]] = document.createElement('audio');

											// audio[paths_audio[i]].addEventListener('ended', () => audio[paths_audio[i]].pause());

											// const blob = new Blob([ external_data_loader.content[paths_audio[i]] ], { type: "audio/mp3" });

											// _audio.src = spice_set.match.audio;

											spice_set.match.audio.load();

											await new Promise(

												(resolve) =>
												{
													spice_set.match.audio.addEventListener(

														'canplaythrough',

														resolve,
													);
												},
											);



											change_trans = true;
											change_trans2 = true;

											tray.visible = false;
											tray_barbecue.visible = false;

											meat._corresponding_scene_object.visible = false;

											plane.visible = true;

											meat.visible = true;



											scene_objects['models/Meatman.glb'].animations['Idle_Spices'].stop();
											current_spice_audio.pause();
											// spice_set.match.audio.pause()
											spice_set.match.audio.play();
											// _audio.play();
											scene_objects['models/Meatman.glb'].animations['Final'].play();
										}
										else
										{
											scene_objects['models/Meatman.glb'].animations['Idle_Spices'].play();
										}

										break;

									case 'Marinade_Correct':
									case 'Marinade_Correct(Short)':

										document.getElementsByClassName('camera-section')[4].style.display = 'block';

										scene_objects['models/Mayonnaise.glb'].visible = false;
										scene_objects['models/SoySauce.glb'].visible = false;
										scene_objects['models/Vinegar.glb'].visible = false;

										scene_objects['models/Meatman.glb'].animations['Idle_Spices'].play();

										break;

									case 'Final':

										scene_objects['models/Meatman.glb'].animations['Final_Idle'].play();

										document.getElementsByClassName('camera-section')[4].style.display = 'none';
										document.getElementsByClassName('camera-section')[5].style.display = 'block';

										break;

									default:
									}
								}
							},
						);

						[
							{ meatman: 'Marinade_Vinegar', sauce_a: scene_objects['models/Vinegar.glb'].animations['Sauces_Vinegar'], sauce_au: audio['audio/mp3/Marinade_Vinegar.mp3'] },
							{ meatman: 'Marinade_Mayonnaise', sauce_a: scene_objects['models/Mayonnaise.glb'].animations['Sauces_Mayonnaise'], sauce_au: audio['audio/mp3/mazik.mp3'] },
							{ meatman: 'Marinade_SoySauce', sauce_a: scene_objects['models/SoySauce.glb'].animations['Sauces_SoySauce'], sauce_au: audio['audio/mp3/soy.mp3'] },
						]
							.forEach(

								(elm, elm_index) =>
								{
									sauce_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											++marinade_try;

											document.getElementsByClassName('camera-section')[3].classList.add('disabled');

											// sauce_buttons[elm_index].style.display = 'none';
											sauce_buttons[0].style.display = 'none';
											sauce_buttons[1].style.display = 'none';
											sauce_buttons[2].style.display = 'none';

											scene_objects['models/Mayonnaise.glb'].animations['Sauces_Mayonnaise'].play();
											scene_objects['models/SoySauce.glb'].animations['Sauces_SoySauce'].play();
											scene_objects['models/Vinegar.glb'].animations['Sauces_Vinegar'].play();

											scene_objects['models/Meatman.glb'].animations['Idle_Marinade'].stop();
											scene_objects['models/Meatman.glb'].animations[elm.meatman].play();

											elm.sauce_au.play();
											// elm.sauce_a.play();
										},
									);
								},
							);

						sauce_buttons[3].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[3].style.display = 'none';

								// if (scene_objects['models/Mayonnaise.glb'].visible)
								// {
									scene_objects['models/Mayonnaise.glb'].animations['Sauces_Mayonnaise'].play();
								// }

								// if (scene_objects['models/SoySauce.glb'].visible)
								// {
									scene_objects['models/SoySauce.glb'].animations['Sauces_SoySauce'].play();
								// }

								// if (scene_objects['models/Vinegar.glb'].visible)
								// {
									scene_objects['models/Vinegar.glb'].animations['Sauces_Vinegar'].play();
								// }

								scene_objects['models/Meatman.glb'].animations['Idle_Marinade'].stop();

								if (marinade_try === 0)
								{
									audio['audio/mp3/Marinade_Correct.mp3'].play();
									scene_objects['models/Meatman.glb'].animations['Marinade_Correct'].play();
								}
								else
								{
									audio['audio/mp3/Marinade_Correct (Short).mp3'].play();
									scene_objects['models/Meatman.glb'].animations['Marinade_Correct(Short)'].play();
								}
							},
						);

						const spice_audio =
						[
							audio['audio/mp3/salt.mp3'],
							audio['audio/mp3/Perec.mp3'],
							audio['audio/mp3/Luk.mp3'],
							audio['audio/mp3/Paprika.mp3'],
							audio['audio/mp3/Zelen.mp3'],
							audio['audio/mp3/bazilik.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/PerecBlackGoroshek.mp3'],
							audio['audio/mp3/Chesnok.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/PerecSweet.mp3'],
							audio['audio/mp3/Tmin.mp3'],
							audio['audio/mp3/Tomat.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/originalno.mp3'],
							audio['audio/mp3/Zelen.mp3'],
							audio['audio/mp3/originalno.mp3'],
						];

						// /* salt */ 0,
						// /* perec */ 1,
						// /* luk */ 2,
						// /* paprika */ 3,
						// /* petrushka */ 4,
						// /* bazilik */ 5,
						// /* chabrec */ 6,
						// /* coriander */ 7,
						// /* perec gor */ 8,
						// /* chesnok */ 9,
						// /* perec bel */ 10,
						// /* perec slad kras */ 11,
						// /* tmin */ 12,
						// /* tomat */ 13,
						// /* oreagano */ 14,
						// /* mayoran */ 15,
						// /* imbir */ 16,
						// /* ukrop */ 17,
						// /* pazit */ 18,

						[
							'Get_Spices_Salt',
							'Get_Spices_Perec',
							'Get_Spices_Luk',
							'Get_Spices_Paprika',
							'Get_Spices_Petrushka',
							'Get_Spices_Bazilik',
							'Get_Spices_Chabrec',
							'Get_Spices_Coriander',
							'Get_Spices_Perec Black peppercorns',
							'Get_Spices_Chesnok',
							'Get_Spices_Perec White',
							'Get_Spices_Perec Red',
							'Get_Spices_Tmin',
							'Get_Spices_Tomat',
							'Get_Spices_Oregano',
							'Get_Spices_Maioran',
							'Get_Spices_Imbir',
							'Get_Spices_Ukrop',
							'Get_Spices_Pazhitnik',
						]
							.forEach(

								(elm, elm_index) =>
								{
									spices_buttons[elm_index].style.display = 'none';

									// if (current_spice_animation)
									// {
									// 	current_spice_animation.stop();
									// }

									spices_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											// document.getElementsByClassName('camera-section')[4].style.pointerEvents = 'none';
											// document.getElementsByClassName('camera-section')[4].classList.add('disabled');

											selected_spice_set.push(elm_index);
											selected_spice_set = selected_spice_set.sort((a, b) => (a - b));

											if (!spice_set.match)
											{
												let count = 0;
												let match = null;
												let name = null;

												for (const key in spice_set)
												{
													if (key !== 'match' && key !== 'unique' && key !== 'name' && spice_set[key].includes(elm_index))
													{
														++count;

														match = spice_set[key];
														match.audio = spice_set[key].audio;
														name = key;
													}
												}

												if (count < (Object.keys(spice_set).length - 3))
												{
													spice_set.match = match;
													spice_set.match.audio = match.audio;
													spice_set.name = name;

													spices_buttons.forEach(

														(_elm, _elm_index) =>
														{
															if (!spice_set.match.includes(_elm_index))
															{
																_elm.style.display = 'none';
															}
														},
													);
												}
											}

											spices_buttons[elm_index].style.display = 'none';

											// LOG(current_spice_animation)

											if (current_spice_animation)
											{
												current_spice_animation.stop();
												current_spice_audio.pause();
											}

											scene_objects['models/Meatman.glb'].animations['Idle_Spices'].stop();

											current_spice_animation = scene_objects['models/Meatman.glb'].animations[elm];
											current_spice_audio = spice_audio[elm_index];

											current_spice_animation.play();
											current_spice_audio.play();
										},
									);
								},
							);



						document.getElementsByClassName('cook-more')[0].addEventListener(

							'click',

							() =>
							{
								++meat_try;

								document.getElementsByClassName('camera-section')[5].style.display = 'none';

								sauce_buttons.forEach(

									(elm) =>
									{
										elm.style.display = 'block';
									},
								);

								meat.visible = false;
								plane.visible = false;
								// scene_objects['models/Mayonnaise.glb'].visible = false;
								// scene_objects['models/SoySauce.glb'].visible = false;
								// scene_objects['models/Vinegar.glb'].visible = false;

								scene_objects['models/Grill.glb'].visible = true;

								tray.visible = true;
								tray_barbecue.visible = true;

								plane.position.copy(xz_plane_intersection);
								plane.position.add(new THREE.Vector3(0.030909, 0.760915, 0.520341));

								meat = null;
								spice_set = null;
								selected_spice_set.length = 0;

								plane_material.uniforms.time.value = 0;
								trans = 0;
								trans2 = 0;
								change_trans = false;
								change_trans2 = false;

								scene_objects['models/Scene.glb'].animations['SceneFood_Marinade&Spices'].stop();
								scene_objects['models/Scene.glb'].animations['SceneBarbecue_Marinade&Spices'].stop();
								scene_objects['models/Scene.glb'].animations['Scene_Start'].play();
								scene_objects['models/Meatman.glb'].animations['Final_Idle'].stop();
								scene_objects['models/Meatman.glb'].animations['Start'].play();
								scene_objects['models/Grill.glb'].animations['Grill_Start'].play();

								audio['audio/mp3/Nachalo.mp3'].play();
							},
						);



						grid_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));

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

										// gl_Position.z = -1.0;
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

										gl_FragColor.rgb *= 0.25;

										gl_FragColor.rgb += smoothstep(0.0, 1.0, 1.0 - length(vUv1)) * 3.0 * (1.0 + sin(time * 50.0) * 0.1);

										gl_FragColor.rgb *= vec3(95.0 / 255.0, 86.0 / 255.0, 175.0 / 255.0);

										gl_FragColor.a = smoothstep(0.5, 1.0, pow(length(gl_FragColor.rgb), 2.0)) * smoothstep(0.0, 1.0, 0.8 - length(vUv1));
									}`,

								uniforms:
								{
									noise: { value: plane_noise_texture },

									time: { value: 0 },
								},

								transparent: true,

								depthTest: false,
							},
						);

						plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), plane_material);



						// raycaster.setFromCamera(screen_center, camera);

						// raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

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

										plane.scale.set(zoom, zoom, zoom);
										// plane.position.copy(xz_plane_intersection);
										// plane.position.add(meat_position.clone().applyMatrix4(new THREE.Matrix4().extractRotation(_camera.matrix)));
										// LOG(meat_position, meat_position.clone().applyMatrix4(new THREE.Matrix4().extractRotation(_camera.matrix)))
										// plane.position.applyMatrix4(new THREE.Matrix4().extractRotation(_camera.matrix));
										plane.visible = false;

										Object.keys(scene_objects).forEach(

											(elm) =>
											{
												scene_objects[elm].scale.set(zoom, zoom, zoom);
												scene_objects[elm].position.copy(xz_plane_intersection);
												scene_objects[elm].lookAt(_camera.position.clone().projectOnPlane(new THREE.Vector3(0, 1, 0)));
											},
										);

										scene_objects['models/Meatman.glb'].children[0].children.forEach(

											(elm) =>
											{
												switch (elm.name)
												{
												case 'Tray_1':
												{
													tray = elm;

													break;
												}

												case 'Tray_Barbecue':
												{
													tray_barbecue = elm;

													break;
												}

												default:
												}
											},
										);

										scene_objects['models/Scene.glb'].children[0].children.forEach(

											(elm) =>
											{
												switch (elm.name)
												{
												case 'Barbecue':
												{
													elm.visible = false;

													scene_objects['models/Barbecue_Classic.glb']._corresponding_scene_object = elm;

													break;
												}

												case 'Kupaty':
												{
													elm.visible = false;

													scene_objects['models/Kupaty_Extra.glb']._corresponding_scene_object = elm;

													break;
												}

												case 'Sausages':
												{
													elm.visible = false;

													scene_objects['models/Sausages_Barbecue.glb']._corresponding_scene_object = elm;

													break;
												}

												case 'Bacon004':
												{
													elm.visible = false;

													scene_objects['models/Bacon.glb']._corresponding_scene_object = elm;

													break;
												}

												case 'Steak':
												{
													elm.visible = false;

													scene_objects['models/Steak.glb']._corresponding_scene_object = elm;

													break;
												}

												case 'Burger003':
												{
													elm.visible = false;

													scene_objects['models/Burger.glb']._corresponding_scene_object = elm;

													break;
												}
												case 'Chevapchichi004':
												{
													elm.visible = false;

													scene_objects['models/Chevapchichi.glb']._corresponding_scene_object = elm;

													break;
												}

												default:
												}
											},
										);

										scene_objects['models/Mayonnaise.glb'].visible = false;
										scene_objects['models/SoySauce.glb'].visible = false;
										scene_objects['models/Vinegar.glb'].visible = false;

										scene_objects['models/Kupaty_Extra.glb'].visible = false;
										scene_objects['models/Bacon.glb'].visible = false;
										scene_objects['models/Sausages_Barbecue.glb'].visible = false;
										scene_objects['models/Burger.glb'].visible = false;
										scene_objects['models/Barbecue_Classic.glb'].visible = false;
										scene_objects['models/Steak.glb'].visible = false;
										scene_objects['models/Chevapchichi.glb'].visible = false;

										scene.add(scene_objects['models/Scene.glb']);
										scene.add(scene_objects['models/Meatman.glb']);
										scene.add(scene_objects['models/Grill.glb']);
										scene.add(scene_objects['models/Mayonnaise.glb']);
										scene.add(scene_objects['models/SoySauce.glb']);
										scene.add(scene_objects['models/Vinegar.glb']);
										scene.add(plane);
										scene.add(scene_objects['models/Kupaty_Extra.glb']);
										scene.add(scene_objects['models/Bacon.glb']);
										scene.add(scene_objects['models/Sausages_Barbecue.glb']);
										scene.add(scene_objects['models/Burger.glb']);
										scene.add(scene_objects['models/Barbecue_Classic.glb']);
										scene.add(scene_objects['models/Steak.glb']);
										scene.add(scene_objects['models/Chevapchichi.glb']);

										document.getElementsByClassName('camera-section')[1].style.display = 'none';

										setTimeout(

											() =>
											{
												scene_objects['models/Scene.glb'].animations['Scene_Start'].play();
												scene_objects['models/Meatman.glb'].animations['Start'].play();
												scene_objects['models/Grill.glb'].animations['Grill_Start'].play();

												audio['audio/mp3/Nachalo.mp3'].play();

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
						// _camera.position.set(0, 1, 8);
						// _camera.lookAt(xz_plane_intersection);
						// _camera.updateMatrix();
						// _camera.updateMatrixWorld();

						if (grid_mesh)
						{
							raycaster.setFromCamera(screen_center, _camera);

							raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

							grid_mesh.position.copy(xz_plane_intersection);

							// grid_mesh.lookAt(_camera.position);

							return;
						}

						const clock_delta = clock.getDelta();

						if (meat)
						{
							if (change_trans)
							{
								if (trans < 1)
								{
									trans += clock_delta;

									trans2 = Math.cos(Math.PI * 0.5 * (1 - trans));
								}
								else
								{
									change_trans = false;

									trans2 = 1;
								}
							}
							if (change_trans2)
							{
								plane_material.uniforms.time.value += clock_delta * 0.1;
							}


							const s = Math.sin(plane_material.uniforms.time.value * 30.0);
							const sc = (s + 1) * 0.5 * 0.25;

							meat.position
								.copy(xz_plane_intersection)
								.setY(meat.position.y + ((trans2 * 0.8) + (s * 0.2)) * zoom - meat_position.y * sc);

							// LOG(((trans2 * 0.8) + (s * 0.1)) * zoom, meat_position.y, meat_position.y * ((trans2 * 0.8) + (s * 0.1)) * zoom)

							meat.scale.set(zoom + sc * zoom, zoom + sc * zoom, zoom + sc * zoom);

							plane.lookAt(_camera.position);

							plane.position
								.copy(xz_plane_intersection)
								.add(meat_position2.copy(meat_position).multiplyScalar(zoom).applyQuaternion(meat.quaternion))
								.setY(plane.position.y + ((trans2 * 0.8) + (s * 0.2)) * zoom);

							plane.scale.set(trans2 * (zoom + sc * zoom), trans2 * (zoom + sc * zoom), trans2 * (zoom + sc * zoom));
						}

						scene_objects['models/Scene.glb']?.visible && scene_objects['models/Scene.glb'].mixer.update(clock_delta);
						scene_objects['models/Meatman.glb']?.visible && scene_objects['models/Meatman.glb'].mixer.update(clock_delta);
						scene_objects['models/Grill.glb']?.visible && scene_objects['models/Grill.glb'].mixer.update(clock_delta);
						scene_objects['models/Mayonnaise.glb']?.visible && scene_objects['models/Mayonnaise.glb'].mixer.update(clock_delta);
						scene_objects['models/SoySauce.glb']?.visible && scene_objects['models/SoySauce.glb'].mixer.update(clock_delta);
						scene_objects['models/Vinegar.glb']?.visible && scene_objects['models/Vinegar.glb'].mixer.update(clock_delta);
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
