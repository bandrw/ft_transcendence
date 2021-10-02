export default class GameBall {
	constructor() {
		this.xPosition = 0
		this.yPosition = 0
		this.radius = 15
		this.speed = 10
		this.angle = 2 * Math.PI * Math.random()
	}

	xPosition: number
	yPosition: number
	radius: number
	speed: number
	angle: number
}
