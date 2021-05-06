/*
global

LOG,
XR8,
*/

/*
eslint-disable

no-bitwise,
*/



// import FileSaver from 'file-saver';
import * as THREE from 'three';
import './index.scss';
import '@babel/polyfill';



const [ video ] = document.getElementsByTagName('video');
const [ canvas ] = document.getElementsByTagName('canvas');

video.width = window.innerWidth;
video.height = window.innerHeight;

// const setCanvas1Size = () => {

// 	canvas1.width = window.innerWidth;
// 	canvas1.height = window.innerHeight;
// };



const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();



const _3renderer = new THREE.WebGL1Renderer({ canvas });
// _3renderer.physicallyCorrectLights = true;
_3renderer.setSize(window.innerWidth, window.innerHeight);
_3renderer.setClearColor('grey', 1);
_3renderer.autoClear = false;

const gl = _3renderer.getContext();

const camera_stream_texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, camera_stream_texture);
gl.activeTexture(gl.TEXTURE0);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);



// class CameraStream {

// 	constructor () {

// 		this.program = gl.createProgram();

// 		this.vertex_shader_code =

// 			`
// 			precision highp float;

// 			attribute vec2 a_position;

// 			void main (void)

// 				{
// 					gl_Position = vec4(a_position, 0.0, 1.0);
// 				}
// 			`;

// 		this.vertex_shader = gl.createShader(gl.VERTEX_SHADER);

// 		gl.shaderSource(this.vertex_shader, this.vertex_shader_code);
// 		gl.compileShader(this.vertex_shader);

// 		if (!gl.getShaderParameter(this.vertex_shader, gl.COMPILE_STATUS)) {

// 			const _error =
// 				`\n${ this.vertex_shader_code.split('\n').map((elm, i) => `${ i + 1 }:${ elm }`).join('\n') }\n`;

// 			throw new Error(`${ _error }${ gl.getShaderInfoLog(this.vertex_shader) }`);
// 		}

// 		gl.attachShader(this.program, this.vertex_shader);



// 		this.fragment_shader_code =

// 			`
// 			precision highp float;

// 			uniform sampler2D camera_stream;

// 			void main (void)

// 				{
// 					gl_FragColor =
// 						texture2D(

// 							camera_stream,

// 							gl_FragCoord.xy / vec2(${ window.innerWidth }, ${ window.innerHeight })
// 						);

// 					// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// 				}
// 			`;

// 		this.fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);

// 		gl.shaderSource(this.fragment_shader, this.fragment_shader_code);
// 		gl.compileShader(this.fragment_shader);

// 		if (!gl.getShaderParameter(this.fragment_shader, gl.COMPILE_STATUS)) {

// 			const _error =
// 				`\n${ this.fragment_shader_code.split('\n').map((elm, i) => `${ i + 1 }:${ elm }`).join('\n') }\n`;

// 			throw new Error(`${ _error }${ gl.getShaderInfoLog(this.fragment_shader) }`);
// 		}

// 		gl.attachShader(this.program, this.fragment_shader);

// 		gl.linkProgram(this.program);

// 		this.attribute_location_position = gl.getAttribLocation(this.program, 'a_position');

// 		gl.enableVertexAttribArray(this.attribute_location_position);

// 		gl.useProgram(this.program);
// 		gl.uniform1i(gl.getUniformLocation(this.program, 'camera_stream'), 0);
// 		// gl.useProgram(null);

// 		this.vertex_buffer = gl.createBuffer();

// 		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
// 		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1, -3, 3, 1, -1, 1 ]), gl.STATIC_DRAW);
// 		gl.bindBuffer(gl.ARRAY_BUFFER, null);
// 	}

// 	draw () {

// 		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
// 		gl.vertexAttribPointer(this.attribute_location_position, 2, gl.FLOAT, 0, 0, 0);
// 		gl.useProgram(this.program);
// 		gl.drawArrays(gl.TRIANGLES, 0, 3);
// 		// gl.useProgram(null);
// 		// gl.bindBuffer(gl.ARRAY_BUFFER, null);
// 	}
// }



// const camera_stream = new CameraStream();



const _3scene = new THREE.Scene();



const raw_material = new THREE.RawShaderMaterial({

	uniforms: {

		camera_stream: { value: new THREE.VideoTexture(video) },
	},

	vertexShader:

		`
		precision highp float;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 v_uv;

		void main (void)

			{
				v_uv = uv;

				gl_Position = vec4(position, 1.0);
			}
		`,

	fragmentShader:

		`
		precision highp float;

		uniform sampler2D camera_stream;

		varying vec2 v_uv;

		void main (void)

			{
				gl_FragColor = texture2D(camera_stream, v_uv);

				// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			}
		`,
});

// const plane


const surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), raw_material);
LOG(surface)

// _3scene.add(surface);



const _3camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
// _3camera.position.z = 12;

const _3cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }));

_3cube.position.z = -4;

_3scene.add(_3cube);

// LOG(gl.getParameter(gl.CURRENT_PROGRAM))



window.addEventListener('xrloaded', () => {

	// const er = XR8.GlTextureRenderer.create({ GLctx: gl, toTexture: camera_stream_texture });

	// LOG(er.shader())

	// const asd = XR8.GlTextureRenderer.pipelineModule({ toTexture: camera_stream_texture });

	// LOG(asd)

	// asd.onUpdate = () => {

	// 	LOG(123)
	// };

	// XR8.addCameraPipelineModule(asd);

	// XR8.GlTextureRenderer.configure({ vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })

	// XR8.addCameraPipelineModule({

	// 	name: 'gltexturerenderer',

	// 	onUpdate: (evt) => {

	// 		LOG(evt)
	// 	},
	// });

	// XR8.XrController.configure({ imageTargets: [ 'logo' ] });

	// XR8.addCameraPipelineModule(XR8.XrController.pipelineModule());

	// XR8.addCameraPipelineModule({

	// 	name: 'TRANSFORMATION UPDATE',

	// 	onUpdate:

	// 		(evt) => {

	// 			_3camera.quaternion.copy(evt.processCpuResult?.reality?.rotation || _q);
	// 			_3camera.position.copy(evt.processCpuResult?.reality?.position || _v);
	// 		},
	// });

	// XR8.addCameraPipelineModule(

	// 	{
	// 		name: 'IMAGE TARGET EVENT PROCESSING',

	// 		listeners:

	// 			[
	// 				{ event: 'reality.imageloading', process: () => LOG('imageloading') },
	// 				// {event: 'reality.imagescanning', process: logEvent },
	// 				{ event: 'reality.imagefound', process: () => LOG('FOUND') },
	// 				// {event: 'reality.imageupdated', process: logEvent},
	// 				// {event: 'reality.imagelost', process: logEvent},
	// 			],
	// 	},
	// );

	// XR8.run(

	// 	{

	// 		// canvas: null,

	// 		cameraConfig: XR8.XrConfig.camera().BACK,

	// 		allowedDevices: XR8.XrConfig.device().ANY,

	// 		webgl2: false,

	// 		// glContextConfig: { alpha: false },
	// 	},
	// );

	const _3animate = () => {

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

		_3renderer.clear();

		gl.disable(gl.DEPTH_TEST);

		_3renderer.render(surface, _3camera);

		gl.enable(gl.DEPTH_TEST);

		_3renderer.render(_3scene, _3camera);

		requestAnimationFrame(_3animate);
	};

	_3animate();

	// window.addEventListener('resize',	setCanvas1Size);
});

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	.then(

		(stream) => {

			video.srcObject = stream;

			video.play();

			gl.bindTexture(gl.TEXTURE_2D, camera_stream_texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
		},
	);
