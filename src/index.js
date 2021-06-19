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



// let time_start = 0;



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

			/* chesnok */ 9,

			/* perec */ 1,

			/* perec bel */ 10,

			/* perec slad kras */ 11,
		].sort((a, b) => (a - b)),

		'models/Kupaty_Extra.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* perec */ 1,

			/* chesnok */ 9,

			/* tmin */ 12,
		].sort((a, b) => (a - b)),
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
		].sort((a, b) => (a - b)),

		'models/Barbecue_Traditional.glb':
		[
			/* salt */ 0,

			/* bazilik */ 5,

			/* perec */ 1,

			/* petrushka */ 4,
		].sort((a, b) => (a - b)),

		'models/Barbecue_Pig.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* paprika */ 3,

			/* perec */ 1,

			/* petrushka */ 4,
		],

		'models/Barbecue_Selected.glb':
		[
			/* salt */ 0,

			/* chesnok */ 9,

			/* coriander */ 7,

			/* chabrec */ 6,

			/* perec */ 1,
		].sort((a, b) => (a - b)),
	},

	// steak
	'models/Steak.glb':
	{
		'models/Steak.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* paprika */ 3,

			/* tomat */ 13,

			/* tmin */ 12,

			/* coriander */ 7,

			/* perec */ 1,

			/* mayoran */ 15,
		].sort((a, b) => (a - b)),

		'models/Steak_Neck.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* paprika */ 3,

			/* tomat */ 13,

			/* chesnok */ 9,

			/* perec */ 1,

			/* perec slad kras */ 11,

			/* oreagano */ 14,
		].sort((a, b) => (a - b)),
	},

	// burger
	'models/Burger.glb':
	{
		'models/Burger.glb':
		[
			/* salt */ 0,

			/* paprika */ 3,

			/* perec */ 1,
		].sort((a, b) => (a - b)),
	},

	// chevapchichi
	'models/Chevapchichi.glb':
	{
		'models/Chevapchichi.glb':
		[
			/* salt */ 0,

			/* paprika */ 3,

			/* perec */ 1,

			/* perec slad kras */ 11,

			/* coriander */ 7,

			/* bazilik */ 5,

			/* ukrop */ 17,

			/* pazit */ 18,

			/* tomat */ 13,
		].sort((a, b) => (a - b)),
	},

	// bacon
	'models/Bacon.glb':
	{
		'models/Bacon.glb':
		[
			/* salt */ 0,

			/* imbir */ 16,
		].sort((a, b) => (a - b)),
	},

	// sausages
	'models/Sausages_Barbecue.glb':
	{
		'models/Sausages_Home.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* chesnok */ 9,

			/* perec */ 1,

			/* perec bel */ 10,

			/* perec slad kras */ 11,
		].sort((a, b) => (a - b)),

		'models/Sausages_Barbecue.glb':
		[
			/* salt */ 0,

			/* perec */ 1,

			/* paprika */ 3,

			/* coriander */ 7,

			/* bazilik */ 5,

			/* tomat */ 13,
		].sort((a, b) => (a - b)),

		'models/Sausages_Bavarian.glb':
		[
			/* salt */ 0,

			/* luk */ 2,

			/* paprika */ 3,

			/* coriander */ 7,

			/* chesnok */ 9,
		].sort((a, b) => (a - b)),
	},
};

let spice_set = null;

let selected_spice_set = [];

let marinade_try = 0;

