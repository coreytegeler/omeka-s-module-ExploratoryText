require("./exploratory-text.scss");

class ExploratoryText {
	constructor(userOpts = {}) {
		const self = this;
		let defaultOpts = {
			selector: ".exploratory-text-block",
			color: "#0dae0b"
		}
		this.options = Object.assign(defaultOpts, userOpts);

		this.block = document.querySelector(this.options.selector);
		if(!this.block) console.warn("No element matched the selector \""+this.options.selector+"\"");
		this.svg = d3.select(this.block).append("svg");
		this.side = this.block.querySelector(".et-side");
		this.sideInner = this.side.querySelector(".et-side-inner");
		this.nav = document.querySelector("nav.fixed");
		this.highlights = [null];
		this.annots = [null];
		this.paths = [null];
		this.init();
	}

	getAnnot(index) {
		return this.block.querySelector(".et-annot[data-index='"+index+"']");
	}

	getHighlight(index) {
		return this.block.querySelectorAll(".et-highlight[data-index='"+index+"']");
	}

	drawConnection(context, highlight, annot, path) {
		if(!highlight || !annot || !path) return;
		const first = highlight.querySelector(".et-first"),
					blockBounds = this.block.getBoundingClientRect(),
					firstBounds = first.getBoundingClientRect(),
					annotBounds = annot.getBoundingClientRect(),
					scrollTop = document.documentElement.scrollTop,
					annotX = annotBounds.right - blockBounds.left,
					annotY = annotBounds.y + annotBounds.height/2 - blockBounds.top,
					firstX = firstBounds.left - blockBounds.left,
					firstY = firstBounds.y + firstBounds.height/2 - blockBounds.top;
		context.moveTo(annotX, annotY);
		context.lineTo(firstX, firstY);
		return context;
	}

	// makeConnections() {
		// const self = this,
		// 			width = this.block.clientWidth,
		// 			height = this.block.clientHeight;
		// this.svg.attr("width", width)
		// 				.attr("height", height);
		
		// this.highlights.forEach(function(highlight, i) {
		// 	let annot = self.annots[i],
		// 			path = self.paths[i];

		// 	if(!path) {
		// 		path = self.svg.append("path");
		// 		path.attr("data-index", i);
		// 		self.paths.push(path);
		// 	}
			// path.attr("d", self.drawConnection(d3.path(), highlight, annot, path));
	// 	});
	// };

	showConnection(index) {
		let annot = this.getAnnot(index),
				highlight = this.getHighlight(index),
				path = this.paths[index];

		if(annot) annot.classList.add("et-focus");
		highlight.forEach(elem => elem.classList.add("et-focus"));
		// if(path) path.classed("et-preview", true);
		// this.makeConnections();
	}

	hideConnection(index) {
		let annot = this.getAnnot(index),
				highlight = this.getHighlight(index),
				path = this.paths[index];

		if(annot) annot.classList.remove("et-focus");
		highlight.forEach(elem => elem.classList.remove("et-focus"));
		// if(path) path.classed("et-preview", false);
		// this.makeConnections();
	};

	scrollTo(index) {
		const annot = this.getAnnot(index),
					nav = document.querySelector("nav.fixed"),
					sideInner = this.block.querySelector(".et-side-inner");
		if(!annot.length) return;
		const annotBounds = annot.getBoundingClientRect(),
					sideBounds = sideInner.getBoundingClientRect(),
					navBounds = nav.getBoundingClientRect();
		sideInner.scrollBy({
			top: annotBounds.top - navBounds.height,
			behavior: "smooth"
		});
	}

	openAnnotation(index) {
		const annot = this.getAnnot(index),
					highlight = this.getHighlight(index),
					path = this.paths[index];
		
		if(annot) annot.classList.add("et-open");
		highlight.forEach(elem => elem.classList.add("et-open"));

		this.scrollTo(index);
		this.side.classList.remove("et-side-empty");
		
		this.showConnection(index);
	}

	closeAnnotation(index) {
		const annot = this.getAnnot(index),
					highlight = this.getHighlight(index),
					path = this.paths[index];
		if(annot) annot.classList.remove("et-open");
		highlight.forEach(elem => elem.classList.remove("et-open"));

		if(!this.side.querySelectorAll(".et-open").length) {
			this.side.classList.add("et-side-empty");
		}
		this.hideConnection(index);
	}

