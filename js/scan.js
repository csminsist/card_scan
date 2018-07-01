/**
 * Html5 Scan
 * @author chenshunmu
 * @version 1.0
 * @date 2018年7月1日20:23:23
 */
(function(w, dom, navig) {
	'use strict';

	let default_pictureSetting = {
		width: 320,
		height: 480,
		picture_type: 0 // 0 竖屏 1 横屏
	}
	const PICTURE_WRAPPER_CLASS = "picture_wrapper";
	const PICTURE_CONTENT_WRAPPER_CLASS = "picture_content_wrapper";
	const PICTURE_BUTTON_WRAPPER_CLASS = "picture_button_wrapper";
	const PICTURE_BUTTON_CLASS = "picture_button";

	//调用浏览器媒体
	let getMedia = function(video, sucCallback, errorCallback) {
		if(navig.mediaDevices.video) {
			//最新的标准API
			navig.mediaDevices.getUserMedia(video).then(sucCallback).catch(errorCallback);
		} else if(navigator.webkitGetUserMedia) {
			//webkit核心浏览器
			navig.webkitGetUserMedia(video, sucCallback, errorCallback)
		} else if(navigator.mozGetUserMedia) {
			//firfox浏览器
			navig.mozGetUserMedia(video, sucCallback, errorCallback);
		} else if(navigator.getUserMedia) {
			//旧版API
			navig.getUserMedia(video, sucCallback, errorCallback);
		}
	}

	class Scan {
		constructor(pictureSetting, get) {
			this.$pictureSetting = Object.assign(default_pictureSetting, pictureSetting);
			this.init();
			this.$video = document.getElementById(this.$doms.video_id);
			this.$canvas = document.getElementById(this.$doms.canvas_id);
			this.$context = this.$canvas.getContext('2d');
			this.getPic = get;
		}
		init() {

			if(this.$pictureSetting.picture_type === 1) {
				let w = this.$pictureSetting.width;
				let h = this.$pictureSetting.height;
				this.$pictureSetting.width = h;
				this.$pictureSetting.height = w;
			}

			let cameraSetting = getCameraSettingArgs(this.$pictureSetting);

			let _picture_wrapper_id = "picture_wrapper_" + (Math.random() * 1000);
			let _video_id = "video_" + (Math.random() * 1000);
			let _canvas_id = "canvas_" + (Math.random() * 1000);
			let _button_wrap_id = "botton_wrapper_" + (Math.random() * 1000);
			let _content_wrapper_id = "content_wrapper_" + (Math.random() * 1000);
			let _picture_button_id = "picture_button_" + (Math.random() * 1000);

			this.$doms = {
				picture_id: _picture_wrapper_id,
				video_id: _video_id,
				canvas_id: _canvas_id,
				button_wrap_id: _button_wrap_id,
				content_wrapper_id: _content_wrapper_id,
				picture_button_id: _picture_button_id
			}
			// 创建容器
			let pictureWrapper = document.createElement("div");
			pictureWrapper.className = PICTURE_WRAPPER_CLASS;
			pictureWrapper.id = _picture_wrapper_id;
			pictureWrapper.style.height = this.$pictureSetting.height + "px";
			pictureWrapper.style.width = this.$pictureSetting.width + "px";
			//			pictureWrapper.style.display = "none";
			//创建video标签
			let tempVideo = document.createElement("video");
			tempVideo.id = _video_id;
			//			tempVideo.setAttribute("height", this.$pictureSetting.height+"px");
			//			tempVideo.setAttribute("width", this.$pictureSetting.width+"px");
			//			tempVideo.height = this.$pictureSetting.height;
			//			tempVideo.width = this.$pictureSetting.width;
			tempVideo.style.height = "100%";
			tempVideo.style.width = "100%";
			// 创建需要依赖的canvas
			let tempCanvas = document.createElement("canvas");
			tempCanvas.id = _canvas_id;
			tempCanvas.height = this.$pictureSetting.height;
			tempCanvas.width = this.$pictureSetting.width;
			tempCanvas.style.display = "none";
			//创建按钮
			let button_wrapper = document.createElement("div");
			button_wrapper.id = _button_wrap_id;

			let content_wrapper = document.createElement("div");
			content_wrapper.id = _content_wrapper_id;
			content_wrapper.className = PICTURE_CONTENT_WRAPPER_CLASS;

			let picture_button = document.createElement("div");
			picture_button.id = _picture_button_id;
			picture_button.className = PICTURE_BUTTON_CLASS;

			button_wrapper.appendChild(picture_button);

			picture_button.addEventListener("click", function() {
				this.$context.drawImage(this.$video, 100, 50, 380, 220, 0, 0, 380, 220);
				var d = this.$canvas.toDataURL("image/png", 1);
				if(typeof(this.getPic) == "function") {
					let args = [d];
					this.getPic.apply(this, args);
				}
			}, false);

			//			content_wrapper.style = {
			//				width:this.$pictureSetting.width - 100, // 其中 80 留作按钮的空间 20 留作margin
			//				height:this.$pictureSetting.height - 10,//若是竖屏控制高度
			//				"max-height": this.$pictureSetting.picture_type === 1 ? this.$pictureSetting.height - 10:300,
			//				"display": this.$pictureSetting.picture_type === 1 ? "inline-block" : "block"
			//			}
			if(this.$pictureSetting.picture_type === 1) { //横屏
				// 0.2
				// 0.07
				let mleft = this.$pictureSetting.width * 0.07;
				let tb = this.$pictureSetting.height * 0.2;
				let button_wrap_width = this.$pictureSetting.width * 0.2;
				// button_wrapper
				button_wrapper.style.width = button_wrap_width + "px";
				button_wrapper.setAttribute("class", PICTURE_BUTTON_WRAPPER_CLASS + " transverse");
				button_wrapper.style.backgroundColor = "#99CCCC";

				//button

				let content_width = (this.$pictureSetting.width - button_wrap_width - 20 - 40);
				if(typeof(this.$pictureSetting.content_width) == "number") {
					content_wrapper.style.width = this.$pictureSetting.content_width + "px";
				} else {
					content_wrapper.style.width = content_width + "px";
				}
				content_wrapper.style.border = "1px solid #eee";
				content_wrapper.style.marginLeft = mleft + "px";
				content_wrapper.style.marginTop = tb + "px";
				content_wrapper.style.marginBottom = tb + "px";
			}

			content_wrapper.appendChild(tempVideo);
			content_wrapper.appendChild(tempCanvas);

			pictureWrapper.appendChild(content_wrapper);
			pictureWrapper.appendChild(button_wrapper);

			document.body.appendChild(pictureWrapper);

		}
		getMedia(video, sucCallback, errorCallback) {
			getMedia(video, sucCallback || function() {}, errorCallback || function() {});
		}

		setType(width, height, picture_type) {
			if(typeof(width) === "number") {
				this.$default_wh.width = width;
			}
			if(typeof(height) === "number") {
				this.$default_wh.height = height;
			}
			if(typeof(picture_type) === "number" && (picture_type === 0 || picture_type === 1)) {
				this.pictureSetting.picture_type = picture_type;
			}
		}

		load(stream) {
			this.$video.srcObject = stream;
			this.$video.play();
		}
		pause() {
			this.$video.pause();
		}
		play() {
			this.$video.play();
		}
		show() {
			let wrapper = document.getElementById(this.$doms.picture_id);
			if(typeof(wrapper) == "undefined") {
				throw new Error("scan not init");
			} else {
				wrapper.style.display = "flex";
			}
		}

	}

	Scan.prototype.start = function(sucCallback, errorCallback) {

		this.show

		this.getMedia({
				video: this.$default_wh
			},
			success,
			error);
	}
	Scan.prototype.getPicture = function() {
		console.log(this.$video)
		//this.$context.drawImage(this.$video, 0, 0, 480, 320);
		this.$context.drawImage(this.$video, 100, 50, 380, 220, 0, 0, 380, 220);
		var d = this.$canvas.toDataURL("image/png", 1);
		return d;
	}

	Scan.prototype.continue = function() {
		this.play();
	}

	window.Scan = Scan;

}(window, document, navigator))