let meat_try = 0;



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
			}
		},
	);

	window.addEventListener(

		'wheel',

		() =>
		{
			zoom -= 0.01;

			_scene.children.forEach(

				(elm) =>
				{
					if (elm?.scale?.set?.call)
					{
						elm.scale.set(zoom, zoom, zoom);
					}
				},
			);
		},
	);
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

									// animation.name !== 'Idle_Marinade&Spices' &&
									animation.name !== 'Idle_Marinade' &&
									animation.name !== 'Idle_Spices' &&
									animation.name !== 'Idle_Food' &&
									animation.name !== 'Final_Idle' &&
									animation.name !== 'Scene_Idle_Food' &&
									// animation.name !== 'Scene_Marinade&Spices'
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
const meshes = {};
const audio = {};

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

						// camera.matrixAutoUpdate = false;

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
							// 'models/Sauces.glb',
							// 'models/Spices.glb',
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
							'audio/Svinina1.wav',
							'audio/Svinina2.wav',
							'audio/lenta.wav',

							'audio/Bacon.wav',
							'audio/SashlikKass.wav',
							'audio/ShashlikTradic.wav',
							'audio/SashlikOtborniy.wav',
							'audio/ShaslikPig.wav',
							'audio/Chevapchichi.wav',
							'audio/Burger.wav',
							'audio/Kupati.wav',
							'audio/KupatiPig.wav',
							'audio/Steak.wav',
							'audio/Kotleti.wav',
							'audio/KolbaskiDom.wav',
							'audio/BBQ.wav',
							'audio/Bavarskie.wav',

							'audio/Nachalo.wav',

							'audio/Marinade_Vinegar.wav',
							'audio/mazik.wav',
							'audio/soy.wav',
							'audio/Marinade_Correct.wav',
							'audio/Marinade_Correct (Short).wav',

							'audio/salt.wav',
							'audio/Perec.wav',
							'audio/Luk.wav',
							'audio/Paprika.wav',
							'audio/Zelen.wav',
							'audio/bazilik.wav',
							'audio/originalno.wav',
							'audio/Chesnok.wav',
							'audio/PerecSweet.wav',
							'audio/Tmin.wav',
							'audio/Tomat.wav',
							'audio/PerecBlackGoroshek.wav',
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
							meshes[paths[i]] = await parseGlb(external_data_loader.content[paths[i]]);
						}

						for (let i = 0; i < paths_audio.length; ++i)
						{
							// meshes[paths[i]] = await parseGlb(external_data_loader.content[paths[i]]);

							let set = null;

							switch (paths_audio[i])
							{
							// case 'audio/Start.wav':
							case 'audio/Svinina1.wav':
							case 'audio/Svinina2.wav':
							case 'audio/lenta.wav':

							case 'audio/Nachalo.wav':

							case 'audio/Marinade_Vinegar.wav':
							case 'audio/mazik.wav':
							case 'audio/soy.wav':
							case 'audio/Marinade_Correct.wav':
							case 'audio/Marinade_Correct (Short).wav':

							case 'audio/salt.wav':
							case 'audio/Perec.wav':
							case 'audio/Luk.wav':
							case 'audio/Paprika.wav':
							case 'audio/Zelen.wav':
							case 'audio/bazilik.wav':
							case 'audio/originalno.wav':
							case 'audio/Chesnok.wav':
							case 'audio/PerecSweet.wav':
							case 'audio/Tmin.wav':
							case 'audio/Tomat.wav':
							case 'audio/PerecBlackGoroshek.wav':
							{
								audio[paths_audio[i]] = document.createElement('audio');

								const blob = new Blob([ external_data_loader.content[paths_audio[i]] ], { type: "audio/wav" });

								audio[paths_audio[i]].src = window.URL.createObjectURL(blob);

								break;
							}

							case 'audio/Bacon.wav':
							{
								set = spice_sets['models/Bacon.glb']['models/Bacon.glb'];

								break;
							}

							case 'audio/SashlikKass.wav':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Classic.glb'];

								break;
							}

							case 'audio/ShashlikTradic.wav':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Traditional.glb'];

								break;
							}

							case 'audio/SashlikOtborniy.wav':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Selected.glb'];

								break;
							}

							case 'audio/ShashlikPig.wav':
							{
								set = spice_sets['models/Barbecue_Classic.glb']['models/Barbecue_Pig.glb'];

								break;
							}

							case 'audio/Chevapchichi.wav':
							{
								set = spice_sets['models/Chevapchichi.glb']['models/Chevapchichi.glb'];

								break;
							}

							case 'audio/Burger.wav':
							{
								set = spice_sets['models/Burger.glb']['models/Burger.glb'];

								break;
							}

							case 'audio/Kupati.wav':
							{
								set = spice_sets['models/Kupaty_Extra.glb']['models/Kupaty_Extra.glb'];

								break;
							}

							case 'audio/KupatiPig.wav':
							{
								set = spice_sets['models/Kupaty_Extra.glb']['models/Kupaty_Pig.glb'];

								break;
							}

							case 'audio/Steak.wav':
							{
								set = spice_sets['models/Steak.glb']['models/Steak.glb'];

								break;
							}

							case 'audio/Kotleti.wav':
							{
								set = spice_sets['models/Steak.glb']['models/Steak_Neck.glb'];

								break;
							}

							case 'audio/kolbaskiDom.wav':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Home.glb'];

								break;
							}

							case 'audio/BBQ.wav':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Barbecue.glb'];

								break;
							}

							case 'audio/Bavarskie.wav':
							{
								set = spice_sets['models/Sausages_Barbecue.glb']['models/Sausages_Bavarian.glb'];

								break;
							}

							default:
							}

							if (set)
							{
								set.audio = document.createElement('audio');

								const blob = new Blob([ external_data_loader.content[paths_audio[i]] ], { type: "audio/wav" });

								set.audio.src = window.URL.createObjectURL(blob);
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

												meat = meshes[elm];

												meat.__test.visible = true;

												tray.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												meshes['models/Meatman.glb'].animations['Idle_Food'].stop();
												meshes['models/Meatman.glb'].animations['Get_Barbecue'].play();

												meshes['models/Scene.glb'].animations['Scene_Idle_Food'].stop();
												meshes['models/Scene.glb'].animations['Scene_GetBarbecue'].play();

												if (meat_try === 0)
												{
													// LOG('lenta')
													audio['audio/lenta.wav'].play();
												}
												else
												{
													// LOG('Svinina2')
													audio['audio/Svinina2.wav'].play();
												}
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

												meat = meshes[elm];

												meat.__test.visible = true;

												tray_barbecue.visible = false;

												document.getElementsByClassName('camera-section')[2].style.display = 'none';

												meshes['models/Meatman.glb'].animations['Idle_Food'].stop();
												meshes['models/Meatman.glb'].animations['Get_Food'].play();

												meshes['models/Scene.glb'].animations['Scene_Idle_Food'].stop();
												meshes['models/Scene.glb'].animations['Scene_GetFood'].play();

												audio['audio/Svinina1.wav'].play();
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
								// case 'Scene_GetBarbecue':

									// meshes['models/Scene.glb'].animations['Scene_Marinade&Spices'].play();
									meshes['models/Scene.glb'].animations['SceneFood_Marinade&Spices'].play();

									break;

								// case 'Scene_GetFood':
								case 'Scene_GetBarbecue':

									meshes['models/Scene.glb'].animations['SceneBarbecue_Marinade&Spices'].play();

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

						// meshes['models/Sauces.glb'].mixer.addEventListener(

						// 	'finished',

						// 	({ action }) =>
						// 	{
						// 		if (action?._clip?.name)
						// 		{
						// 			meshes['models/Sauces.glb'].animations[action._clip.name].stop();

						// 			// document.getElementsByClassName('camera-section')[3].style.display = 'block';
						// 		}
						// 	},
						// );

						meshes['models/Mayonnaise.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Mayonnaise.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_Mayonnaise')
									{
										meshes['models/Mayonnaise.glb'].visible = false;

										// document.getElementsByClassName('camera-section')[3].style.pointerEvents = 'initial';
										// LOG(888777)
									}

									// document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
							},
						);

						meshes['models/SoySauce.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/SoySauce.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_SoySauce')
									{
										meshes['models/SoySauce.glb'].visible = false;

										// document.getElementsByClassName('camera-section')[3].style.pointerEvents = 'initial';
										// LOG(888777)
									}

									// document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
							},
						);

						meshes['models/Vinegar.glb'].mixer.addEventListener(

							'finished',

							({ action }) =>
							{
								if (action?._clip?.name)
								{
									meshes['models/Vinegar.glb'].animations[action._clip.name].stop();

									if (action._clip.name === 'Sauces_Vinegar')
									{
										meshes['models/Vinegar.glb'].visible = false;

										// document.getElementsByClassName('camera-section')[3].style.pointerEvents = 'initial';
										// LOG(888777)
									}

									// document.getElementsByClassName('camera-section')[3].style.display = 'block';
								}
							},
						);

						// meshes['models/Spices.glb'].mixer.addEventListener(

						// 	'finished',

						// 	({ action }) =>
						// 	{
						// 		if (action?._clip?.name)
						// 		{
						// 			meshes['models/Spices.glb'].animations[action._clip.name].stop();

						// 			document.getElementsByClassName('camera-section')[4].style.display = 'block';
						// 		}
						// 	},
						// );

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

										document.getElementsByClassName('camera-section')[3].style.display = 'block';

										// meshes['models/Sauces.glb'].visible = true;
										meshes['models/Mayonnaise.glb'].visible = true;
										meshes['models/SoySauce.glb'].visible = true;
										meshes['models/Vinegar.glb'].visible = true;

										// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();
										meshes['models/Meatman.glb'].animations['Idle_Marinade'].play();

										// meshes['models/Sauces.glb'].animations['Sauces_Start'].play();
										meshes['models/Mayonnaise.glb'].animations['Sauces_Start'].play();
										meshes['models/SoySauce.glb'].animations['Sauces_Start'].play();
										meshes['models/Vinegar.glb'].animations['Sauces_Start'].play();

										break;


									case 'Marinade_Vinegar':
									case 'Marinade_Mayonnaise':
									case 'Marinade_SoySauce':

										document.getElementsByClassName('camera-section')[3].style.pointerEvents = 'initial';
										// LOG(888777)

										meshes['models/Meatman.glb'].animations['Idle_Marinade'].play();

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

										document.getElementsByClassName('camera-section')[4].style.pointerEvents = 'initial';

										if (spice_set.match && selected_spice_set.length === spice_set.match.length)
										{
											change_trans = true;
											change_trans2 = true;

											tray.visible = false;
											tray_barbecue.visible = false;

											meat.__test.visible = false;

											plane.visible = true;

											meat.visible = true;
											// meat.position.sub(new THREE.Vector3(0.030909, 0.760915, 0.520341));

											// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations['Final'].play();

											if (spice_set.match.audio)
											{
												spice_set.match.audio.play();
											}
										}
										else
										{
											// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();
											meshes['models/Meatman.glb'].animations['Idle_Spices'].play();
										}

										break;

									case 'Marinade_Correct':
									case 'Marinade_Correct(Short)':

										document.getElementsByClassName('camera-section')[4].style.display = 'block';

										meshes['models/Mayonnaise.glb'].visible = false;
										meshes['models/SoySauce.glb'].visible = false;
										meshes['models/Vinegar.glb'].visible = false;

										// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();
										meshes['models/Meatman.glb'].animations['Idle_Spices'].play();

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

						// [
						// 	'Marinade_Wrong02',
						// 	'Marinade_Wrong01',
						// 	'Marinade_Wrong03',
						// ]
						[
							{ meatman: 'Marinade_Vinegar', sauce_a: meshes['models/Vinegar.glb'].animations['Sauces_Vinegar'], sauce_au: audio['audio/Marinade_Vinegar.wav'] },
							{ meatman: 'Marinade_Mayonnaise', sauce_a: meshes['models/Mayonnaise.glb'].animations['Sauces_Mayonnaise'], sauce_au: audio['audio/mazik.wav'] },
							{ meatman: 'Marinade_SoySauce', sauce_a: meshes['models/SoySauce.glb'].animations['Sauces_SoySauce'], sauce_au: audio['audio/soy.wav'] },
						]
							.forEach(

								(elm, elm_index) =>
								{
									// sauce_buttons[elm_index].style.pointerEvents = 'none';

									sauce_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											++marinade_try;

											document.getElementsByClassName('camera-section')[3].style.pointerEvents = 'none';

											sauce_buttons[elm_index].style.display = 'none';

											// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations['Idle_Marinade'].stop();
											meshes['models/Meatman.glb'].animations[elm.meatman].play();
											elm.sauce_a.play();

											elm.sauce_au.play();
										},
									);
								},
							);

						sauce_buttons[3].addEventListener(

							'click',

							() =>
							{
								document.getElementsByClassName('camera-section')[3].style.display = 'none';

								if (meshes['models/Mayonnaise.glb'].visible)
								{
									meshes['models/Mayonnaise.glb'].animations['Sauces_Mayonnaise'].play();
								}

								if (meshes['models/SoySauce.glb'].visible)
								{
									meshes['models/SoySauce.glb'].animations['Sauces_SoySauce'].play();
								}

								if (meshes['models/Vinegar.glb'].visible)
								{
									meshes['models/Vinegar.glb'].animations['Sauces_Vinegar'].play();
								}

								// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
								meshes['models/Meatman.glb'].animations['Idle_Marinade'].stop();
								// meshes['models/Meatman.glb'].animations['Marinade_Correct'].play();

								if (marinade_try === 0)
								{
									meshes['models/Meatman.glb'].animations['Marinade_Correct'].play();
									audio['audio/Marinade_Correct.wav'].play();
								}
								else
								{
									meshes['models/Meatman.glb'].animations['Marinade_Correct(Short)'].play();
									audio['audio/Marinade_Correct (Short).wav'].play();
								}
							},
						);

						const spice_audio =
						[
							audio['audio/salt.wav'],
							audio['audio/Perec.wav'],
							audio['audio/Luk.wav'],
							audio['audio/Paprika.wav'],
							audio['audio/Zelen.wav'],
							audio['audio/bazilik.wav'],
							audio['audio/originalno.wav'],
							audio['audio/originalno.wav'],
							audio['audio/PerecBlackGoroshek.wav'],
							audio['audio/Chesnok.wav'],
							audio['audio/originalno.wav'],
							audio['audio/PerecSweet.wav'],
							audio['audio/Tmin.wav'],
							audio['audio/Tomat.wav'],
							audio['audio/originalno.wav'],
							audio['audio/originalno.wav'],
							audio['audio/originalno.wav'],
							audio['audio/Zelen.wav'],
							audio['audio/originalno.wav'],
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

									spices_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											document.getElementsByClassName('camera-section')[4].style.pointerEvents = 'none';

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
														// spice_set.match = spice_set[key];
														// spice_set.name = key;

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
															// {
															// 	_elm.style.display = 'block';
															// }
															// else
															{
																_elm.style.display = 'none';
															}
														},
													);
												}
											}

											spices_buttons[elm_index].style.display = 'none';

											// meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations['Idle_Spices'].stop();
											meshes['models/Meatman.glb'].animations[elm].play();

											spice_audio[elm_index] && spice_audio[elm_index].play();
										},
									);
								},
							);



						document.getElementsByClassName('cook-more')[0].addEventListener(

							'click',

							() =>
							{
								// count = 0;

								++meat_try;

								document.getElementsByClassName('camera-section')[5].style.display = 'none';

								sauce_buttons.forEach(

									(elm) =>
									{
										elm.style.display = 'block';
									},
								);

								// spices_buttons.forEach(

								// 	(elm) =>
								// 	{
								// 		elm.style.display = 'block';
								// 	},
								// );

								meat.visible = false;
								plane.visible = false;
								// meshes['models/Sauces.glb'].visible = false;
								meshes['models/Mayonnaise.glb'].visible = false;
								meshes['models/SoySauce.glb'].visible = false;
								meshes['models/Vinegar.glb'].visible = false;
								// meshes['models/Spices.glb'].visible = false;

								meshes['models/Grill.glb'].visible = true;

								tray.visible = true;
								tray_barbecue.visible = true;

								plane.position.copy(xz_plane_intersection);
								plane.position.add(new THREE.Vector3(0.030909, 0.760915, 0.520341));

								meat = null;
								spice_set = null;
								selected_spice_set.length = 0;

								trans = 0;
								trans2 = 0;
								change_trans = false;
								change_trans2 = false;

								// meshes['models/Scene.glb'].animations['Scene_Marinade&Spices'].stop();
								meshes['models/Scene.glb'].animations['SceneFood_Marinade&Spices'].stop();
								meshes['models/Scene.glb'].animations['SceneBarbecue_Marinade&Spices'].stop();
								meshes['models/Scene.glb'].animations['Scene_Start'].play();
								meshes['models/Meatman.glb'].animations['Final_Idle'].stop();
								meshes['models/Meatman.glb'].animations['Start'].play();
								meshes['models/Grill.glb'].animations['Grill_Start'].play();

								audio['audio/Nachalo.wav'].play();
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

									gl_FragColor.rgb *= 0.25;

									// gl_FragColor.a = 1.0;

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

										// meshes['models/Scene.glb'].visible = false;

										grid_mesh.visible = false;

										grid_mesh = null;

										// xz_plane_intersection.set(0, 0, 0);

										plane.scale.set(zoom, zoom, zoom);
										plane.position.copy(xz_plane_intersection);
										plane.position.add(meat_position);
										plane.visible = false;

										Object.keys(meshes).forEach(

											(elm) =>
											{
												meshes[elm].scale.set(zoom, zoom, zoom);
												meshes[elm].position.copy(xz_plane_intersection);
											},
										);

										tray = meshes['models/Meatman.glb'].children[0].children[25];
										tray_barbecue = meshes['models/Meatman.glb'].children[0].children[26];

										// meshes['models/Sauces.glb'].visible = false;
										meshes['models/Mayonnaise.glb'].visible = false;
										meshes['models/SoySauce.glb'].visible = false;
										meshes['models/Vinegar.glb'].visible = false;
										// meshes['models/Spices.glb'].visible = false;

										// window._Q = meshes['models/Meatman.glb'].children[0].children;

										// LOG(meshes['models/Scene.glb'].children[0].children);

										meshes['models/Scene.glb'].children[0].children.forEach(

											(elm) =>
											{
												// LOG(elm)

												switch (elm.name)
												{
												case 'Barbecue':
												{
													elm.visible = false;

													meshes['models/Barbecue_Classic.glb'].__test = elm;

													break;
												}

												case 'Kupaty':
												{
													elm.visible = false;

													meshes['models/Kupaty_Extra.glb'].__test = elm;

													break;
												}

												case 'Sausages':
												{
													elm.visible = false;

													meshes['models/Sausages_Barbecue.glb'].__test = elm;

													break;
												}

												case 'Bacon004':
												{
													elm.visible = false;

													meshes['models/Bacon.glb'].__test = elm;

													break;
												}

												case 'Steak':
												{
													elm.visible = false;

													meshes['models/Steak.glb'].__test = elm;

													break;
												}

												case 'Burger003':
												{
													elm.visible = false;

													meshes['models/Burger.glb'].__test = elm;

													break;
												}
												case 'Chevapchichi004':
												{
													elm.visible = false;

													meshes['models/Chevapchichi.glb'].__test = elm;

													break;
												}

												default:
												}
											},
										);

										// meshes['models/Kupaty_Extra.glb'].__test = meshes['models/Scene.glb'].children[0].children[29];
										// meshes['models/Bacon.glb'].__test = meshes['models/Scene.glb'].children[0].children[25];
										// meshes['models/Sausages_Barbecue.glb'].__test = meshes['models/Scene.glb'].children[0].children[28];
										// meshes['models/Burger.glb'].__test = meshes['models/Scene.glb'].children[0].children[27];
										// meshes['models/Barbecue_Classic.glb'].__test = meshes['models/Scene.glb'].children[0].children[26];
										// meshes['models/Steak.glb'].__test = meshes['models/Scene.glb'].children[0].children[31];
										// meshes['models/Chevapchichi.glb'].__test = meshes['models/Scene.glb'].children[0].children[30];

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
										// scene.add(meshes['models/Sauces.glb']);
										scene.add(meshes['models/Mayonnaise.glb']);
										scene.add(meshes['models/SoySauce.glb']);
										scene.add(meshes['models/Vinegar.glb']);
										// scene.add(meshes['models/Spices.glb']);
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
												meshes['models/Grill.glb'].animations['Grill_Start'].play();

												audio['audio/Nachalo.wav'].play();

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
						// _camera.position.set(0, 6, 6);
						// _camera.lookAt(xz_plane_intersection);
						// _camera.updateMatrix();
						// _camera.updateMatrixWorld();

						if (grid_mesh)
						{
							raycaster.setFromCamera(screen_center, _camera);

							raycaster.ray.intersectPlane(xz_plane, xz_plane_intersection);

							grid_mesh.position.copy(xz_plane_intersection);

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
							// const sc = Math.sin(plane_material.uniforms.time.value);

							plane.lookAt(_camera.position);
							plane.position.y = xz_plane_intersection.y + 0.760915 + (((trans2 * 0.8) + (s * 0.1)) * zoom);
							// plane.scale.set(trans2 * (zoom + (s * 0.1)), trans2 * (zoom + (s * 0.1)), trans2 * (zoom + (s * 0.1)));
							plane.scale.set(trans2 * (zoom + sc * zoom), trans2 * (zoom + sc * zoom), trans2 * (zoom + sc * zoom));

							// meat.position.y = xz_plane_intersection.y + (((trans2 * 0.8) + (s * 0.1)) * zoom);
							// meat.position.set(0, xz_plane_intersection.y + (((trans2 * 0.8) + (s * 0.1)) * zoom), 0).sub(meat_position2.copy(meat_position).multiplyScalar(zoom + sc - 1));
							meat.position
								.copy(xz_plane_intersection)
								.setY(meat.position.y + ((trans2 * 0.8) + (s * 0.1)) * zoom)
								.sub(meat_position2.copy(meat_position).multiplyScalar(zoom + sc - 1));
							// meat.position.y = plane.position.y;
							meat.scale.set(zoom + sc * zoom, zoom + sc * zoom, zoom + sc * zoom);
							// LOG(meat.position.x, meat.position.y, meat.position.z)
						}

						meshes['models/Scene.glb']?.visible && meshes['models/Scene.glb'].mixer.update(clock_delta);
						meshes['models/Meatman.glb']?.visible && meshes['models/Meatman.glb'].mixer.update(clock_delta);
						meshes['models/Grill.glb']?.visible && meshes['models/Grill.glb'].mixer.update(clock_delta);
						meshes['models/Mayonnaise.glb']?.visible && meshes['models/Mayonnaise.glb'].mixer.update(clock_delta);
						meshes['models/SoySauce.glb']?.visible && meshes['models/SoySauce.glb'].mixer.update(clock_delta);
						meshes['models/Vinegar.glb']?.visible && meshes['models/Vinegar.glb'].mixer.update(clock_delta);
					},
				},
			],
		);

		XR8.run({ canvas });
	},
);
