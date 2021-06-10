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



// 0: Bone {uuid: "C031C906-524A-4328-BCEB-C9F0E5E44EAB", name: "Koriandr", type: "Bone", parent: Object3D, children: Array(1), …}
// 1: Bone {uuid: "CE636593-433D-4DD7-942C-516EB5B5DD62", name: "DEF-forearmL001", type: "Bone", parent: Object3D, children: Array(2), …}
// 2: Bone {uuid: "BCA2F448-ED01-425D-A82F-7E81377E25C0", name: "Chesnok", type: "Bone", parent: Object3D, children: Array(1), …}
// 3: Bone {uuid: "DF8DB5FA-77BD-4B6D-AD71-0C217CFC7572", name: "FXLight", type: "Bone", parent: Object3D, children: Array(1), …}
// 4: Bone {uuid: "705AD819-962F-403D-98A9-5B884F8FEA12", name: "Tray", type: "Bone", parent: Object3D, children: Array(1), …}
// 5: Bone {uuid: "341E66AC-CB89-4A29-BC0D-A81B4418EA10", name: "Wood_Plate", type: "Bone", parent: Object3D, children: Array(1), …}
// 6: Bone {uuid: "A297F8FD-B14C-4E09-9C6A-87DA2985AD47", name: "Chabrec", type: "Bone", parent: Object3D, children: Array(1), …}
// 7: Bone {uuid: "4F6C01B5-D9BA-449F-8A84-622F493D4114", name: "root", type: "Bone", parent: Object3D, children: Array(1), …}
// 8: Bone {uuid: "E1EA8112-2742-4C79-AE0E-E95C72644E1C", name: "Bazilik", type: "Bone", parent: Object3D, children: Array(1), …}
// 9: Bone {uuid: "0414392B-F8AB-43AB-A7EA-48F43C524D41", name: "Luk", type: "Bone", parent: Object3D, children: Array(1), …}
// 10: Bone {uuid: "9F9CE3F5-8B4F-4745-9FBB-767F53EF1790", name: "Paprika", type: "Bone", parent: Object3D, children: Array(1), …}
// 11: Bone {uuid: "C6D41D40-89AD-44D1-B04A-F38915F61952", name: "Petrushka", type: "Bone", parent: Object3D, children: Array(1), …}
// 12: Bone {uuid: "6D26CFD8-8692-4568-B222-89E9A8190455", name: "DEF-forearmR001", type: "Bone", parent: Object3D, children: Array(2), …}
// 13: Bone {uuid: "917362E1-33ED-41FE-8975-48DA7EF42B1B", name: "Perec", type: "Bone", parent: Object3D, children: Array(1), …}
// 14: Bone {uuid: "5595A46B-9B1C-4F3D-BEDF-8EA98BA3D552", name: "Salt", type: "Bone", parent: Object3D, children: Array(1), …}
// 15: SkinnedMesh {uuid: "8C5DFF70-4FBB-4707-99E5-E89ADBBB4070", name: "Tray_1", type: "SkinnedMesh", parent: Object3D, children: Array(0), …}
// 16: SkinnedMesh {uuid: "66769C95-4CF4-4D61-B7F7-42687215FFB0", name: "Tray_Barbecue", type: "SkinnedMesh", parent: Object3D, children: Array(0), …}
// 17: SkinnedMesh {uuid: "71812605-24D5-45EC-A26D-ED78C3089DF6", name: "Meatman_Head", type: "SkinnedMesh", parent: Object3D, children: Array(0), …}
// 18: Group {uuid: "D8F2DF33-FE19-430A-8724-447D0A00B272", name: "Meatman_Body", type:



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



// [
// 	'models/Kupaty_Extra.glb',
// 	'models/Bacon.glb',
// 	'models/Sausages_Barbecue.glb',
// 	'models/Burger.glb',
// 	'models/Barbecue_Classic.glb',
// 	'models/Steak.glb',
// 	'models/Chevapchichi.glb',
// ]



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
	},
};

let spice_set = null;

let selected_spice_set = [];

