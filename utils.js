'use_strict';

function loadVideo(vid, arController, onLoaded) {
	let video = document.createElement("video")
	video.src=vid;
	video.autoplay=true;
	onLoaded(video);
};

function loadCamera(arController, onLoaded) {
	let conf = {maxARVideoSize: 320,
				cameraParam: 'lib/camera_para.dat',
				onSuccess: onLoaded};
	ARController.getUserMedia(conf);
}

function initializeRenderer(arController, renderer) {
	document.body.className = arController.orientation;
	arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

	if (arController.orientation === 'portrait') {
		let w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
		let h = window.innerWidth;
		renderer.setSize(w, h);
		renderer.domElement.style.paddingBottom = (w-h) + 'px';
	} else {
		if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
			renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
		} else {
			renderer.setSize(arController.videoWidth, arController.videoHeight);
			document.body.className += ' desktop';
		}
	}
	//document.body.insertBefore(renderer.domElement, document.body.firstChild);
	//document.body.appendChild(renderer.domElement);
	const val = document.getElementById("canvas");
	val.append(renderer.domElement);
}

