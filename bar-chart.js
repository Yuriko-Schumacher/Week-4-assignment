function BarChart() {
	// data, selection, size, margin, state, draw (scale, update), axes, dispatch
	this.data = function (data) {
		if (arguments.length > 0) {
			this._data = data;
			return this;
		}
		return this._data;
	};

	this.selection = function (selection) {
		if (arguments.length > 0) {
			this._selection = selection;
			return this;
		}
		return this._selection;
	};

	this.margin = function (margin) {
		if (arguments.length > 0) {
			this._margin = margin;
			return this;
		}
		return this._margin;
	};

	this.size = function (size) {
		if (arguments.length > 0) {
			this._size = size;

			if (!this._margin) {
				console.error("Set the margins before setting the size");
			}

			this._chartSize = {
				w: this._size.w - this._margin.l - this._margin.r,
				h: this._size.h - this._margin.t - this._margin.b,
			};
			return this;
		}
		return this._size;
	};

	this.setState = function (state) {
		if (arguments.length > 0) {
			this._setState = state;
			return this;
		}
		return this._setState;
	};

	this.draw = function () {
		let filteredData = this._data
			.filter((d) => d.state === this._setState)
			.sort(function (a, b) {
				return b.deaths - a.deaths;
			});

		let xScale = d3
			.scaleBand()
			.domain(filteredData.map((d) => d.county))
			.range([0, this._chartSize.w])
			.padding(0.3);

		let yScale = d3
			.scaleLinear()
			.domain([0, d3.max(filteredData, (d) => d.deaths)])
			.range([this._chartSize.h, 0]);

		this._selection.attr(
			"transform",
			`translate(${this._margin.l}, ${this._margin.t})`
		);

		let rectSelection = this._selection
			.selectAll("rect")
			.data(filteredData);

		rectSelection
			.enter()
			.append("rect")
			.attr("x", (d) => xScale(d.county))
			.attr("y", this._chartSize.h)
			.attr("width", xScale.bandwidth())
			.attr("height", 0)
			.transition()
			.duration(1000)
			.attr("y", (d) => yScale(d.deaths))
			.attr("height", (d) => this._chartSize.h - yScale(d.deaths));

		rectSelection
			.exit()
			.transition()
			.duration(1000)
			.attr("height", 0)
			.remove();

		rectSelection
			.transition()
			.duration(1000)
			.attr("x", (d) => xScale(d.county))
			.attr("y", (d) => yScale(d.deaths))
			.attr("width", xScale.bandwidth())
			.attr("height", (d) => this._chartSize.h - yScale(d.deaths));

		this._drawAxes(xScale, yScale);
	};

	this._drawAxes = function (xScale, yScale) {
		this._drawXAxis(xScale);
		this._drawYAxis(yScale);
	};

	this._drawXAxis = function (xScale) {
		let xAxis = d3.axisBottom(xScale);
		let axisG = this._selection
			.selectAll("g.axis-x")
			.data([1])
			.join("g")
			.classed("axis", true)
			.classed("axis-x", true)
			.attr("transform", `translate(0, ${this._chartSize.h})`);

		axisG.call(xAxis);
	};

	this._drawYAxis = function (yScale) {
		let yAxis = d3.axisLeft(yScale);

		let axisG = this._selection
			.selectAll("g.axis-y")
			.data([1])
			.join("g")
			.classed("axis", true)
			.classed("axis-y", true);

		axisG.call(yAxis);
	};

	this.dispatch = function (dispatch) {
		if (arguments.length > 0) {
			this._dispatch = dispatch;

			this._dispatch.on("changeState", (state) => {
				this.setState(state).draw();
			});

			return this;
		}
		return this._dispatch;
	};
}
