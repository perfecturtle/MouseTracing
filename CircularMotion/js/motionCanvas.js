import {
	randomIntFromRange,
	randomColor,
	distance,
	resolveCollision
} from './utils.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
}

const colors = [
	'#FFA500',
	'#FFDA46',
	'#FFF5C5'
]

// Event Listeners
addEventListener('mousemove', (event) => {
	mouse.x = event.clientX
	mouse.y = event.clientY
})

addEventListener('resize', () => {
	canvas.width = innerWidth
	canvas.height = innerHeight

	init()
})

// Objects
function Particle(x, y, radius, color) {

	this.x = x;
	this.y = y;
	this.radians = Math.random() * Math.PI * 2;
	this.radius = radius;
	this.color = color;
	this.velocity = 0.03 + Math.random() * 0.02;
	this.distanceFromCentre = randomIntFromRange(50, 120);
	this.lastMouse = {
		x: x,
		y: y
	};
	const dragSpeed = 0.05;

	this.update = () => {
		const lastPoint = {
			x: this.x,
			y: this.y
		};
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * dragSpeed;
	
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * dragSpeed;


		this.x = this.lastMouse.x + +Math.cos(this.radians) * this.distanceFromCentre;
		this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCentre;
		this.radians += this.velocity;
		this.draw(lastPoint);

	}


	this.draw = (lastPoint) => {
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
	}


}
// Function to get RGB values of a pixel at specified coordinates
function getPixelRGB(x, y) {
    // Get pixel data at the specified coordinates (1x1 pixel area)
    const imageData = c.getImageData(x, y, 1, 1);
    const pixelData = imageData.data;

    // Extract RGB values from pixel data
    const red = pixelData[0];       // Red value (0-255)
    const green = pixelData[1];     // Green value (0-255)
    const blue = pixelData[2];      // Blue value (0-255)
	const opac = pixelData[3];      // Blue value (0-255)
    // Return RGB values as an object
    return { red, green, blue, opac };
}

function addRGBValues(canvas) {
    // Get the 2D drawing context of the canvas
    // Get the entire pixel data of the canvas
    const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Iterate through each pixel (4 bytes per pixel: RGBA)
    for (let i = 0; i < pixels.length; i += 4) {
        // Add 8 to the Red, Green, and Blue components (and clamp values to 255)
        pixels[i] = Math.min(pixels[i] + 8, 255);         // Red
        pixels[i + 1] = Math.min(pixels[i + 1] + 8, 255); // Green
        pixels[i + 2] = Math.min(pixels[i + 2] + 8, 255); // Blue
        // pixels[i + 3] (Alpha) remains unchanged
    }

    // Put the updated pixel data back onto the canvas
    c.putImageData(imageData, 0, 0);
}

// Implementation
let Particles;

function init() {
	Particles = [];
	for (let i = 0; i < 50; i++) {
		const radius = Math.random() * 2 + 1;

		Particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, randomColor(colors)));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate)
	
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = 'rgba(9, 9, 9, 0.05)';
	Particles.forEach(Particle =>{ 
		Particle.update()
	});

//const pixel1RGB = getPixelRGB(0, 0);
//const pixel2RGB = getPixelRGB(canvas.width/2, innerWidth/2);
//console.log('RGB values of pixel 1:', pixel1RGB);
//console.log('RGB values of pixel 2:', pixel2RGB);


}
c.fillRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = 'rgba(9, 9, 9)';
init()
animate()