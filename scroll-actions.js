gsap.registerPlugin(ScrollTrigger);

function ScrollActions() {
	this.dispatch = function (dispatch) {
		if (arguments.length > 0) {
			this._dispatch = dispatch;
			return this;
		}
		return this._dispatch;
	};

	this.addScrollTriggers = function () {
		gsap.to("#annotation-container", {
			scrollTrigger: {
				trigger: "#annotation-container",
				start: "top bottom",
				end: "bottom bottom",
				pin: "#bar-chart",
				pinSpacing: false,
				markers: false,
			},
		});

		let elements = document.getElementsByClassName("annotation");
		elements = Array.from(elements);
		console.log(elements);

		elements.forEach((el, i) => {
			let elId = el.getAttribute("id");
			console.log(elId);

			gsap.to(`#${elId}`, {
				scrollTrigger: {
					trigger: `#${elId}`,
					start: "top 80%",
					end: "bottom center",
					onEnter: () => {
						this._dispatch.call(
							"changeState",
							this,
							el.dataset.state
						);
					},
					onEnterBack: () => {
						this._dispatch.call(
							"changeState",
							this,
							el.dataset.state
						);
					},
					markers: false,
				},
				duration: 1,
			});
		});
	};
}
