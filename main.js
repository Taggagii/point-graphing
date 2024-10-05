window.onload = () => {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d')

	const height = canvas.clientHeight;
	const width = canvas.clientWidth;
	
	const small_number = 0.0001;

	const center = {
		x: width / 2,
		y: height / 2
	};

	let zoom = 20;
	let scaleSize = 4;
	const upperLimit = 15;
	const lowerLimit = 5;
	const dashSize = 5;

	const grid = () => {
		context.beginPath();
		context.lineWidth = 1;
		context.moveTo(center.x, 0);
		context.lineTo(center.x, height)
		context.moveTo(0, center.y);
		context.lineTo(width, center.y);
		context.stroke();

		let delta = Math.max(small_number, scaleSize * zoom);

		if (Math.floor(width / delta) > upperLimit) {
			scaleSize *= 2
		} else if (Math.floor(width / delta) < lowerLimit) {
			scaleSize /= 2
		}

		context.beginPath();
		context.lineWidth = 0.2;

		for (let x = center.x % delta; x <= width; x += delta) {
			context.fillText((Math.round(((x - center.x) / zoom) * 10000) / 10000).toString(), x, center.y + dashSize * 3)
			context.moveTo(x, 0)
			context.lineTo(x, height)
		}

		for (let y = center.y % delta; y < height; y += delta) {
			context.fillText((Math.round(((center.y - y) / zoom) * 10000) / 10000).toString(), center.x - dashSize * 3, y)
			context.moveTo(0, y)
			context.lineTo(width, y)
		}

		context.stroke();


	}

	const clear = () => {
		context.beginPath();
		context.clearRect(0, 0, width, height);
		context.fill()
	}


	const points = [
		[1, 5],
		[5, 1]
	]

	const graphPoints = () => {
		points.forEach((point) => {
			const [x, y] = point;
			context.beginPath();
			context.arc(x * zoom + center.x, -y * zoom + center.y, 2, 0, 2 * Math.PI, false);
			context.fill()
		})
	}

	const render = () => {
		clear();
		grid();
		graphPoints()
	}

	render();

	canvas.addEventListener("mousemove", (event) => {
		if (event.buttons != 1) {
			return;
		}

		const {movementX, movementY} = event;

		center.x += movementX;
		center.y += movementY;

		render();
	});

	canvas.addEventListener("wheel", (event) => {
		const direction = -Math.sign(event.deltaY) * zoom * 0.05
		zoom = Math.max(small_number, zoom + direction)

		const rect = canvas.getBoundingClientRect();
		let {x, y} = event;
		x -= rect.x;
		y -= rect.y;

		center.x -= direction * (x - center.x) / zoom;
		center.y -= direction * (y - center.y) / zoom;
		
		render();
	})




}