// let count = 0;



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

						cube_map =
							await CubeTextureLoader.load([ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ]);

						for (let i = 0; i < paths.length; ++i)
						{
							meshes[paths[i]] = await parseGlb(external_data_loader.content[paths[i]]);
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

												// LOG(spice_set)

												spice_set.name = null;

												spice_set.match = null;

												spice_set.unique = [];

												let count = 0;

												let key = null;

												for (key in spice_set)
												{
													if (key !== 'match' && key !== 'unique' && key !== 'name')
													{
														spice_set.unique.push(...spice_set[key]);
													}

													++count;
												}

												if (count === 4)
												{
													spice_set.match = spice_set[key];
												}

												spice_set.unique = Array.from(new Set(spice_set.unique)).sort((a, b) => (a - b));

												// LOG(spice_set.unique)

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

												// LOG(spice_set)

												spice_set.name = null;

												spice_set.match = null;

												spice_set.unique = [];

												let count = 0;

												let key = null;

												for (key in spice_set)
												{
													if (key !== 'match' && key !== 'unique' && key !== 'name')
													{
														spice_set.unique.push(...spice_set[key]);
													}

													++count;
												}

												if (count === 4)
												{
													spice_set.match = spice_set[key];
												}

												spice_set.unique = Array.from(new Set(spice_set.unique)).sort((a, b) => (a - b));

												// LOG(spice_set.unique)

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
								case 'Scene_GetBarbecue':

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


									case 'Marinade_Wrong01':
									case 'Marinade_Wrong02':
									case 'Marinade_Wrong03':

									// salt
									// case 'Get_Spices_Perec':
									case 'Get_Spices_Perec':
									case 'Get_Spices_Luk':
									case 'Get_Spices_Paprika':
									case 'Get_Spices_Petrushka':
									case 'Get_Spices_Bazilik':
									case 'Get_Spices_Chabrec':
									case 'Get_Spices_Coriander':
									case 'Get_Spices_Chesnok':

										// LOG(spice_set.match, selected_spice_set)

										if (spice_set.match && selected_spice_set.length === spice_set.match.length)
										{
											// LOG('!!!!!', spice_set.name)

											change_trans = true;

											tray.visible = false;
											tray_barbecue.visible = false;

											meat.__test.visible = false;

											plane.visible = true;

											meat.visible = true;

											meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations['Final'].play();
										}
										else
										{
											meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].play();
										}

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

						[
							'Marinade_Wrong02',
							'Marinade_Wrong01',
							'Marinade_Wrong03',
						]
							.forEach(

								(elm, elm_index) =>
								{
									sauce_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											sauce_buttons[elm_index].style.display = 'none';

											meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations[elm].play();
										},
									);
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

						[
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Luk',
							'Get_Spices_Paprika',
							'Get_Spices_Petrushka',
							'Get_Spices_Bazilik',
							'Get_Spices_Chabrec',
							'Get_Spices_Coriander',
							'Get_Spices_Perec',
							'Get_Spices_Chesnok',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
							'Get_Spices_Perec',
						]
							.forEach(

								(elm, elm_index) =>
								{
									spices_buttons[elm_index].style.display = 'none';

									spices_buttons[elm_index].addEventListener(

										'click',

										() =>
										{
											LOG('push', elm_index)
											selected_spice_set.push(elm_index);
											selected_spice_set = selected_spice_set.sort((a, b) => (a - b));

											LOG(selected_spice_set)

											if (!spice_set.match)
											{
												let count = 0;
												let match = null;
												let name = null;

												for (const key in spice_set)
												{
													// LOG(111, key, elm_index, spice_set[key], spice_set[key].includes(elm_index))
													if (key !== 'match' && key !== 'unique' && key !== 'name' && spice_set[key].includes(elm_index))
													{
														// LOG(222, key, elm_index, spice_set[key], spice_set[key].includes(elm_index))
														++count;
														// spice_set.match = spice_set[key];
														// spice_set.name = key;

														match = spice_set[key];
														name = key;
													}
												}

												LOG(count, spice_set)

												if (count < (Object.keys(spice_set).length - 3))
												{
													spice_set.match = match;
													spice_set.name = name;

													LOG(777, spice_set.match)

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

													// LOG(spice_set.match)
												}
											}

											spices_buttons[elm_index].style.display = 'none';

											LOG('play', elm)

											meshes['models/Meatman.glb'].animations['Idle_Marinade&Spices'].stop();
											meshes['models/Meatman.glb'].animations[elm].play();
										},
									);
								},
							);



						document.getElementsByClassName('cook-more')[0].addEventListener(

							'click',

							() =>
							{
								// count = 0;

								document.getElementsByClassName('camera-section')[5].style.display = 'none';

								meat.visible = false;
								plane.visible = false;
								meshes['models/Sauces.glb'].visible = false;
								meshes['models/Spices.glb'].visible = false;

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

								meshes['models/Scene.glb'].animations['Scene_Marinade&Spices'].stop();
								meshes['models/Scene.glb'].animations['Scene_Start'].play();
								meshes['models/Meatman.glb'].animations['Final_Idle'].stop();
								meshes['models/Meatman.glb'].animations['Start'].play();
								meshes['models/Grill.glb'].animations['Grill_Start'].play();
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

										meshes['models/Scene.glb'].children[0].children.slice(25).forEach(

											(elm) =>
											{
												elm.visible = false;
											},
										);

										meshes['models/Sauces.glb'].visible = false;
										meshes['models/Spices.glb'].visible = false;

										window._Q = meshes['models/Scene.glb'].children[0].children;

										// LOG(meshes['models/Scene.glb'].children[0].children)

										meshes['models/Kupaty_Extra.glb'].__test = meshes['models/Scene.glb'].children[0].children[29];
										meshes['models/Bacon.glb'].__test = meshes['models/Scene.glb'].children[0].children[25];
										meshes['models/Sausages_Barbecue.glb'].__test = meshes['models/Scene.glb'].children[0].children[28];
										meshes['models/Burger.glb'].__test = meshes['models/Scene.glb'].children[0].children[27];
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
												meshes['models/Grill.glb'].animations['Grill_Start'].play();

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

							// _camera.position.set(0, 8, 8);
							// _camera.lookAt(xz_plane_intersection);
							// _camera.updateMatrix();
							// _camera.updateMatrixWorld();

							plane.lookAt(_camera.position);
							plane.position.y = xz_plane_intersection.y + 0.760915 + (((trans2 * 0.8) + (s * trans2 * 0.1)) * zoom);
							plane.scale.set(trans2, trans2, trans2);

							if (meat)
							{
								meat.position.y = xz_plane_intersection.y + (((trans2 * 0.8) + (s * trans2 * 0.1)) * zoom);
								// meat.scale.set(sc, sc, sc);
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
