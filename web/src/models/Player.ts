export default class Player {
	constructor() {
		this.yPosition = 0;
		this.controls = {
			arrowUp: false,
			arrowDown: false
		};
		this.username = '';
	}

	yPosition: number
	controls: {
		arrowUp: boolean,
		arrowDown: boolean
	}
	username: string
}