	positionAnnotations(e) {
		const blockBounds = this.block.getBoundingClientRect(),
					navBounds = this.nav.getBoundingClientRect(),
					sideBounds = this.side.getBoundingClientRect();
			
		this.sideInner.style.width = sideBounds.width + "px";
		this.side.style.height = (this.sideInner.scrollHeight + sideBounds.top) + "px";
		if(blockBounds.y <= navBounds.height) {
			this.sideInner.style.height = window.innerHeight - navBounds.height + "px";;
			this.sideInner.style.position = "fixed";
			this.sideInner.style.left = sideBounds.x + "px";
			this.sideInner.style.top = navBounds.height + "px";
		} else {
			this.sideInner.style.position = "absolute";
			this.sideInner.style.left = "";
			this.sideInner.style.top = "";
		}
	}

	resizeAnnotation(annot) {
		annot.classList.toggle("et-less");
	}

	init() {
		const self = this,
					sideInner = document.querySelector(".et-side-inner"),
					highlightElems = this.block.querySelectorAll(".et-body a"),
					annotElems = document.querySelectorAll(".et-annot"),
					pathElems = [];
		let highlightIndex = 1;

		annotElems.forEach((annot, i) => {
			const annotBody = annot.querySelector(".et-annot-body"),
						annotIndex = annot.querySelector(".et-annot-index"),
						annotToggle = annot.querySelector(".et-annot-toggle"),
						annotClose = annot.querySelector(".et-annot-close");
			annot = sideInner.appendChild(annot);

			const highlightStr = annot.dataset.highlight;

			highlightElems.forEach(function(highlight, i) {
				if(highlightStr === highlight.innerText) {
					const type = annot.dataset.type;
					highlight.classList.add("et-highlight");
					highlight.dataset.type = type;
					highlight.dataset.index = highlightIndex;
					annot.dataset.index = highlightIndex;
					annotIndex.innerText = highlightIndex;
					self.annots[highlightIndex] = annot;
					self.highlights[highlightIndex] = highlight;
				}
			});

			// annot.onclick = function(e) {
			// 	e.preventDefault();
			// 	let index = annot.dataset.index;
			// 	self.openAnnotation(index);
			// }

			annot.onmouseover = function(e) {
				const index = annot.dataset.index;
				self.showConnection(index);
			}

			annot.onmouseleave = function(e) {
				const index = annot.dataset.index;
				self.hideConnection(index);
			}

			annotToggle.onclick = function(e) {
				self.resizeAnnotation(annot);
			}

			annotClose.onclick = function(e) {
				const index = annot.dataset.index;
				self.closeAnnotation(index);
			}

			annot.classList.remove("hidden");
			highlightIndex++;

		});

		highlightElems.forEach(function(highlight, i) {

			const type = highlight.dataset.type,
						index = highlight.dataset.index,
						annot = self.getAnnot(index);
			
			if(annot) annot.classList.add(type);

			let highlightStr = highlight.innerText,
					highlightIndex = parseInt(highlight.dataset.index),
					textArr = highlightStr.split(" "),
					textLen = textArr.length;

			if(isNaN(highlightIndex)) {
				highlight.setAttribute("class", "inactive");
			} else {
				if(textArr.length > 1) {
					textArr[0] = "<span class='et-first'>"+textArr[0]+"</span>";
					textArr[textLen-1] = "<span class='et-last' data-index-label='"+(highlightIndex)+"'>"+textArr[textLen-1]+"</span>";
				} else {
					textArr[0] = "<span class='et-first et-last' data-index-label='"+(highlightIndex)+"'>"+textArr[0]+"</span>";
				}
				highlight.innerHTML = textArr.join(" ");
			}

			highlight.onclick = function(e) {
				e.preventDefault();
				let index = highlight.dataset.index;
				self.openAnnotation(index);
			}

			highlight.onmouseover = function(e) {
				let index = highlight.dataset.index;
				self.showConnection(index);
			}

			highlight.onmouseleave = function(e) {
				let index = highlight.dataset.index;
				self.hideConnection(index);
			}

		});

		this.side.onscroll = function(e) {
			// self.makeConnections();
		}

		window.onscroll = function(e) {
			self.positionAnnotations();
			// self.makeConnections();
		}

		window.onresize = function(e) {
			self.positionAnnotations();
			// self.makeConnections();
		}

		this.positionAnnotations();
		// this.makeConnections();
	}

};

window.onload = function() {
	const inst = new ExploratoryText();
}