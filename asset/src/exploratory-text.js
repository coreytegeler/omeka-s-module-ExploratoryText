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
		this.links = this.block.querySelectorAll(".exploratory-text-inner a");
		this.side = this.block.querySelector(".exploratory-text-side");
		this.panels = document.querySelectorAll(".exploratory-text-panel");
		this.paths = [];
		this.init();
	}



	drawConnection(context, link, panel, path) {
		if(!link || !panel || !path) return;
		const title = panel.querySelector(".title"),
					anchor = link.querySelector(".anchor"),
					blockBounds = this.block.getBoundingClientRect(),
					anchorBounds = anchor.getBoundingClientRect(),
					panelBounds = panel.getBoundingClientRect(),
					titleBounds = title.getBoundingClientRect(),
					scrollTop = document.documentElement.scrollTop,
					titleX = titleBounds.right - blockBounds.left,
					titleY = titleBounds.y + titleBounds.height/2 - blockBounds.top,
					anchorX = anchorBounds.left - blockBounds.left,
					anchorY = anchorBounds.y + anchorBounds.height/2 - blockBounds.top;
		context.moveTo(titleX, titleY);
		context.lineTo(anchorX, anchorY);
		return context;
	}

	makeConnections() {
		const self = this,
					width = this.block.clientWidth,
					height = this.block.clientHeight;
		this.svg.attr("width", width)
						.attr("height", height);
		
		this.links.forEach(function(link, i) {

			let panel = self.panels[i],
					path = self.paths[i];
			if(!path) {
				path = self.svg.append("path");
				path.attr("data-index", i);
				self.paths.push(path);
			}

			if(!link.querySelector(".anchor")) {
				let linkStr = link.innerText,
						textArr = linkStr.split(" ");
				textArr[0] = "<span class='anchor'>"+textArr[0]+"</span>";
				link.innerHTML = textArr.join(" ");
			}
			path.classed(link.getAttribute("class"), true);
			path.attr("d", self.drawConnection(d3.path(), link, panel, path));
		});
	};

	selectConnection(i) {
		let panel = this.panels[i],
				link = this.links[i],
				path = this.paths[i];
		if(panel) {
			let details = panel.querySelector("details");
			panel.classList.toggle("selected");
			details.open = !details.open;
		}
		if(link) link.classList.toggle("selected");
		if(path) path.classed("selected", !path.classed("selected"));
		this.makeConnections();
	}

	showConnection(i) {
		let panel = this.panels[i],
				link = this.links[i],
				path = this.paths[i];

		if(panel) panel.classList.add("visible");
		if(link) link.classList.add("visible");
		if(path) path.classed("visible", true);
		this.makeConnections();
	}

	hideConnection(i) {
		let panel = this.panels[i],
				link = this.links[i],
				path = this.paths[i];

		if(panel) panel.classList.remove("visible");
		if(link) link.classList.remove("visible");
		if(path) path.classed("visible", false);
		this.makeConnections();
	};

	positionPanels(e) {
		const side = this.block.querySelector(".exploratory-text-side"),
					supportPageOffset = window.pageXOffset !== undefined,
					isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
					scrollY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop,
					blockBounds = this.block.getBoundingClientRect(),
					blockY = blockBounds.y,
					nav = document.querySelector("nav.fixed"),
					navBounds = nav.getBoundingClientRect(),
					navY = navBounds.y;
		
		if(blockY <= navY) {
			side.classList.add("fixed");
		} else {
			side.classList.remove("fixed")
		}

		// var mainHeaderHeight = $mainHeader.outerHeight(),
	//       mainHeaderTop = $mainHeader.offset().top,
	//       mainHeaderBottom = mainHeaderTop + mainHeaderHeight,
	//       fixedNavHeight = $fixedNav.outerHeight(),
	//       scrollTop = $(window).scrollTop();
		// if(scrollTop >= mainHeaderBottom - fixedNavHeight) {
		// 	$body.addClass('fix-nav');
		// 	if ($sideNav.length) {
		// 		var sideNavHeight = $sideNav.innerHeight(),
		// 				sideNavWidth = $sideNavParent.innerWidth(),
		// 				sideNavLeft = $sideNavParent.offset().left;
		// 		$sideNav.css({
		// 			width: sideNavWidth,
		// 			left: sideNavLeft,
		// 			top: fixedNavHeight
		// 		});
		// 		$sideNavParent.css({
		// 			height: sideNavHeight
		// 		});
		// 	}
		// } else {
		// 	$body.removeClass('fix-nav');
		// 	if ($sideNav.length) {
		// 		$sideNav.attr('style', '');
		// 		$sideNavParent.attr('style', '');
		// 	}
		// }
	}

	init() {
		const self = this,
					sideInner = document.querySelector(".exploratory-text-side-inner");

		this.panels.forEach((panel, i) => {

			panel = sideInner.appendChild(panel);
			panel.dataset.index = i;

			let summary = panel.querySelector("summary");
			summary.onclick = function(e) {
				e.preventDefault();
				let index = panel.dataset.index;
				self.selectConnection(index);
			}

			summary.onmouseover = function(e) {
				let index = panel.dataset.index;
				self.showConnection(index);
			}

			summary.onmouseleave = function(e) {
				let index = panel.dataset.index;
				self.hideConnection(index);
			}

			panel.classList.remove("hidden");

		});


		this.links.forEach(function(link, i) {

			const type = link.getAttribute("class"),
						panel = self.panels[i];
			
			if(panel) panel.classList.add(type);

			link.dataset.index = i;

			link.onclick = function(e) {
				e.preventDefault();
				let index = link.dataset.index;
				self.selectConnection(index);
			}

			link.onmouseover = function(e) {
				let index = link.dataset.index;
				self.showConnection(index);
			}

			link.onmouseleave = function(e) {
				let index = link.dataset.index;
				self.hideConnection(index);
			}
		});

		this.side.onscroll = function(e) {
			self.makeConnections();
		}

		window.onscroll = function(e) {
			self.makeConnections();
			self.positionPanels();
		}

		window.onresize = function(e) {
			self.makeConnections();
			self.positionPanels();
		}

		this.makeConnections();
		this.positionPanels();
	}

};

window.onload = function() {
	const inst = new ExploratoryText();
}