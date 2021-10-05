export default class GameBall {
	constructor() {
		this.xPosition = 0
		this.yPosition = 0
		this.size = 15
		this.speed = 10
		this.angle = 2 * Math.PI * Math.random()
	}

	xPosition: number
	yPosition: number
	size: number
	speed: number
	angle: number
}
